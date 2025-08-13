# GreenCart Logistics

## Overview & Purpose
GreenCart Logistics is a full-stack app for optimizing delivery operations, featuring CRUD for drivers, routes, and orders, and a simulation for KPIs (profit, efficiency, deliveries, fuel costs). Built with Node.js, Express, MongoDB, and React, it uses JWT authentication and Tailwind CSS for responsive design.

## Setup Steps
1. Clone: `git clone <repo-url>`
2. Backend: `cd backend`, `npm install`, set `.env`
3. Frontend: `cd frontend`, `npm install`
4. Run: Backend (`npm start`), Frontend (`npm start`)
5. Test: `http://localhost:3000`, login (`admin`/`password`)
6. Deploy: See Deployment Instructions

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, csv-parser, dotenv
- **Frontend**: React, Tailwind CSS, React Router, fetch API
- **Database**: MongoDB Atlas
- **Deployment**: Vercel (frontend), Render/Railway (backend), GitHub

## Setup Instructions
### Backend
- `cd backend`, `npm install`
- Create `.env` (see Environment Variables)
- Add `drivers.csv`, `routes.csv`, `orders.csv` to `backend/data/`
- Run: `npm start` (`http://localhost:5000`)

### Frontend
- `cd frontend`, `npm install`
- Run: `npm start` (`http://localhost:3000`)
- Backend URL: `https://purple-mint-assessment-xyo1.vercel.app`

## Environment Variables
In `backend/.env`:
- `MONGO_URI`: MongoDB Atlas URI
- `JWT_SECRET`: JWT signing key
- `PORT`: Server port (e.g., `5000`)

`backend/.env.example`:
```
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Deployment Instructions
### Backend (Render/Railway)
1. Push to GitHub
2. Create service on Render/Railway, link repo
3. Set env vars: `MONGO_URI`, `JWT_SECRET`, `PORT`
4. Deploy, note URL (e.g., `https://your-backend.render.com`)

### Frontend (Vercel)
1. Push to GitHub
2. Create Vercel project, link repo
3. Set build: Framework=`Create React App`, Root=`frontend`, Build=`npm run build`, Output=`build`
4. Deploy: `https://your-frontend.vercel.app`

### Submission
Commit code, `README.md`, `.env.example` to GitHub. Submit repo URL via Google form.

## API Documentation
Base URL: `https://purple-mint-assessment-xyo1.vercel.app`. All endpoints except `/api/auth/login` require `Authorization: Bearer <token>`.

### Postman Collection
Import examples into Postman. Collection: `postman_collection.json` in repo.

### Endpoints
1. **POST /api/auth/login**
   - Authenticate user
   - Request: `{ "username": "admin", "password": "password" }`
   - Response: `{ "token": "eyJhbGciOiJIUzI1Ni..." }`
   - Error: `{ "error": "Invalid credentials" }`

2. **GET /api/drivers**
   - Get all drivers
   - Response: `[{ "_id": "60d5ec49f1b2c3a1b4c8f9e1", "name": "Amit", "shift_hours": 6, "past_week_hours": [6,8,7,7,7,6,10], "__v": 0 }, ...]`
   - Error: `{ "error": "Server error: ..." }`

3. **GET /api/drivers/:id**
   - Get driver by ID
   - Request: `/api/drivers/60d5ec49f1b2c3a1b4c8f9e1`
   - Response: `{ "_id": "60d5ec49f1b2c3a1b4c8f9e1", "name": "Amit", ... }`
   - Error: `{ "error": "Driver not found" }`

4. **POST /api/drivers**
   - Create driver
   - Request: `{ "name": "Rahul", "shift_hours": 8, "past_week_hours": [8,7,6,8,7,6,8] }`
   - Response: `{ "_id": "60d5ec49f1b2c3a1b4c8f9e2", "name": "Rahul", ... }`
   - Error: `{ "error": "Driver name must be unique" }`

5. **PUT /api/drivers/:id**
   - Update driver
   - Request: `/api/drivers/60d5ec49f1b2c3a1b4c8f9e1`, `{ "shift_hours": 7 }`
   - Response: `{ "_id": "60d5ec49f1b2c3a1b4c8f9e1", "name": "Amit", "shift_hours": 7, ... }`
   - Error: `{ "error": "Driver not found" }`

