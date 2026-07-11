import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { getAvailability } from '../services/availabilityService';
import { getProfile, logout } from '../services/authService';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ProviderAvailabilityPage = () => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const profile = await getProfile();
        if (profile.role !== 'provider') {
          navigate('/dashboard', { replace: true });
          return;
        }
        // Fetch own availability
        const data = await getAvailability(); // defaults to current user
        setSlots(
          data.map((s) => ({
            day_of_week: s.day_of_week,
            start_time: s.start_time,
            end_time: s.end_time,
          }))
        );
      } catch (err) {
        logout();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="py-4" style={{ background: '#f4f7fc', minHeight: '100vh' }}>
      <Link to="/dashboard" className="btn btn-outline-secondary btn-sm mb-3">
        <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Back to Dashboard
      </Link>
      <h3 className="fw-bold mb-4">
        <FontAwesomeIcon icon={faClock} className="me-2 text-primary" />
        My Assigned Availability
      </h3>
      <p className="text-muted">Your working hours are set by the administrator. Contact your manager for changes.</p>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body>
          {daysOfWeek.map((day, idx) => {
            const daySlots = slots.filter((s) => s.day_of_week === idx);
            return (
              <div key={idx} className="mb-4">
                <h5 className="fw-bold mb-2">{day}</h5>
                {daySlots.length === 0 ? (
                  <p className="text-muted small">No hours assigned</p>
                ) : (
                  <Table bordered size="sm" className="align-middle">
                    <thead>
                      <tr>
                        <th>Start Time</th>
                        <th>End Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {daySlots.map((slot, i) => (
                        <tr key={i}>
                          <td>{slot.start_time}</td>
                          <td>{slot.end_time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            );
          })}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProviderAvailabilityPage;