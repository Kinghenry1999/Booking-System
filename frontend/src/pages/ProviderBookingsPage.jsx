import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Spinner,
  Alert,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCheck,
  faTimes,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import { getMyBookings, cancelBooking, updateBookingStatus } from '../services/bookingService';
import { getProfile, logout } from '../services/authService';

const ProviderBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      const data = await getMyBookings(); // returns provider's bookings when role = provider
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const profile = await getProfile();
        if (profile.role !== 'provider') {
          navigate('/dashboard', { replace: true });
          return;
        }
        await fetchBookings();
      } catch (err) {
        logout();
        navigate('/login');
      }
    };
    checkRole();
  }, [navigate, fetchBookings]);

  const handleMarkCompleted = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, 'completed');
      setMessage({ type: 'success', text: 'Booking marked as completed.' });
      fetchBookings();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to update booking.' });
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(bookingId);
      setMessage({ type: 'success', text: 'Booking cancelled.' });
      fetchBookings();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Cancellation failed.' });
    }
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
          <p className="text-muted mt-2">View and manage your assigned bookings.</p>
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
            <div className="text-center py-5 text-muted">
              No bookings assigned to you yet.
            </div>
          ) : (
            <Table responsive hover className="align-middle mb-0">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="fw-semibold">{b.service_name}</td>
                    <td>{b.customer_name}</td>
                    <td>
                      {new Date(b.start_time).toLocaleString()} –{' '}
                      {new Date(b.end_time).toLocaleTimeString()}
                    </td>
                    <td>
                      <Badge bg={b.status === 'confirmed' ? 'success' : 'secondary'}>
                        {b.status}
                      </Badge>
                    </td>
                    <td>
                      {b.status === 'confirmed' && (
                        <>
                          <Button
                            variant="outline-success"
                            size="sm"
                            className="me-1"
                            onClick={() => handleMarkCompleted(b.id)}
                          >
                            <FontAwesomeIcon icon={faCheck} /> Complete
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleCancel(b.id)}
                          >
                            <FontAwesomeIcon icon={faTimes} /> Cancel
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProviderBookingsPage;