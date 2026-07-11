import api from './api';
export const getAvailableSlots = async (serviceId, date) => (await api.get(`/bookings/available-slots/${serviceId}?date=${date}`)).data;
export const createBooking = async (bookingData) => (await api.post('/bookings', bookingData)).data;
export const getMyBookings = async () => (await api.get('/bookings/mine')).data;
export const cancelBooking = async (bookingId) => (await api.put(`/bookings/${bookingId}/cancel`)).data;
export const updateBookingStatus = async (bookingId, status) => (await api.put(`/bookings/${bookingId}/status`, { status })).data;