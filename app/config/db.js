const mysql = require("mysql2/promise");

let pool;

async function initDB(config) {
  try {
    pool = mysql.createPool({
      host: config.APP_DB_HOST,
      user: config.APP_DB_USER,
      password: config.APP_DB_PASSWORD,
      database: config.APP_DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // test connection
    await pool.query("SELECT 1");

    // auto crate table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20)
      )
    `);

    console.log("✅ DB connected & students table ready");

    console.log("✅ MySQL pool created");
  } catch (err) {
    console.error("❌ Unable to connect to DB:", err.message);
    pool = null;
  }
}

function getDB() {
  return pool;
}

module.exports = { initDB, getDB };
