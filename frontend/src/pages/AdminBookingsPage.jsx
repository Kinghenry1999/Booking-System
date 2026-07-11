import React, { useEffect, useState, useCallback } from 'react';
import { Container, Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getProfile, logout } from '../services/authService';

const AdminBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAllBookings = useCallback(async () => {
    try {
      const profile = await getProfile();
      if (profile.role !== 'admin') {
        logout();
        navigate('/login');
        return;
      }
      const { data } = await api.get('/bookings/all');
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container fluid className="py-4" style={{ background: '#f4f7fc', minHeight: '100vh' }}>
      <Link to="/dashboard" className="btn btn-outline-secondary btn-sm mb-3">
        <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Back to Dashboard
      </Link>

      <h3 className="fw-bold mb-4">
        <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
        All Bookings
      </h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-muted text-center">No bookings found.</p>
          ) : (
            <Table responsive hover className="align-middle mb-0">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Provider</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="fw-semibold">{b.service_name}</td>
                    <td>
                      {b.customer_name}<br /><small className="text-muted">{b.customer_email}</small>
                    </td>
                    <td>
                      {b.provider_name}<br /><small className="text-muted">{b.provider_email}</small>
                    </td>
                    <td>{formatDate(b.start_time)}</td>
                    <td>
                      {formatTime(b.start_time)} – {formatTime(b.end_time)}
                    </td>
                    <td>
                      <Badge bg={
                        b.status === 'confirmed' ? 'success' :
                        b.status === 'cancelled' ? 'danger' :
                        'secondary'
                      }>
                        {b.status}
                      </Badge>
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

export default AdminBookingsPage;