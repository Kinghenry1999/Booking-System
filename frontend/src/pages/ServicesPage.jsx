import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllServices } from '../services/serviceService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faDollarSign, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServices();
        setServices(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load services.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <p className="text-danger">{error}</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">My Services</h1>
        <p className="text-muted">
          Every session is with me, personally. Choose a service and pick a time that works for you.
        </p>
      </div>

      <Row>
        {services.length === 0 ? (
          <p className="text-center text-muted">No services available at the moment. Please check back later.</p>
        ) : (
          services.map((service) => (
            <Col md={4} key={service.id} className="mb-4">
              <Card className="border-0 shadow-sm h-100 rounded-4">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold">{service.name}</Card.Title>
                  <Card.Text className="text-muted flex-grow-1">{service.description}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="text-muted">
                      <FontAwesomeIcon icon={faClock} className="me-1" />
                      {service.duration} min
                    </span>
                    <span className="fw-bold text-primary">
                      <FontAwesomeIcon icon={faDollarSign} />
                      {service.price}
                    </span>
                  </div>
                  <Button
                    as={Link}
                    to={`/book/${service.id}`}
                    variant="primary"
                    className="mt-3 w-100"
                  >
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                    Book Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default ServicesPage;