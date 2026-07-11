import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faLock,
  faUserPlus,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { register } from '../services/authService';

const RegisterPage = () => {
  const [name, setName] = useState('');
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
      // Always register as a customer – provider accounts are created by the admin only
      await register({ name, email, password, role: 'customer' });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
              <div className="bg-white text-center pt-4 pb-3">
                <div
                  className="mx-auto mb-3 rounded-circle bg-primary d-flex align-items-center justify-content-center"
                  style={{ width: '70px', height: '70px' }}
                >
                  <FontAwesomeIcon icon={faUserPlus} size="2x" color="white" />
                </div>
                <h3 className="fw-bold">Create Account</h3>
                <p className="text-muted">Start booking services in seconds</p>
              </div>

              <Card.Body className="px-4 pb-4">
                {error && (
                  <Alert variant="danger" className="py-2 text-center small">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="registerName">
                    <Form.Label className="fw-semibold small">
                      <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
                      Full Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="py-2 px-3 rounded-3 border-1"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="registerEmail">
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

                  <Form.Group className="mb-4" controlId="registerPassword">
                    <Form.Label className="fw-semibold small">
                      <FontAwesomeIcon icon={faLock} className="me-2 text-primary" />
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="py-2 px-3 rounded-3 border-1"
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="w-100 py-2 fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                    size="lg"
                  >
                    {loading ? (
                      'Creating account…'
                    ) : (
                      <>
                        Sign Up <FontAwesomeIcon icon={faArrowRight} />
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <span className="text-muted small">Already have an account? </span>
                  <Link to="/login" className="fw-semibold text-decoration-none small">
                    Log in
                  </Link>
                </div>
              </Card.Body>
            </Card>

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

export default RegisterPage;