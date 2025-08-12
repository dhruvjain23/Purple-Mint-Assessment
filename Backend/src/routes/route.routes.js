import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { Route } from '../models/routes.model.js';
import { connectDB } from '../lib/db.js';


const routeRouter = express.Router();

routeRouter.get('/getAllRoute', auth, async (req, res) => {
  try {
    await connectDB();
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

routeRouter.get('/routes/:id', auth, async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid route ID format' });
    }
    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json(route);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

routeRouter.post('/addroutes', auth, async (req, res) => {
  try {
    await connectDB();
    const { route_id, distance_km, traffic_level, base_time_min } = req.body;
    if (!route_id || typeof route_id !== 'number' || !distance_km || typeof distance_km !== 'number' || 
        !traffic_level || !['High', 'Medium', 'Low'].includes(traffic_level) || 
        !base_time_min || typeof base_time_min !== 'number') {
      return res.status(400).json({ error: 'Invalid input: route_id (number), distance_km (number), traffic_level (High/Medium/Low), base_time_min (number) are required' });
    }
    if (distance_km <= 0 || base_time_min <= 0) {
      return res.status(400).json({ error: 'distance_km and base_time_min must be positive' });
    }
    const existingRoute = await Route.findOne({ route_id });
    if (existingRoute) {
      return res.status(400).json({ error: 'Route ID must be unique' });
    }
    const route = await Route.create({ route_id, distance_km, traffic_level, base_time_min });
    res.status(201).json(route);
  } catch (err) {
    res.status(400).json({ error: 'Invalid input: ' + err.message });
  }
});


routeRouter.put('/update/:id', auth, async (req, res) => {
  try {
    await connectDB();
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json(route);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

routeRouter.delete('/deleteRoute/:id', auth, async (req, res) => {
  try {
    await connectDB();
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json({ message: 'Route deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { routeRouter };