import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { Driver } from '../models/drivers.model.js';
import { Route } from '../models/routes.model.js';
import { Order } from '../models/orders.model.js';
import { Simulation } from '../models/simulation.model.js';
import { connectDB } from '../lib/db.js';

const simulateRouter = express.Router();

simulateRouter.post('/runSimulation', async (req, res) => {
  await connectDB();
  const { num_drivers, start_time, max_hours } = req.body;

  // Validation
  if (!num_drivers || num_drivers < 1 || !start_time || !max_hours || max_hours < 0) {
    return res.status(400).json({ error: 'Invalid or missing parameters' });
  }
  // Validate start_time format (HH:MM)
  if (!/^\d{2}:\d{2}$/.test(start_time)) {
    return res.status(400).json({ error: 'Invalid start_time format (use HH:MM)' });
  }

  try {
    const drivers = await Driver.find();
    if (num_drivers > drivers.length) {
      return res.status(400).json({ error: 'Number of drivers exceeds available' });
    }

    const routes = await Route.find();
    const routesMap = new Map(routes.map(r => [r.route_id, r]));

    const orders = await Order.find();
    let total_profit = 0;
    let on_time = 0;
    let late = 0;
    let undelivered = 0;
    let total_fuel = 0;

    // Calculate factor for each driver
    const driversWithFactor = drivers.map(d => {
      const yesterday_hours = d.past_week_hours[6] || 0;
      const is_fatigued = yesterday_hours > 8;
      const factor = is_fatigued ? 1 / 0.7 : 1;
      return { ...d.toObject(), factor };
    });

    // Select best N drivers (sort by factor asc - prefer non-fatigued)
    driversWithFactor.sort((a, b) => a.factor - b.factor);
    const selectedDrivers = driversWithFactor.slice(0, num_drivers);

    // Prepare drivers with remaining base sum capacity
    const driverCapacities = selectedDrivers.map(d => ({
      id: d._id,
      factor: d.factor,
      remaining_base: max_hours * 60 / d.factor,
      current_base: 0
    }));

    // Prepare orders with base_time, sort descending by base_time
    const preparedOrders = orders.map(o => {
      const route = routesMap.get(o.route_id);
      if (!route) throw new Error(`Route ${o.route_id} not found`);
      return { ...o.toObject(), base_time: route.base_time_min, distance: route.distance_km, traffic: route.traffic_level };
    });
    preparedOrders.sort((a, b) => b.base_time - a.base_time);

    // Assign orders (greedy best-fit)
    const assigned = new Map();  // order_id -> driver_id
    for (const order of preparedOrders) {
      // Find driver with most remaining capacity that fits
      driverCapacities.sort((a, b) => b.remaining_base - a.remaining_base);
      const fittingDriver = driverCapacities.find(d => d.remaining_base >= order.base_time);
      if (fittingDriver) {
        fittingDriver.current_base += order.base_time;
        fittingDriver.remaining_base -= order.base_time;
        assigned.set(order.order_id, fittingDriver.id);
      } else {
        undelivered++;
      }
    }

    // Calculate KPIs for assigned orders
    for (const order of preparedOrders) {
      if (!assigned.has(order.order_id)) continue;

      const driver = selectedDrivers.find(d => d._id.toString() === assigned.get(order.order_id).toString());
      const calc_delivery = order.base_time * driver.factor;
      const is_late = calc_delivery > order.base_time + 10;
      const penalty = is_late ? 50 : 0;
      const bonus = (!is_late && order.value_rs > 1000) ? 0.1 * order.value_rs : 0;
      const fuel = 5 * order.distance + (order.traffic === 'High' ? 2 * order.distance : 0);

      total_profit += order.value_rs + bonus - penalty - fuel;
      total_fuel += fuel;
      if (is_late) late++;
      else on_time++;
    }

    const total_deliveries = on_time + late;
    const efficiency_score = total_deliveries > 0 ? (on_time / total_deliveries) * 100 : 0;

    // Save to DB
    const sim = await Simulation.create({
      num_drivers,
      start_time,
      max_hours,
      results: { total_profit, efficiency_score, on_time, late, undelivered, total_fuel }
    });

    res.json(sim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

simulateRouter.get('/simulations-result', auth, async (req, res) => {
  await connectDB();
  const sims = await Simulation.find().sort({ timestamp: -1 });
  res.json(sims);
});


export { simulateRouter };