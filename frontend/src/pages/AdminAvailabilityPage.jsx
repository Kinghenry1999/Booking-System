import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPlus, faTrash, faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { getAvailability, saveAvailability } from '../services/availabilityService';
import api from '../services/api';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AdminAvailabilityPage = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch all providers on mount
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data } = await api.get('/providers');
        setProviders(data);
        if (data.length > 0) {
          setSelectedProviderId(data[0].id.toString()); // auto-select first provider
        }
      } catch (err) {
        console.error('Failed to load providers:', err);
        setMessage({ type: 'danger', text: 'Could not load providers.' });
      } finally {
        setLoadingProviders(false);
      }
    };
    fetchProviders();
  }, []);

  // When the selected provider changes, fetch their availability
  useEffect(() => {
    if (!selectedProviderId) {
      setSlots([]);
      return;
    }
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const data = await getAvailability(selectedProviderId);
        setSlots(data.map((s) => ({
          day_of_week: s.day_of_week,
          start_time: s.start_time,
          end_time: s.end_time,
        })));
      } catch (err) {
        console.error('Failed to load availability:', err);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedProviderId]);

  // Add a new empty slot for a given day
  const handleAddSlot = (day) => {
    setSlots([...slots, { day_of_week: day, start_time: '09:00', end_time: '17:00' }]);
  };

  // Remove a slot at index
  const handleRemoveSlot = (index) => {
    const updated = [...slots];
    updated.splice(index, 1);
    setSlots(updated);
  };

  // Update a slot field
  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  // Save the current slots for the selected provider
  const handleSave = async () => {
    if (!selectedProviderId) {
      setMessage({ type: 'warning', text: 'Please select a provider first.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const payload = slots.map(({ day_of_week, start_time, end_time }) => ({
        day_of_week,
        start_time,
        end_time,
      }));
      await saveAvailability(payload, selectedProviderId);
      setMessage({ type: 'success', text: 'Availability saved successfully!' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container fluid className="py-4" style={{ background: '#f4f7fc', minHeight: '100vh' }}>
      <Link to="/dashboard" className="btn btn-outline-secondary btn-sm mb-3">
        <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Back to Dashboard
      </Link>

      <h3 className="fw-bold mb-4">
        <FontAwesomeIcon icon={faClock} className="me-2 text-primary" />
        Manage Provider Availability
      </h3>

      {/* Provider Selector */}
      <Row className="mb-4">
        <Col md={6} lg={4}>
          <Form.Group>
            <Form.Label className="fw-semibold">Select Provider</Form.Label>
            {loadingProviders ? (
              <Spinner animation="border" size="sm" />
            ) : providers.length === 0 ? (
              <p className="text-muted">No providers found.</p>
            ) : (
              <Form.Select
                value={selectedProviderId}
                onChange={(e) => setSelectedProviderId(e.target.value)}
              >
                {providers.map((p) => (
                  <option key={p.id} value={p.id.toString()}>
                    {p.name} ({p.email})
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>
        </Col>
      </Row>

      {/* Messages */}
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

      {/* Availability Editor */}
      {loadingSlots ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body>
            {daysOfWeek.map((day, idx) => {
              const daySlots = slots.filter((s) => s.day_of_week === idx);
              return (
                <div key={idx} className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold mb-0">{day}</h5>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleAddSlot(idx)}
                    >
                      <FontAwesomeIcon icon={faPlus} className="me-1" /> Add
                    </Button>
                  </div>
                  {daySlots.length === 0 ? (
                    <p className="text-muted small">No hours assigned</p>
                  ) : (
                    <Table bordered size="sm" className="align-middle">
                      <thead>
                        <tr>
                          <th style={{ width: '40%' }}>Start Time</th>
                          <th style={{ width: '40%' }}>End Time</th>
                          <th style={{ width: '20%' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {daySlots.map((slot, i) => {
                          const globalIndex = slots.indexOf(slot);
                          return (
                            <tr key={i}>
                              <td>
                                <Form.Control
                                  type="time"
                                  value={slot.start_time}
                                  onChange={(e) =>
                                    handleSlotChange(globalIndex, 'start_time', e.target.value)
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  type="time"
                                  value={slot.end_time}
                                  onChange={(e) =>
                                    handleSlotChange(globalIndex, 'end_time', e.target.value)
                                  }
                                />
                              </td>
                              <td>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleRemoveSlot(globalIndex)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  )}
                </div>
              );
            })}

            <div className="text-end mt-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  'Saving...'
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Save Availability
                  </>
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default AdminAvailabilityPage;