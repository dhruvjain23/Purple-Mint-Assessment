import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "../src/routes/auth.route.js";
import { driverRouter } from "../src/routes/driver.route.js";
import { connectDB } from "../src/lib/db.js";
import { orderRouter } from "../src/routes/order.route.js";
import { routeRouter } from "../src/routes/route.routes.js";
import { simulateRouter } from "../src/routes/simulation.route.js";
import { loadData } from "../src/lib/loadData.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 


app.use('/api/auth', authRouter)
app.use('/api/driver', driverRouter)
app.use('/api/order', orderRouter)
app.use('/api/route', routeRouter)
app.use('/api/simulation', simulateRouter)


// Test route
app.get("/", (req, res) => {
  res.json({ message: "backend API is running " });
});


// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, async() => {
  console.log(`Server running on port ${PORT}`);
});
