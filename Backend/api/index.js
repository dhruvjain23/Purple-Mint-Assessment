import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "../src/routes/auth.route.js";
import { driverRouter } from "../src/routes/driver.route.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 


app.use('/api/auth', authRouter)
app.use('/api/driver', driverRouter)


// Test route
app.get("/", (req, res) => {
  res.json({ message: "backend API is running " });
});


// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
