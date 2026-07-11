const pool = require('../config/db');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Availability = require('../models/Availability');
const {
  sendEmail,
  bookingConfirmationCustomer,
  bookingConfirmationProvider,
  bookingCancellationCustomer,
  bookingCancellationProvider,
  bookingCompletedCustomer,
} = require('../utils/emailService');

// ---------- Helper: Get full booking details with names/emails ----------
const getBookingDetailById = async (bookingId) => {
  const query = `
    SELECT b.*,
           s.name AS service_name,
           cust.name AS customer_name, cust.email AS customer_email,
           prov.name AS provider_name, prov.email AS provider_email
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    JOIN users cust ON b.customer_id = cust.id
    JOIN users prov ON b.provider_id = prov.id
    WHERE b.id = $1
  `;
  const { rows } = await pool.query(query, [bookingId]);
  return rows[0];
};

// ---------- Available Slots (unchanged) ----------
const getAvailableSlots = async (serviceId, date) => {
  const service = await Service.findById(serviceId);
  if (!service) throw new Error('Service not found');
  if (!service.provider_id) throw new Error('Service has no provider assigned');

  const dayOfWeek = new Date(date).getDay();
  const availabilities = await Availability.findByDayAndProvider(dayOfWeek, service.provider_id);
  if (availabilities.length === 0) return [];

  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59`);
  const existingBookings = await Booking.findOverlapping(dayStart, dayEnd, service.provider_id);

  const slots = [];
  for (const av of availabilities) {
    let slotStart = new Date(`${date}T${av.start_time}`);
    const slotEnd = new Date(`${date}T${av.end_time}`);
    const durationMs = service.duration * 60 * 1000;

    while (slotStart.getTime() + durationMs <= slotEnd.getTime()) {
      const candidateEnd = new Date(slotStart.getTime() + durationMs);

      const isOverlapping = existingBookings.some(booking => {
        const bStart = new Date(booking.start_time);
        const bEnd = new Date(booking.end_time);
        return slotStart < bEnd && candidateEnd > bStart;
      });

      if (!isOverlapping) {
        slots.push({
          start: slotStart.toISOString(),
          end: candidateEnd.toISOString(),
        });
      }

      slotStart = new Date(slotStart.getTime() + 30 * 60 * 1000);
    }
  }
  return slots;
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });
    const slots = await getAvailableSlots(serviceId, date);
    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// ---------- Create Booking with emails ----------
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, startTime } = req.body;
    const customerId = req.user.id;

    if (!serviceId || !startTime) {
      return res.status(400).json({ message: 'serviceId and startTime are required' });
    }

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const start = new Date(startTime);
    const end = new Date(start.getTime() + service.duration * 60 * 1000);

    const overlapping = await Booking.findOverlapping(start, end, service.provider_id);
    if (overlapping.length > 0) {
      return res.status(409).json({ message: 'Slot no longer available' });
    }

    const booking = await Booking.create({
      customerId,
      serviceId,
      providerId: service.provider_id,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    });

    // Send emails (non‑blocking)
    try {
      const fullBooking = await getBookingDetailById(booking.id);
      if (fullBooking) {
        const customerEmail = fullBooking.customer_email;
        const providerEmail = fullBooking.provider_email;
        await Promise.all([
          sendEmail({
            to: customerEmail,
            subject: `Booking Confirmed: ${fullBooking.service_name}`,
            html: bookingConfirmationCustomer(fullBooking),
          }),
          sendEmail({
            to: providerEmail,
            subject: `New Booking: ${fullBooking.service_name}`,
            html: bookingConfirmationProvider(fullBooking),
          }),
        ]);
      }
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr);
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------- Get My Bookings (unchanged) ----------
exports.getMyBookings = async (req, res) => {
  try {
    if (req.user.role === 'provider') {
      return res.json(await Booking.findByProviderId(req.user.id));
    }
    res.json(await Booking.findByCustomerId(req.user.id));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------- Cancel Booking with emails ----------
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.cancel(req.params.id, req.user.id, req.user.role);
    if (!booking) return res.status(404).json({ message: 'Booking not found or unauthorized' });

    // Send cancellation emails (non‑blocking)
    try {
      const fullBooking = await getBookingDetailById(req.params.id);
      if (fullBooking) {
        const customerEmail = fullBooking.customer_email;
        const providerEmail = fullBooking.provider_email;
        await Promise.all([
          sendEmail({
            to: customerEmail,
            subject: `Booking Cancelled: ${fullBooking.service_name}`,
            html: bookingCancellationCustomer(fullBooking),
          }),
          sendEmail({
            to: providerEmail,
            subject: `Booking Cancelled: ${fullBooking.service_name}`,
            html: bookingCancellationProvider(fullBooking),
          }),
        ]);
      }
    } catch (emailErr) {
      console.error('Cancellation email error:', emailErr);
    }

    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------- Update Booking Status (complete) with email ----------
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['completed', 'confirmed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const booking = await Booking.updateStatus(req.params.id, req.user.id, status);
    if (!booking) return res.status(404).json({ message: 'Booking not found or not your service' });

    // Send completion email to customer (non‑blocking)
    if (status === 'completed') {
      try {
        const fullBooking = await getBookingDetailById(req.params.id);
        if (fullBooking) {
          await sendEmail({
            to: fullBooking.customer_email,
            subject: `Session Completed: ${fullBooking.service_name}`,
            html: bookingCompletedCustomer(fullBooking),
          });
        }
      } catch (emailErr) {
        console.error('Completion email error:', emailErr);
      }
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------- Admin: Get All Bookings (unchanged) ----------
exports.getAllBookings = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const query = `
      SELECT
        b.*,
        s.name AS service_name,
        s.duration,
        cust.name AS customer_name,
        cust.email AS customer_email,
        prov.name AS provider_name,
        prov.email AS provider_email
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users cust ON b.customer_id = cust.id
      JOIN users prov ON b.provider_id = prov.id
      ORDER BY b.start_time DESC
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};