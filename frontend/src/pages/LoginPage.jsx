import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { login } from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)',
        padding: '20px',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              {/* Card header with icon and title */}
              <div className="bg-white text-center pt-4 pb-3">
                <div
                  className="mx-auto mb-3 rounded-circle bg-primary d-flex align-items-center justify-content-center"
                  style={{ width: '70px', height: '70px' }}
                >
                  <FontAwesomeIcon icon={faSignInAlt} size="2x" color="white" />
                </div>
                <h3 className="fw-bold">Welcome Back</h3>
                <p className="text-muted">Log in to manage your bookings</p>
              </div>

              <Card.Body className="px-4 pb-4">
                {error && (
                  <Alert variant="danger" className="py-2 text-center small">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Email field */}
                  <Form.Group className="mb-3" controlId="loginEmail">
                    <Form.Label className="fw-semibold small">
                      <FontAwesomeIcon icon={faEnvelope} className="me-2 text-primary" />
                      Email address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="py-2 px-3 rounded-3 border-1"
                    />
                  </Form.Group>

                  {/* Password field */}
                  <Form.Group className="mb-4" controlId="loginPassword">
                    <Form.Label className="fw-semibold small">
                      <FontAwesomeIcon icon={faLock} className="me-2 text-primary" />
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="py-2 px-3 rounded-3 border-1"
                    />
                  </Form.Group>

                  {/* Submit button */}
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="w-100 py-2 fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                    size="lg"
                  >
                    {loading ? (
                      'Signing in…'
                    ) : (
                      <>
                        Log In <FontAwesomeIcon icon={faArrowRight} />
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <span className="text-muted small">Don't have an account? </span>
                  <Link to="/register" className="fw-semibold text-decoration-none small">
                    Sign up here
                  </Link>
                </div>
              </Card.Body>
            </Card>

            {/* Optional back to home link */}
            <div className="text-center mt-3">
              <Link to="/" className="text-white text-decoration-none small fw-semibold">
                ← Back to Home
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;