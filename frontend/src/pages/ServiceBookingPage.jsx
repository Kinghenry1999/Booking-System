import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  ListGroup,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faClock,
  faArrowLeft,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { getAvailableSlots, createBooking } from '../services/bookingService';
import { getAllServices } from '../services/serviceService';

const ServiceBookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchService = async () => {
      try {
        const services = await getAllServices();
        const found = services.find(s => s.id.toString() === serviceId);
        if (!found) {
          setError('Service not found');
          return;
        }
        setService(found);
      } catch (err) {
        setError('Failed to load service');
      }
    };
    fetchService();
  }, [serviceId]);

  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const data = await getAvailableSlots(serviceId, selectedDate);
        setSlots(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedDate, serviceId]);

  const handleBooking = async () => {
    if (!selectedSlot) return;
    try {
      await createBooking({ serviceId, startTime: selectedSlot.start });
      setBookingStatus('success');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  if (error) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">{error}</Alert>
        <Link to="/services" className="btn btn-outline-primary">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Services
        </Link>
      </Container>
    );
  }

  if (!service) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (bookingStatus === 'success') {
    return (
      <Container className="py-5 text-center">
        <FontAwesomeIcon icon={faCheckCircle} size="4x" className="text-success mb-4" />
        <h2>Booking Confirmed!</h2>
        <p>Your session for <strong>{service.name}</strong> has been booked.</p>
        <p className="text-muted">
          {new Date(selectedSlot.start).toLocaleString()} – {new Date(selectedSlot.end).toLocaleTimeString()}
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          <Link to="/services" className="btn btn-outline-secondary">Book Another Service</Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ background: '#f4f7fc', minHeight: '100vh' }}>
      <Link to="/services" className="btn btn-outline-secondary btn-sm mb-3">
        <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Back to Services
      </Link>

      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body>
          <h3 className="fw-bold">{service.name}</h3>
          <p className="text-muted">{service.description}</p>
          <div className="d-flex gap-3">
            <span><FontAwesomeIcon icon={faClock} /> {service.duration} min</span>
            <span className="fw-bold text-primary">${service.price}</span>
          </div>
        </Card.Body>
      </Card>

      <Row>
        <Col md={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body>
              <h5 className="fw-bold mb-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
                Select a Date
              </h5>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null);
                }}
                min={today}
              />
              <p className="text-muted small mt-2">Only days with your availability are shown.</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body>
              <h5 className="fw-bold mb-3">
                <FontAwesomeIcon icon={faClock} className="me-2 text-primary" />
                Available Times
              </h5>
              {!selectedDate ? (
                <p className="text-muted">Please select a date first.</p>
              ) : loadingSlots ? (
                <Spinner animation="border" size="sm" />
              ) : slots.length === 0 ? (
                <p className="text-muted">No available slots for this date.</p>
              ) : (
                <ListGroup>
                  {slots.map((slot, idx) => (
                    <ListGroup.Item
                      key={idx}
                      active={selectedSlot?.start === slot.start}
                      onClick={() => setSelectedSlot(slot)}
                      action
                      className="d-flex justify-content-between align-items-center"
                    >
                      {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' - '}
                      {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {selectedSlot && (
        <div className="text-center mt-4">
          <Button size="lg" onClick={handleBooking} className="px-5">
            Confirm Booking
          </Button>
        </div>
      )}
    </Container>
  );
};

export default ServiceBookingPage;