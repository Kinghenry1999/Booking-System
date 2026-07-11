const Service = require('../models/Service');

exports.getAllServices = async (req, res) => {
  try { res.json(await Service.findAll()); } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

exports.createService = async (req, res) => {
  try {
    const { name, description, duration, price, provider_id } = req.body;
    if (!provider_id) return res.status(400).json({ message: 'Provider is required' });
    const service = await Service.create({ name, description, duration, price, provider_id });
    res.status(201).json(service);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

exports.updateService = async (req, res) => {
  try {
    const { name, description, duration, price, is_active, provider_id } = req.body;
    const service = await Service.update(req.params.id, { name, description, duration, price, is_active, provider_id });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

exports.deleteService = async (req, res) => {
  try { await Service.delete(req.params.id); res.json({ message: 'Service removed' }); } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

exports.getMyServices = async (req, res) => {
  try {
    if (req.user.role !== 'provider') return res.status(403).json({ message: 'Not a provider' });
    const services = await Service.findByProviderId(req.user.id);
    res.json(services);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};