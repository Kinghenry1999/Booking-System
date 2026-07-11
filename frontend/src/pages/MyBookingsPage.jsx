import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Spinner,
  Alert,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faArrowLeft,
  faTimes,
  faClock,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { getMyBookings, cancelBooking } from '../services/bookingService';
import { getProfile, logout } from '../services/authService';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
        await fetchBookings();
      } catch (err) {
        logout();
        navigate('/login');
      }
    };
    init();
  }, [navigate, fetchBookings]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(bookingId);
    try {
      await cancelBooking(bookingId);
      setMessage({ type: 'success', text: 'Booking cancelled successfully.' });
      // Refresh the list
      await fetchBookings();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to cancel booking.' });
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="py-4" style={{ background: '#f4f7fc', minHeight: '100vh' }}>
      <Row className="mb-4">
        <Col>
          <Link to="/dashboard" className="btn btn-outline-secondary btn-sm me-2">
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Back to Dashboard
          </Link>
          <h3 className="d-inline fw-bold">
            <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
            My Bookings
          </h3>
          <p className="text-muted mt-2">View and manage your upcoming and past bookings.</p>
        </Col>
      </Row>

      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body>
          {bookings.length === 0 ? (
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faList} size="3x" className="text-muted mb-3" />
              <h5>No bookings yet</h5>
              <p className="text-muted">When you book a service, it will appear here.</p>
              <Button as={Link} to="/services" variant="primary">
                Browse Services
              </Button>
            </div>
          ) : (
            <Table responsive hover className="align-middle mb-0">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const isUpcoming = new Date(booking.start_time) > new Date() && booking.status === 'confirmed';
                  return (
                    <tr key={booking.id}>
                      <td className="fw-semibold">{booking.service_name}</td>
                      <td>{formatDate(booking.start_time)}</td>
                      <td>
                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </td>
                      <td>
                        <Badge bg={
                          booking.status === 'confirmed' ? 'success' :
                          booking.status === 'cancelled' ? 'danger' :
                          booking.status === 'completed' ? 'info' : 'secondary'
                        }>
                          {booking.status}
                        </Badge>
                      </td>
                      <td>
                        {isUpcoming && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancellingId === booking.id}
                          >
                            {cancellingId === booking.id ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              <FontAwesomeIcon icon={faTimes} className="me-1" />
                            )}
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MyBookingsPage;