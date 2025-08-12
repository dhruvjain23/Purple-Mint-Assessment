const fs = require('fs');
const csv = require('csv-parser');
const Driver = require('./models/Driver');
const Route = require('./models/Route');
const Order = require('./models/Order');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const loadData = async () => {
  // Check if data exists
  const driverCount = await Driver.countDocuments();
  if (driverCount > 0) return;

  // Load drivers
  fs.createReadStream('./data/drivers.csv')
    .pipe(csv())
    .on('data', async (row) => {
      const past_week_hours = row.past_week_hours.split('|').map(Number);
      await Driver.create({ name: row.name, shift_hours: Number(row.shift_hours), past_week_hours });
    });

  // Load routes
  fs.createReadStream('./data/routes.csv')
    .pipe(csv())
    .on('data', async (row) => {
      await Route.create({
        route_id: Number(row.route_id),
        distance_km: Number(row.distance_km),
        traffic_level: row.traffic_level,
        base_time_min: Number(row.base_time_min)
      });
    });

  // Load orders
  fs.createReadStream('./data/orders.csv')
    .pipe(csv())
    .on('data', async (row) => {
      await Order.create({
        order_id: Number(row.order_id),
        value_rs: Number(row.value_rs),
        route_id: Number(row.route_id),
        delivery_time: row.delivery_time
      });
    });

  // Create a default user for auth (username: admin, password: password)
  const hashedPassword = await bcrypt.hash('password', 10);
  await User.create({ username: 'admin', password: hashedPassword });
};

module.exports = loadData;