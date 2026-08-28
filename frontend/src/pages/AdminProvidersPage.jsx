import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faArrowLeft,
  faUser,
  faUserSlash,
  faUserCheck,
  faTrash,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminProvidersPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Suspend state
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspendUntil, setSuspendUntil] = useState('');
  const [suspendIndefinite, setSuspendIndefinite] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Restore state
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const fetchProviders = async () => {
    try {
      const { data } = await api.get('/providers');
      setProviders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/providers', addForm);
      setShowAddModal(false);
      setAddForm({ name: '', email: '', password: '' });
      setSuccess('Provider created successfully!');
      fetchProviders();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating provider');
    } finally {
      setSaving(false);
    }
  };

  const confirmSuspend = async () => {
    try {
      const payload = suspendIndefinite ? { until: null } : { until: suspendUntil || null };
      await api.put(`/providers/${suspendTarget}/suspend`, payload);
      setShowSuspendModal(false);
      setSuspendTarget(null);
      setSuspendIndefinite(false);
      setSuspendUntil('');
      fetchProviders();
    } catch (err) {
      setError('Failed to suspend provider');
    }
  };

  const handleUnsuspend = async (id) => {
    try {
      await api.put(`/providers/${id}/unsuspend`);
      fetchProviders();
    } catch (err) {
      setError('Failed to unsuspend provider');
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/providers/${deleteTarget}`);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchProviders();
    } catch (err) {
      setError('Failed to delete provider');
    }
  };

  const confirmRestore = async () => {
    try {
      await api.put(`/providers/${restoreTarget}/restore`);
      setShowRestoreModal(false);
      setRestoreTarget(null);
      fetchProviders();
    } catch (err) {
      setError('Failed to restore provider');
    }
  };

  const getStatusBadge = (provider) => {
    if (!provider.is_active) return <Badge bg="secondary">Deleted</Badge>;
    if (provider.is_suspended) {
      if (provider.suspended_until) {
        return <Badge bg="warning">Suspended until {new Date(provider.suspended_until).toLocaleDateString()}</Badge>;
      }
      return <Badge bg="warning">Suspended indefinitely</Badge>;
    }
    return <Badge bg="success">Active</Badge>;
  };

  return (
    <Container fluid className="py-4" style={{ background: '#f4f7fc', minHeight: '100vh' }}>
      <Link to="/dashboard" className="btn btn-outline-secondary btn-sm mb-3">
        <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Back to Dashboard
      </Link>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold"><FontAwesomeIcon icon={faUser} className="me-2 text-primary" />Providers</h3>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Provider
        </Button>
      </div>

      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-muted">No providers yet.</td></tr>
                ) : (
                  providers.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.email}</td>
                      <td>{getStatusBadge(p)}</td>
                      <td>{new Date(p.created_at).toLocaleDateString()}</td>
                      <td>
                        {p.is_active ? (
                          <>
                            {!p.is_suspended ? (
                              <Button variant="outline-warning" size="sm" className="me-1" onClick={() => { setSuspendTarget(p.id); setShowSuspendModal(true); }}>
                                <FontAwesomeIcon icon={faUserSlash} /> Suspend
                              </Button>
                            ) : (
                              <Button variant="outline-success" size="sm" className="me-1" onClick={() => handleUnsuspend(p.id)}>
                                <FontAwesomeIcon icon={faUserCheck} /> Unsuspend
                              </Button>
                            )}
                            <Button variant="outline-danger" size="sm" onClick={() => { setDeleteTarget(p.id); setShowDeleteModal(true); }}>
                              <FontAwesomeIcon icon={faTrash} /> Delete
                            </Button>
                          </>
                        ) : (
                          <Button variant="outline-info" size="sm" onClick={() => { setRestoreTarget(p.id); setShowRestoreModal(true); }}>
                            <FontAwesomeIcon icon={faUndo} /> Restore
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Add Provider Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Add New Provider</Modal.Title></Modal.Header>
        <Form onSubmit={handleAdd}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3"><Form.Label>Full Name</Form.Label><Form.Control type="text" value={addForm.name} onChange={(e) => setAddForm({...addForm, name: e.target.value})} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={addForm.email} onChange={(e) => setAddForm({...addForm, email: e.target.value})} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Password</Form.Label><Form.Control type="password" value={addForm.password} onChange={(e) => setAddForm({...addForm, password: e.target.value})} required minLength={6} /></Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create Provider'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Suspend Modal */}
      <Modal show={showSuspendModal} onHide={() => setShowSuspendModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Suspend Provider</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Suspend indefinitely"
              checked={suspendIndefinite}
              onChange={(e) => setSuspendIndefinite(e.target.checked)}
            />
          </Form.Group>
          {!suspendIndefinite && (
            <Form.Group>
              <Form.Label>Suspend until</Form.Label>
              <Form.Control
                type="datetime-local"
                value={suspendUntil}
                onChange={(e) => setSuspendUntil(e.target.value)}
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSuspendModal(false)}>Cancel</Button>
          <Button variant="warning" onClick={confirmSuspend}>Confirm Suspension</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Delete Provider</Modal.Title></Modal.Header>
        <Modal.Body>This will deactivate the provider account. They will no longer be able to log in. (You can restore later.)</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Restore Modal */}
      <Modal show={showRestoreModal} onHide={() => setShowRestoreModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Restore Provider</Modal.Title></Modal.Header>
        <Modal.Body>This will reactivate the provider's account.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRestoreModal(false)}>Cancel</Button>
          <Button variant="success" onClick={confirmRestore}>Restore</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminProvidersPage;