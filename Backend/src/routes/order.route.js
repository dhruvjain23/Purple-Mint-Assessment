import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { Route } from '../models/routes.model.js';
import { Order } from '../models/orders.model.js';
import { connectDB } from '../lib/db.js';


const orderRouter = express.Router();

orderRouter.get('/getAllOrder', auth, async (req, res) => {
  try {
    await connectDB();
    const order = await Order.find();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

orderRouter.post('/addOrder', auth, async (req, res) => {
  try {
    await connectDB();
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

orderRouter.put('/updateOrder/:id', auth, async (req, res) => {
  try {
    await connectDB();
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

orderRouter.delete('/deleteOrder/:id', auth, async (req, res) => {
  try {
    await connectDB();
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { orderRouter };