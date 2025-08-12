import fs from 'fs';
import csv from 'csv-parser';
import { Route } from '../models/routes.model.js';
import { Order } from '../models/orders.model.js';
import { connectDB } from './db.js';

const loadCSV = (filePath, insertFn) => {
  return new Promise((resolve, reject) => {
    const items = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => items.push(row))
      .on('end', async () => {
        try {
          await insertFn(items);
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', reject);
  });
};

export const loadData = async () => {
  await loadCSV('./data/routes.csv', async (rows) => {
    await connectDB();
    const routes = rows.map(r => ({
      route_id: Number(r.route_id),
      distance_km: Number(r.distance_km),
      traffic_level: r.traffic_level,
      base_time_min: Number(r.base_time_min)
    }));
    await Route.insertMany(routes);
    console.log('Routes inserted');
  });

  await loadCSV('./data/orders.csv', async (rows) => {
    const orders = rows.map(r => ({
      order_id: Number(r.order_id),
      value_rs: Number(r.value_rs),
      route_id: Number(r.route_id),
      delivery_time: r.delivery_time
    }));
    await Order.insertMany(orders);
    console.log('Orders inserted');
  });

  console.log('All CSV data loaded successfully');
};
