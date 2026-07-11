import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faClock, faDollarSign, faArrowLeft, faConciergeBell, faSave } from '@fortawesome/free-solid-svg-icons';
import { getAllServices, createService, updateService, deleteService } from '../services/serviceService';
import { getProfile, logout } from '../services/authService';
import api from '../services/api';

const AdminServicesPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', duration: '', price: '', provider_id: '' });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchServices = useCallback(async () => {
    try { setServices(await getAllServices()); } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await getProfile();
        if (profile.role !== 'admin') { navigate('/dashboard', { replace: true }); return; }
        setUser(profile);
        const [servicesData, providersData] = await Promise.all([getAllServices(), api.get('/providers')]);
        setServices(servicesData);
        setProviders(providersData.data);
      } catch (err) { logout(); navigate('/login'); } finally { setLoading(false); }
    };
    fetchData();
  }, [navigate, fetchServices]);

  const handleAdd = () => {
    setEditingService(null);
    setFormData({ name: '', description: '', duration: '', price: '', provider_id: '' });
    setShowModal(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      duration: service.duration.toString(),
      price: service.price.toString(),
      provider_id: service.provider_id || ''
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        duration: parseInt(formData.duration, 10),
        price: parseFloat(formData.price),
        provider_id: formData.provider_id,
        is_active: true
      };
      if (editingService) {
        await updateService(editingService.id, payload);
      } else {
        await createService(payload);
      }
      setShowModal(false);
      fetchServices();
    } catch (err) { alert(err.response?.data?.message || 'Operation failed'); }
    finally { setSaving(false); }
  };

  const handleDeleteClick = (id) => { setDeleteTarget(id); setShowDeleteConfirm(true); };
  const confirmDelete = async () => {
    try { await deleteService(deleteTarget); setShowDeleteConfirm(false); fetchServices(); } catch (err) { alert('Failed to delete'); }
  };

  if (loading) return <div className="d-flex justify-content-center mt-5"><Spinner animation="border" variant="primary" /></div>;

  return (
    <Container fluid className="py-4" style={{ background: '#f4f7fc', minHeight: '100vh' }}>
      <Row className="mb-4">
        <Col>
          <Link to="/dashboard" className="btn btn-outline-secondary btn-sm me-2"><FontAwesomeIcon icon={faArrowLeft} /> Back</Link>
          <h3 className="d-inline fw-bold"><FontAwesomeIcon icon={faConciergeBell} className="me-2 text-primary" />Manage Services</h3>
        </Col>
      </Row>
      <div className="d-flex justify-content-end mb-4">
        <Button variant="primary" onClick={handleAdd} className="rounded-pill px-4 py-2"><FontAwesomeIcon icon={faPlus} className="me-2" />Add New Service</Button>
      </div>
      {services.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-4 text-center p-5"><p className="text-muted mb-0">No services yet.</p></Card>
      ) : (
        <Row>
          {services.map(service => (
            <Col key={service.id} md={6} lg={4} className="mb-4">
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold">{service.name}</Card.Title>
                  <Card.Text className="text-muted small flex-grow-1">{service.description}</Card.Text>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted"><FontAwesomeIcon icon={faClock} className="me-1" /> {service.duration} min</span>
                    <span className="fw-bold text-primary"><FontAwesomeIcon icon={faDollarSign} /> {service.price}</span>
                  </div>
                  <div className="d-flex gap-2 mt-auto">
                    <Button variant="outline-primary" size="sm" className="flex-grow-1" onClick={() => handleEdit(service)}><FontAwesomeIcon icon={faEdit} /> Edit</Button>
                    <Button variant="outline-danger" size="sm" className="flex-grow-1" onClick={() => handleDeleteClick(service.id)}><FontAwesomeIcon icon={faTrash} /> Delete</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>{editingService ? 'Edit Service' : 'Add New Service'}</Modal.Title></Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Service Name</Form.Label>
              <Form.Control type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </Form.Group>
            <Row>
              <Col><Form.Group className="mb-3"><Form.Label>Duration (min)</Form.Label><Form.Control type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} required min="1" /></Form.Group></Col>
              <Col><Form.Group className="mb-3"><Form.Label>Price ($)</Form.Label><Form.Control type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required min="0" /></Form.Group></Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Provider</Form.Label>
              <Form.Select value={formData.provider_id || ''} onChange={(e) => setFormData({...formData, provider_id: e.target.value})} required>
                <option value="">Select a provider</option>
                {providers.map(p => <option key={p.id} value={p.id}>{p.name} ({p.email})</option>)}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : <><FontAwesomeIcon icon={faSave} className="me-1" /> Save Service</>}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Deletion</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this service?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminServicesPage;