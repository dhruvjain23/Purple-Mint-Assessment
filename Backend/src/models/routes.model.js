import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  route_id: { type: Number, required: true, unique: true },
  distance_km: { type: Number, required: true },
  traffic_level: { type: String, required: true },
  base_time_min: { type: Number, required: true }
});

const Route = mongoose.model('Route', routeSchema);
export { Route };