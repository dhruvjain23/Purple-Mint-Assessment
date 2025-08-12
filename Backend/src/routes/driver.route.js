import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import {Driver} from '../models/drivers.model.js'
import { connectDB } from '../lib/db.js';


const driverRouter = express.Router();

driverRouter.get('/drivers', auth, async (req, res) => {
  try {
    await connectDB();
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});


driverRouter.get('/drivers/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid driver ID format' });
    }
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

driverRouter.post('/registerDriver', auth, async (req, res) => {
  try {
    await connectDB();
    const { name, shift_hours, past_week_hours } = req.body;
    if (!name || typeof shift_hours !== 'number' || !Array.isArray(past_week_hours) || past_week_hours.length !== 7) {
      return res.status(400).json({ error: 'Invalid input: name (string), shift_hours (number), past_week_hours (array of 7 numbers) are required' });
    }
    if (past_week_hours.some(h => typeof h !== 'number' || h < 0)) {
      return res.status(400).json({ error: 'past_week_hours must be an array of 7 non-negative numbers' });
    }
    const existingDriver = await Driver.findOne({ name });
    if (existingDriver) {
      return res.status(400).json({ error: 'Driver name must be unique' });
    }
    const driver = await Driver.create({ name, shift_hours, past_week_hours });
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ error: 'Invalid input: ' + err.message });
  }
});

driverRouter.put('/updateDrivers/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid driver ID format' });
    }
    const { name, shift_hours, past_week_hours } = req.body;
    if (!name && !shift_hours && !past_week_hours) {
      return res.status(400).json({ error: 'At least one field (name, shift_hours, past_week_hours) must be provided' });
    }
    if (name && typeof name !== 'string') {
      return res.status(400).json({ error: 'name must be a string' });
    }
    if (shift_hours && (typeof shift_hours !== 'number' || shift_hours < 0)) {
      return res.status(400).json({ error: 'shift_hours must be a non-negative number' });
    }
    if (past_week_hours) {
      if (!Array.isArray(past_week_hours) || past_week_hours.length !== 7 || past_week_hours.some(h => typeof h !== 'number' || h < 0)) {
        return res.status(400).json({ error: 'past_week_hours must be an array of 7 non-negative numbers' });
      }
    }
    if (name) {
      const existingDriver = await Driver.findOne({ name, _id: { $ne: id } });
      if (existingDriver) {
        return res.status(400).json({ error: 'Driver name must be unique' });
      }
    }
    const driver = await Driver.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json(driver);
  } catch (err) {
    res.status(400).json({ error: 'Invalid input: ' + err.message });
  }
});

driverRouter.delete('/deleteDriver/:id', auth, async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json({ message: 'Driver deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { driverRouter };