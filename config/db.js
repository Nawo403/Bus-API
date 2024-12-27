// config/db.js
import { Sequelize } from "sequelize";

// Initialize Sequelize connection
const sequelize = new Sequelize(
  "ntc", // database name
  "root", // username
  "sachith@123", // password
  {
    host: "localhost", // host host: "127.0.0.1", // Use IPv4 address
    dialect: "mysql", // database type
    logging: false, // disable logging
    dialectOptions: {
      connectTimeout: 10000, // Set timeout to 10 seconds
    },
  }
);

// Function to test the database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL Connected");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1); // Exit the process with a failure code
  }
};

// Export the sequelize instance and the connectDB function
export default { sequelize, connectDB };
