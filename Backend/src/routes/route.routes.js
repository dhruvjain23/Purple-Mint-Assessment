import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { Route } from '../models/routes.model.js';


const driverRouter = express.Router();

driverRouter.get('/getAllRoute', auth, async (req, res) => {
  try {
    const drivers = await Route.find();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

driverRouter.post('/registerDriver', auth, async (req, res) => {
  try {
    const driver = await Route.create(req.body);
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

driverRouter.put('/update/:id', auth, async (req, res) => {
  try {
    const driver = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!driver) return res.status(404).json({ error: 'Route not found' });
    res.json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

driverRouter.delete('/deleteDriver/:id', auth, async (req, res) => {
  try {
    const driver = await Route.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Route not found' });
    res.json({ message: 'Route deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { driverRouter };