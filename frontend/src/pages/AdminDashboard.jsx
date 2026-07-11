import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Nav, Button, Card, Badge, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faUsers,
  faConciergeBell,
  faClock,
  faSignOutAlt,
  faUserCircle,
  faUserPlus,
  faCalendarCheck,
  faList,
  faChartLine,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { logout } from '../services/authService';
import api from '../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0d6efd', '#6610f2', '#fd7e14', '#20c997', '#dc3545', '#6f42c1'];

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/analytics'),
        ]);
        setStats(statsRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const statCards = stats
    ? [
        { icon: faUsers, label: 'Providers', value: stats.providers, color: 'primary' },
        { icon: faConciergeBell, label: 'Services', value: stats.services, color: 'success' },
        { icon: faCalendarCheck, label: 'Total Bookings', value: stats.totalBookings, color: 'warning' },
        { icon: faChartLine, label: 'Revenue', value: `$${stats.revenue}`, color: 'info' },
      ]
    : [];

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f4f7fc' }}>
      {/* Hamburger – mobile only */}
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
        style={{ width: '250px', minWidth: '250px', zIndex: 1045, overflowY: 'auto' }}
      >
        <div className="text-center mb-4 mt-3">
          <FontAwesomeIcon icon={faUserCircle} size="3x" />
          <h5 className="fw-bold mt-2">{user.name}</h5>
          <Badge bg="danger">Admin</Badge>
        </div>
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/dashboard" className="text-white mb-1 rounded active" onClick={() => setSidebarOpen(false)}>Dashboard</Nav.Link>
          <Nav.Link as={Link} to="/admin/providers" className="text-white mb-1 rounded" onClick={() => setSidebarOpen(false)}>Providers</Nav.Link>
          <Nav.Link as={Link} to="/admin/services" className="text-white mb-1 rounded" onClick={() => setSidebarOpen(false)}>Services</Nav.Link>
          <Nav.Link as={Link} to="/admin/bookings" className="text-white mb-1 rounded" onClick={() => setSidebarOpen(false)}>All Bookings</Nav.Link>
          <Nav.Link as={Link} to="/admin/availability" className="text-white mb-1 rounded" onClick={() => setSidebarOpen(false)}>Availability</Nav.Link>
        </Nav>
        <div className="mt-auto">
          <Button variant="outline-light" size="sm" onClick={handleLogout} className="w-100">
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: sidebarOpen ? '250px' : '0' }}>
        <h4 className="fw-bold mb-4 mt-md-0 mt-5">Admin Dashboard</h4>

        {loading ? (
          <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>
        ) : (
          <>
            {/* Top stats cards */}
            <Row className="g-4 mb-4">
              {statCards.map((stat, idx) => (
                <Col key={idx} xs={12} sm={6} xl={3}>
                  <Card className="border-0 shadow-sm rounded-4 h-100">
                    <Card.Body className="d-flex align-items-center justify-content-between">
                      <div>
                        <p className="text-muted small mb-1">{stat.label}</p>
                        <h3 className="fw-bold mb-0">{stat.value}</h3>
                      </div>
                      <div className={`rounded-3 bg-${stat.color} bg-opacity-10 p-3`}>
                        <FontAwesomeIcon icon={stat.icon} className={`text-${stat.color}`} size="lg" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Additional stat row (upcoming/completed/cancelled) */}
            {stats && (
              <Row className="g-4 mb-4">
                <Col xs={12} sm={6} xl={4}>
                  <Card className="border-0 shadow-sm rounded-4">
                    <Card.Body>
                      <p className="text-muted small mb-1">Upcoming Bookings</p>
                      <h4 className="fw-bold">{stats.upcomingBookings}</h4>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} sm={6} xl={4}>
                  <Card className="border-0 shadow-sm rounded-4">
                    <Card.Body>
                      <p className="text-muted small mb-1">Completed Bookings</p>
                      <h4 className="fw-bold">{stats.completedBookings}</h4>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} sm={6} xl={4}>
                  <Card className="border-0 shadow-sm rounded-4">
                    <Card.Body>
                      <p className="text-muted small mb-1">Cancelled Bookings</p>
                      <h4 className="fw-bold">{stats.cancelledBookings}</h4>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}

            {/* Charts section */}
            {analytics && (
              <>
                <Row className="g-4 mb-4">
                  {/* Bookings Over Time (Line Chart) */}
                  <Col lg={8}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                      <Card.Body>
                        <h5 className="fw-bold mb-3">Bookings Over Time</h5>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={analytics.monthlyBookings}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="count"
                              name="Bookings"
                              stroke="#0d6efd"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Bookings Per Provider (Pie Chart) */}
                  <Col lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                      <Card.Body>
                        <h5 className="fw-bold mb-3">Bookings Per Provider</h5>
                        {analytics.bookingsByProvider.length > 0 ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={analytics.bookingsByProvider}
                                dataKey="bookings"
                                nameKey="provider_name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                              >
                                {analytics.bookingsByProvider.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <p className="text-muted text-center mt-5">No data yet</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Revenue Per Service (Bar Chart) */}
                <Row className="g-4 mb-4">
                  <Col xs={12}>
                    <Card className="border-0 shadow-sm rounded-4">
                      <Card.Body>
                        <h5 className="fw-bold mb-3">Revenue Per Service</h5>
                        {analytics.revenueByService.length > 0 ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.revenueByService}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value) => `$${value}`} />
                              <Legend />
                              <Bar dataKey="revenue" name="Revenue" fill="#0d6efd" radius={[6, 6, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <p className="text-muted text-center py-5">No completed bookings yet</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}

            {/* Quick Actions */}
            <Row>
              <Col md={6} className="mb-4">
                <Card className="border-0 shadow-sm rounded-4">
                  <Card.Body>
                    <h5 className="fw-bold">Quick Actions</h5>
                    <div className="d-grid gap-2 mt-3">
                      <Button as={Link} to="/admin/providers" variant="outline-primary" className="text-start">
                        <FontAwesomeIcon icon={faUserPlus} className="me-2" />Manage Providers
                      </Button>
                      <Button as={Link} to="/admin/services" variant="outline-primary" className="text-start">
                        <FontAwesomeIcon icon={faConciergeBell} className="me-2" />Manage Services
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 shadow-sm rounded-4">
                  <Card.Body>
                    <h5 className="fw-bold">Recent Bookings</h5>
                    <p className="text-muted">
                      Go to <Link to="/admin/bookings">All Bookings</Link> for the complete list.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;