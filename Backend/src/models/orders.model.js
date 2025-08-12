import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  order_id: { type: Number, required: true, unique: true },
  value_rs: { type: Number, required: true },
  route_id: { type: Number, required: true },
  delivery_time: { type: String, required: true }  // HH:MM, historical - not used in sim
});

const Order = mongoose.model('Order', orderSchema);
export { Order };