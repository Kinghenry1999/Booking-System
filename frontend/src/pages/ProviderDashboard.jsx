import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Nav, Button, Card, Table, Badge, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOutAlt,
  faUserCircle,
  faCalendarAlt,
  faClock,
  faConciergeBell,
  faList,
  faCalendarWeek,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { logout } from '../services/authService';
import { getMyBookings } from '../services/bookingService';
import { getMyServices } from '../services/serviceService';
import { getAvailability } from '../services/availabilityService';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ProviderDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [b, s, a] = await Promise.all([
          getMyBookings(),
          getMyServices(),
          getAvailability(),
        ]);
        setBookings(b);
        setServices(s);
        setAvailabilities(a);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' && new Date(b.start_time) > new Date()
  );

  // ... computeAvailabilitySummary (same as before)
  const computeAvailabilitySummary = () => {
    // (unchanged – copy from previous ProviderDashboard code)
    // I’ll include it for completeness, but you can keep the existing implementation
    if (!availabilities || availabilities.length === 0) {
      return { nextWorkingDay: null, totalWeeklyHours: 0 };
    }
    const today = new Date();
    const todayIndex = today.getDay();
    let nextWorkingDay = null;
    let totalMinutes = 0;
    const slotsByDay = {};
    availabilities.forEach((slot) => {
      if (!slotsByDay[slot.day_of_week]) slotsByDay[slot.day_of_week] = [];
      slotsByDay[slot.day_of_week].push(slot);
    });
    for (let i = 0; i < 7; i++) {
      const checkDay = (todayIndex + i) % 7;
      if (slotsByDay[checkDay] && slotsByDay[checkDay].length > 0) {
        const daySlots = slotsByDay[checkDay];
        const firstSlot = daySlots[0];
        const dayName = daysOfWeek[checkDay];
        if (i === 0) {
          const nowTime = today.getHours() * 60 + today.getMinutes();
          const remainingSlots = daySlots.filter((s) => {
            const startParts = s.start_time.split(':').map(Number);
            const startMins = startParts[0] * 60 + startParts[1];
            return startMins > nowTime;
          });
          if (remainingSlots.length > 0) {
            nextWorkingDay = {
              day: 'Today',
              fullDay: dayName,
              startTime: remainingSlots[0].start_time,
              endTime: remainingSlots[remainingSlots.length - 1].end_time,
            };
            break;
          }
          continue;
        }
        nextWorkingDay = {
          day: i === 1 ? 'Tomorrow' : dayName,
          fullDay: dayName,
          startTime: firstSlot.start_time,
          endTime: daySlots[daySlots.length - 1].end_time,
        };
        break;
      }
    }
    availabilities.forEach((slot) => {
      const startParts = slot.start_time.split(':').map(Number);
      const endParts = slot.end_time.split(':').map(Number);
      totalMinutes += (endParts[0] * 60 + endParts[1]) - (startParts[0] * 60 + startParts[1]);
    });
    const totalWeeklyHours = (totalMinutes / 60).toFixed(1);
    return { nextWorkingDay, totalWeeklyHours };
  };

  const { nextWorkingDay, totalWeeklyHours } = computeAvailabilitySummary();

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f4f7fc' }}>
      {/* Hamburger */}
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

      {/* Sidebar */}
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
          <Badge bg="primary">Provider</Badge>
        </div>
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/dashboard" className="text-white mb-1 rounded active" onClick={() => setSidebarOpen(false)}>Dashboard</Nav.Link>
          <Nav.Link as={Link} to="/provider/bookings" className="text-white mb-1 rounded" onClick={() => setSidebarOpen(false)}>My Bookings</Nav.Link>
          <Nav.Link as={Link} to="/provider/services" className="text-white mb-1 rounded" onClick={() => setSidebarOpen(false)}>My Services</Nav.Link>
          <Nav.Link as={Link} to="/provider/availability" className="text-white mb-1 rounded" onClick={() => setSidebarOpen(false)}>My Availability</Nav.Link>
        </Nav>
        <div className="mt-auto">
          <Button variant="outline-light" size="sm" onClick={handleLogout} className="w-100">
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: sidebarOpen ? '250px' : '0' }}>
        <h4 className="fw-bold mb-4 mt-md-0 mt-5">Welcome, {user.name.split(' ')[0]}!</h4>

        <Row className="g-4 mb-4">
          <Col xs={12} sm={6} xl={3}>
            <Card className="border-0 shadow-sm rounded-4"><Card.Body><p className="text-muted small mb-1"><FontAwesomeIcon icon={faConciergeBell} className="me-1" />My Services</p><h3 className="fw-bold">{services.length}</h3></Card.Body></Card>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Card className="border-0 shadow-sm rounded-4"><Card.Body><p className="text-muted small mb-1"><FontAwesomeIcon icon={faCalendarAlt} className="me-1" />Upcoming Bookings</p><h3 className="fw-bold">{upcomingBookings.length}</h3></Card.Body></Card>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Card className="border-0 shadow-sm rounded-4"><Card.Body><p className="text-muted small mb-1"><FontAwesomeIcon icon={faClock} className="me-1" />Weekly Hours</p><h3 className="fw-bold">{totalWeeklyHours}h</h3></Card.Body></Card>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Card className="border-0 shadow-sm rounded-4"><Card.Body><p className="text-muted small mb-1"><FontAwesomeIcon icon={faCalendarWeek} className="me-1" />Next Working Day</p>{nextWorkingDay ? <div><h5 className="fw-bold mb-0">{nextWorkingDay.day}</h5><small className="text-muted">{nextWorkingDay.start_time} – {nextWorkingDay.end_time}</small></div> : <p className="text-muted mb-0">No schedule</p>}</Card.Body></Card>
          </Col>
        </Row>

        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body>
            <h5 className="fw-bold mb-3">Upcoming Bookings</h5>
            {loading ? <div className="text-center py-3"><Spinner animation="border" size="sm" /></div> :
              bookings.length === 0 ? <p className="text-muted">No bookings yet.</p> :
              <Table responsive hover>
                <thead><tr><th>Service</th><th>Customer</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {upcomingBookings.map((b) => (
                    <tr key={b.id}><td>{b.service_name}</td><td>{b.customer_name}</td><td>{new Date(b.start_time).toLocaleString()}</td><td><Badge bg="success">{b.status}</Badge></td></tr>
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

export default ProviderDashboard;