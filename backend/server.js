require("dotenv").config();
const express = require("express");
const cors = require("cors");

const pool = require("./models/db");
const faceRoutes = require("./routes/faces");

/*
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for online DB
  host: "yourhost", // Replace with the actual host
  port: 5432,
  keepAlive: true, // Helps maintain the connection
});
*/         

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/api/profiles", faceRoutes);

app.listen(port,'0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  });

