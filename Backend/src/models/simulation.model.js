import mongoose from 'mongoose';

const simulationSchema = new mongoose.Schema({
  num_drivers: { type: Number, required: true },
  start_time: { type: String, required: true },
  max_hours: { type: Number, required: true },
  results: {
    total_profit: Number,
    efficiency_score: Number,
    on_time: Number,
    late: Number,
    undelivered: Number,
    total_fuel: Number
  },
  timestamp: { type: Date, default: Date.now }
});

const Simulation = mongoose.model('Simulation', simulationSchema);
export { Simulation };