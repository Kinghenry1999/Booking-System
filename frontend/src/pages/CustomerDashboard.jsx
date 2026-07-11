import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Nav, Button, Card, Table, Badge, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOutAlt,
  faUserCircle,
  faCalendarAlt,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { logout } from '../services/authService';
import { getMyBookings } from '../services/bookingService';

const CustomerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try { setBookings(await getMyBookings()); } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.start_time) > new Date());

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f4f7fc' }}>
      <Button
        variant="dark"
        className="d-md-none position-fixed top-0 start-0 m-2"
        style={{ zIndex: 1050 }}
        onClick={toggleSidebar}
      >
        <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
      </Button>

      {sidebarOpen && (
        <div
          className="d-md-none position-fixed top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`bg-dark text-white d-flex flex-column p-3 ${
          sidebarOpen ? 'd-block position-fixed start-0 top-0 h-100' : 'd-none'
        } d-md-flex`}
        style={{
          width: '250px',
          minWidth: '250px',
          zIndex: 1045,
          overflowY: 'auto',
        }}
      >
        <div className="text-center mb-4 mt-3">
          <FontAwesomeIcon icon={faUserCircle} size="3x" />
          <h5 className="fw-bold mt-2">{user.name}</h5>
          <Badge bg="success">Customer</Badge>
        </div>
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/dashboard" className="text-white mb-1 rounded active" onClick={() => setSidebarOpen(false)}>Dashboard</Nav.Link>
          <Nav.Link as={Link} to="/my-bookings" className="text-white mb-1 rounded" onClick={() => setSidebarOpen(false)}>My Bookings</Nav.Link>
          <Nav.Link as={Link} to="/services" className="text-white mb-1 rounded" onClick={() => setSidebarOpen(false)}>Book a Service</Nav.Link>
        </Nav>
        <div className="mt-auto">
          <Button variant="outline-light" size="sm" onClick={handleLogout} className="w-100">
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />Logout
          </Button>
        </div>
      </div>

      <div className="flex-grow-1 p-4" style={{ marginLeft: sidebarOpen ? '250px' : '0' }}>
        <h4 className="fw-bold mb-4 mt-md-0 mt-5">Welcome, {user.name.split(' ')[0]}!</h4>
        <Row className="g-4 mb-4">
          <Col xs={12} sm={6} xl={3}>
            <Card className="border-0 shadow-sm rounded-4"><Card.Body><p className="text-muted small">Upcoming</p><h3>{upcoming.length}</h3></Card.Body></Card>
          </Col>
        </Row>
        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body>
            <h5 className="fw-bold">Upcoming Bookings</h5>
            {loading ? <Spinner animation="border" size="sm" /> :
              bookings.length === 0 ? <p className="text-muted">No bookings yet.</p> :
              <Table responsive hover>
                <thead><tr><th>Service</th><th>Provider</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {upcoming.map(b => (
                    <tr key={b.id}><td>{b.service_name}</td><td>{b.provider_name || 'N/A'}</td><td>{new Date(b.start_time).toLocaleString()}</td><td><Badge bg="success">{b.status}</Badge></td></tr>
                  ))}
                </tbody>
              </Table>
            }
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;