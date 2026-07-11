import React from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Button,
  Form,
  FormControl,
  Card,
  Carousel,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faTools,
  faHome,
  faCar,
  faLaptop,
  faUsers,
  faCalendarCheck,
  faStar,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
  return (
    <>
      {/* ========== NAVBAR ========== */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <FontAwesomeIcon icon={faTools} className="me-2" />
            YourName Booking   {/* Replace with your brand */}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/services">My Services</Nav.Link>
              <Nav.Link href="#how-it-works">How It Works</Nav.Link>
              <Nav.Link href="#testimonials">Testimonials</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Button as={Link} to="/register" variant="outline-light" className="ms-2">
                Sign Up
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ========== HERO SECTION ========== */}
      <section
        id="home"
        className="d-flex align-items-center text-white"
        style={{
          background: 'linear-gradient(135deg, #0d6efd, #6610f2)',
          minHeight: '90vh',
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h1 className="display-3 fw-bold">
                Book a Session <br /> Directly With Me
              </h1>
              <p className="lead my-4">
                I offer personalized services tailored to your needs. 
                Skip the marketplace — get one‑on‑one attention from a dedicated professional.
              </p>
              <Form className="d-flex mt-4">
                <FormControl
                  type="text"
                  placeholder="What do you need help with?"
                  className="me-2 py-3"
                  size="lg"
                />
                <Button as={Link} to="/services" variant="warning" size="lg" className="px-4">
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </Form>
              <div className="mt-4">
                <span className="me-3">
                  <FontAwesomeIcon icon={faUsers} className="me-1" /> 500+ Happy Clients
                </span>
                <span>
                  <FontAwesomeIcon icon={faCalendarCheck} className="me-1" /> 1,000+ Sessions Completed
                </span>
              </div>
            </Col>
            <Col lg={6} className="text-center">
           <img
  src="/images/cover_image.jpeg"
  alt="Service professional"
  className="img-fluid rounded-4 shadow-lg"
  style={{ maxHeight: '450px', objectFit: 'cover' }}
/>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ========== SERVICES SECTION ========== */}
      <section id="services" className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">My Services</h2>
            <p className="text-muted">
              Every service is delivered personally by me — with care, expertise, and attention to detail.
            </p>
          </div>
          <Row>
            {[
              { icon: faHome, title: 'Home Consultation', desc: 'Personalized home organization and design advice.' },
              { icon: faTools, title: 'Tech Support', desc: 'One‑on‑one computer tutoring and troubleshooting.' },
              { icon: faCar, title: 'Auto Advice', desc: 'Car buying consultation and maintenance planning.' },
              { icon: faLaptop, title: 'Web Development', desc: 'Custom website or app development, start to finish.' },
            ].map((service, idx) => (
              <Col md={3} key={idx} className="mb-4">
                <Card className="border-0 shadow-sm h-100 text-center p-4">
                  <div className="text-primary mb-3">
                    <FontAwesomeIcon icon={service.icon} size="2x" />
                  </div>
                  <Card.Title className="fw-bold">{service.title}</Card.Title>
                  <Card.Text className="text-muted small">{service.desc}</Card.Text>
                  <Button as={Link} to="/services" variant="outline-primary" size="sm" className="mt-auto">
                    Learn More
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">How It Works</h2>
            <p className="text-muted">Simple, transparent, and completely hassle‑free</p>
          </div>
          <Row className="g-4">
            {[
              { step: '01', title: 'Choose a Service', desc: 'Browse my services and pick the one that fits your needs.' },
              { step: '02', title: 'Pick a Time', desc: 'See my real‑time availability and book a slot that works for you.' },
              { step: '03', title: 'We Meet', desc: 'Our session happens online or in person — your choice.' },
            ].map((item, idx) => (
              <Col md={4} key={idx}>
                <div className="text-center p-4 border rounded-4 shadow-sm h-100 bg-white">
                  <div
                    className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '70px', height: '70px', fontSize: '1.5rem', fontWeight: 'bold' }}
                  >
                    {item.step}
                  </div>
                  <h5 className="fw-bold">{item.title}</h5>
                  <p className="text-muted small">{item.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ========== WHY CHOOSE ME ========== */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <h3 className="fw-bold mb-3">Why Work With Me?</h3>
              <p>
                I focus on building long‑term relationships with my clients. 
                You’ll never be handed off to a stranger — every session is with me, every time.
              </p>
              <div className="d-flex flex-wrap mt-4">
                <div className="me-5 mb-3">
                  <h4 className="fw-bold">4.9</h4>
                  <span>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} className="text-warning" />
                    ))}
                  </span>
                  <p className="small">Average Rating</p>
                </div>
                <div className="me-5 mb-3">
                  <h4 className="fw-bold">100%</h4>
                  <p className="small">Personal Attention</p>
                </div>
                <div className="mb-3">
                  <h4 className="fw-bold">24h</h4>
                  <p className="small">Response Time</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <img
                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=500&auto=format"
                alt="Happy customer"
                className="img-fluid rounded-4 shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section id="testimonials" className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Client Love</h2>
            <p className="text-muted">Hear from people who have booked sessions with me</p>
          </div>
          <Carousel indicators={false} interval={4000}>
            {[
              { name: 'Jane Cooper', role: 'Homeowner', text: 'I was blown away by the personal attention I received. It felt like I was the only client in the world!' },
              { name: 'Wade Warren', role: 'Small Business Owner', text: 'My tech issues were resolved in one session. No back‑and‑forth, just results.' },
              { name: 'Esther Howard', role: 'Freelancer', text: 'Booking was a breeze, and the session itself was invaluable. I’ve already booked my next one.' },
            ].map((t, idx) => (
              <Carousel.Item key={idx}>
                <div className="d-flex justify-content-center">
                  <div className="text-center p-5 bg-white rounded-4 shadow-sm" style={{ maxWidth: '700px' }}>
                    <FontAwesomeIcon icon={faStar} className="text-warning mb-3" size="2x" />
                    <p className="lead fst-italic">"{t.text}"</p>
                    <h5 className="fw-bold mt-3">{t.name}</h5>
                    <small className="text-muted">{t.role}</small>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      {/* ========== CALL TO ACTION ========== */}
      <section className="py-5 text-white" style={{ background: 'linear-gradient(135deg, #6610f2, #0d6efd)' }}>
        <Container className="text-center">
          <h2 className="fw-bold mb-3">Ready to Book Your Session?</h2>
          <p className="lead mb-4">Spots fill up fast — grab a time that works for you now.</p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/services" variant="light" size="lg" className="fw-bold px-4">
              View My Services <FontAwesomeIcon icon={faChevronRight} className="ms-1" />
            </Button>
            <Button as={Link} to="/register" variant="outline-light" size="lg">
              Create Account
            </Button>
          </div>
        </Container>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-dark text-white pt-5 pb-3">
        <Container>
          <Row>
            <Col md={4} className="mb-4">
              <h5><FontAwesomeIcon icon={faTools} className="me-2" /> YourName Booking</h5>
              <p className="small text-secondary">
                One‑on‑one professional services tailored to your needs.
              </p>
            </Col>
            <Col md={2} className="mb-4">
              <h6>For Clients</h6>
              <Nav className="flex-column small">
                <Nav.Link as={Link} to="/services" className="text-secondary p-0 mb-1">My Services</Nav.Link>
                <Nav.Link href="#how-it-works" className="text-secondary p-0 mb-1">How It Works</Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-secondary p-0 mb-1">Sign Up</Nav.Link>
              </Nav>
            </Col>
            <Col md={2} className="mb-4">
              <h6>About Me</h6>
              <Nav className="flex-column small">
                <Nav.Link href="#" className="text-secondary p-0 mb-1">My Story</Nav.Link>
                <Nav.Link href="#" className="text-secondary p-0 mb-1">Contact</Nav.Link>
              </Nav>
            </Col>
            <Col md={4} className="mb-4">
              <h6>Contact</h6>
              <p className="small text-secondary mb-1">hello@yourdomain.com</p>
              <p className="small text-secondary">+1 (555) 123-4567</p>
            </Col>
          </Row>
          <hr className="my-4" />
          <p className="text-center small text-secondary mb-0">
            © {new Date().getFullYear()} YourName Booking. All rights reserved.
          </p>
        </Container>
      </footer>
    </>
  );
};

export default HomePage;