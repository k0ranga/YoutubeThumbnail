require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

pool.connect()
    .then(() => console.log(" Connected "))
    .catch((err) => console.error("DATA BASE ERROR",err));


module.exports = pool;
