import mysql from 'mysql2/promise';


export const pool = mysql.createPool({
  host: '4.240.47.21',
  user: 'root',
  password:'password@123',
  database: 'azure_usage',
  keepAliveInitialDelay: 10000, // 0 by default.
  enableKeepAlive: true, // false by default.
});

export default async function createConn() {
  try {
    const conn = await pool.getConnection();
    // Make sure the connection is alive
    await conn.ping();
    return conn;
  } catch (error) {
    console.error("Error getting MySQL connection:", error);
    throw error; // handle reconnection here if needed
  }
}



