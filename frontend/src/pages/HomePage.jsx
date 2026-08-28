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
  faPenNib,
  faFileAlt,
  faHeadset,
  faCalendarCheck,
  faStar,
  faChevronRight,
  faUsers,
  faLightbulb,
  faTasks,
} from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
  return (
    <>
      {/* ========== NAVBAR ========== */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <FontAwesomeIcon icon={faPenNib} className="me-2" />
            Kinghenry Writes
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/services">Services</Nav.Link>
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
                Expert Writing & <br /> Virtual Assistance
              </h1>
              <p className="lead my-4">
                Our team of professional writers and virtual assistants handle your content,
                admin tasks, and more — so you can focus on what matters.
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
                  <FontAwesomeIcon icon={faUsers} className="me-1" /> 20+ Expert Writers
                </span>
                <span>
                  <FontAwesomeIcon icon={faCalendarCheck} className="me-1" /> 5k+ Projects Delivered
                </span>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <img
                src="/images/cover_image.jpeg"
                alt="Professional writing team"
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
            <h2 className="fw-bold">Our Services</h2>
            <p className="text-muted">
              Every project is handled by a dedicated professional — quality guaranteed.
            </p>
          </div>
          <Row>
            {[
              { icon: faFileAlt, title: 'Content Writing', desc: 'Blog posts, articles, website copy & more.' },
              { icon: faPenNib, title: 'Editing & Proofreading', desc: 'Polished, error‑free documents every time.' },
              { icon: faHeadset, title: 'Virtual Assistance', desc: 'Admin support, scheduling, email management.' },
              { icon: faLightbulb, title: 'Content Strategy', desc: 'Planning and research to grow your brand.' },
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
            <p className="text-muted">Getting help is as easy as 1‑2‑3</p>
          </div>
          <Row className="g-4">
            {[
              { step: '01', title: 'Choose a Service', desc: 'Browse our writing and VA packages tailored to your needs.' },
              { step: '02', title: 'Book a Time', desc: 'Pick a date and time that works for your schedule.' },
              { step: '03', title: 'We Deliver', desc: 'Your assigned professional completes the task — on time and on point.' },
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

      {/* ========== WHY CHOOSE US ========== */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <h3 className="fw-bold mb-3">Why Kinghenry Writes?</h3>
              <p>
                We don’t just write — we become an extension of your team. Every writer and assistant 
                is hand‑picked for quality, reliability, and professionalism.
              </p>
              <div className="d-flex flex-wrap mt-4">
                <div className="me-5 mb-3">
                  <h4 className="fw-bold">4.9</h4>
                  <span>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} className="text-warning" />
                    ))}
                  </span>
                  <p className="small">Client Rating</p>
                </div>
                <div className="me-5 mb-3">
                  <h4 className="fw-bold">100%</h4>
                  <p className="small">Human‑Written</p>
                </div>
                <div className="mb-3">
                  <h4 className="fw-bold">24/7</h4>
                  <p className="small">Support</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format"
                alt="Team collaborating on writing"
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
            <h2 className="fw-bold">What Our Clients Say</h2>
            <p className="text-muted">Real feedback from real people</p>
          </div>
          <Carousel indicators={false} interval={4000}>
            {[
              { name: 'Sarah M.', role: 'Small Business Owner', text: 'Kinghenry Writes transformed my blog — professional, fast, and engaging content every time.' },
              { name: 'James L.', role: 'Marketing Manager', text: 'Our virtual assistant is a lifesaver. Scheduling, emails, and data entry are now completely off my plate.' },
              { name: 'Emily R.', role: 'Author', text: 'The editing team caught errors I never noticed and made my manuscript shine. Highly recommended!' },
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
          <h2 className="fw-bold mb-3">Ready to Outsource Your Writing?</h2>
          <p className="lead mb-4">Book a session today and let our words work for you.</p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/services" variant="light" size="lg" className="fw-bold px-4">
              View Services <FontAwesomeIcon icon={faChevronRight} className="ms-1" />
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
              <h5><FontAwesomeIcon icon={faPenNib} className="me-2" /> Kinghenry Writes</h5>
              <p className="small text-secondary">
                Professional writing and virtual assistant services — delivered by a team you can trust.
              </p>
            </Col>
            <Col md={2} className="mb-4">
              <h6>For Clients</h6>
              <Nav className="flex-column small">
                <Nav.Link as={Link} to="/services" className="text-secondary p-0 mb-1">Services</Nav.Link>
                <Nav.Link href="#how-it-works" className="text-secondary p-0 mb-1">How It Works</Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-secondary p-0 mb-1">Sign Up</Nav.Link>
              </Nav>
            </Col>
            <Col md={2} className="mb-4">
              <h6>Company</h6>
              <Nav className="flex-column small">
                <Nav.Link href="#" className="text-secondary p-0 mb-1">About</Nav.Link>
                <Nav.Link href="#" className="text-secondary p-0 mb-1">Careers</Nav.Link>
                <Nav.Link href="#" className="text-secondary p-0 mb-1">Contact</Nav.Link>
              </Nav>
            </Col>
            <Col md={4} className="mb-4">
              <h6>Contact</h6>
              <p className="small text-secondary mb-1">hello@kinghenrywrites.com</p>
              <p className="small text-secondary">+1 (555) 123-4567</p>
            </Col>
          </Row>
          <hr className="my-4" />
          <p className="text-center small text-secondary mb-0">
            © {new Date().getFullYear()} Kinghenry Writes. All rights reserved.
          </p>
        </Container>
      </footer>
    </>
  );
};

export default HomePage;