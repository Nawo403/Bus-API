// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

// Load environment variables
dotenv.config();

// Connect to MySQL
const sequelize = new Sequelize(
  "ntc", // Database name
  "root", // MySQL username (default for WAMP)
  "sachith@123", // MySQL password
  {
    host: "127.0.0.1", // MySQL server address (localhost)
    dialect: "mysql", // Using MySQL
    port: 3306, // Default MySQL port
    logging: false, // Disable Sequelize query logging
    dialectOptions: {
      connectTimeout: 10000, // Set a 10 second timeout
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const app = express();
app.use(express.json());
app.use(cors());

// API Routes
import authRoutes from "./routes/authRoutes.js";
import ntcRoutes from "./routes/ntcRoutes.js";
import operatorRoutes from "./routes/operatorRoutes.js";
import commuterRoutes from "./routes/commuterRoutes.js";

// Use the routes
app.use("/api/auth", authRoutes);
app.use("/api/ntc", ntcRoutes);
app.use("/api/operators", operatorRoutes);
app.use("/api/commuters", commuterRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
