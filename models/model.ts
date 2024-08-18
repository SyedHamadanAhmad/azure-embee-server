import mysql from 'mysql2/promise';


export const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password:'password@123',
  database: 'azure_usage',
  connectTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
});

export default async function createConn(){
  const conn=await pool.getConnection();
  return conn;
}