6. **DELETE /api/drivers/:id**
   - Delete driver
   - Request: `/api/drivers/60d5ec49f1b2c3a1b4c8f9e1`
   - Response: `{ "message": "Driver deleted successfully" }`
   - Error: `{ "error": "Driver not found" }`

7. **GET /api/route**
   - Get all routes
   - Response: `[{ "_id": "60d5ec49f1b2c3a1b4c8f9e3", "route_id": 1, "distance_km": 10, "traffic_level": "Low", "base_time_min": 15, "__v": 0 }, ...]`
   - Error: `{ "error": "Server error: ..." }`

8. **GET /api/route/:id**
   - Get route by ID
   - Request: `/api/route/60d5ec49f1b2c3a1b4c8f9e3`
   - Response: `{ "_id": "60d5ec49f1b2c3a1b4c8f9e3", "route_id": 1, ... }`
   - Error: `{ "error": "Route not found" }`

9. **POST /api/route**
   - Create route
   - Request: `{ "route_id": 11, "distance_km": 12, "traffic_level": "Medium", "base_time_min": 20 }`
   - Response: `{ "_id": "60d5ec49f1b2c3a1b4c8f9e4", "route_id": 11, ... }`
   - Error: `{ "error": "Route ID must be unique" }`

10. **PUT /api/route/:id**
    - Update route
    - Request: `/api/route/60d5ec49f1b2c3a1b4c8f9e3`, `{ "distance_km": 15 }`
    - Response: `{ "_id": "60d5ec49f1b2c3a1b4c8f9e3", "route_id": 1, "distance_km": 15, ... }`
    - Error: `{ "error": "Route not found" }`

11. **DELETE /api/route/:id**
    - Delete route
    - Request: `/api/route/60d5ec49f1b2c3a1b4c8f9e3`
    - Response: `{ "message": "Route deleted successfully" }`
    - Error: `{ "error": "Route not found" }`

12. **GET /api/order**
    - Get all orders
    - Response: `[{ "_id": "60d5ec49f1b2c3a1b4c8f9e5", "order_id": 1, "value_rs": 500, "route_id": 1, "delivery_time": "10:00", "__v": 0 }, ...]`
    - Error: `{ "error": "Server error: ..." }`

13. **GET /api/order/:id**
    - Get order by ID
    - Request: `/api/order/60d5ec49f1b2c3a1b4c8f9e5`
    - Response: `{ "_id": "60d5ec49f1b2c3a1b4c8f9e5", "order_id": 1, ... }`
    - Error: `{ "error": "Order not found" }`

14. **POST /api/order**
    - Create order
    - Request: `{ "order_id": 51, "value_rs": 750, "route_id": 1, "delivery_time": "12:00" }`
    - Response: `{ "_id": "60d5ec49f1b2c3a1b4c8f9e6", "order_id": 51, ... }`
    - Error: `{ "error": "Invalid route_id: Route does not exist" }`

15. **PUT /api/order/:id**
    - Update order
    - Request: `/api/order/60d5ec49f1b2c3a1b4c8f9e5`, `{ "value_rs": 600 }`
    - Response: `{ "_id": "60d5ec49f1b2c3a1b4c8f9e5", "order_id": 1, "value_rs": 600, ... }`
    - Error: `{ "error": "Order not found" }`

16. **DELETE /api/order/:id**
    - Delete order
    - Request: `/api/order/60d5ec49f1b2c3a1b4c8f9e5`
    - Response: `{ "message": "Order deleted successfully" }`
    - Error: `{ "error": "Order not found" }`

17. **POST /api/simulations/run**
    - Run simulation
    - Request: `{ "num_drivers": 5, "start_time": "08:00", "max_hours": 8 }`
    - Response: `{ "_id": "60d5ec49f1b2c3a1b4c8f9e7", "num_drivers": 5, "results": { "total_profit": 12345.50, "efficiency_score": 85.5, ... }, ... }`
    - Error: `{ "error": "Invalid input: ..." }`

18. **GET /api/simulations**
    - Get simulation history
    - Response: `[{ "_id": "60d5ec49f1b2c3a1b4c8f9e7", "num_drivers": 5, "results": { ... }, ... }, ...]`
    - Error: `{ "error": "Server error: ..." }`
