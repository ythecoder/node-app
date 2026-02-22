import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
// import productRoutes from './routes/product.routes.js';
import healthRoutes from './routes/health.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";


const app = express();
app.use(cors());
app.use(express.json());

// Swagger UI
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/health', healthRoutes);
// app.use('/api/v1/products', productRoutes);
app.use(errorHandler);
export default app;
