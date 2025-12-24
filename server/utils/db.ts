import mysql from "mysql2/promise";

const config = useRuntimeConfig();

const pool = mysql.createPool({
  host: config.dbHost,
  port: Number(config.dbPort),
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export async function executeQuery(sql: string, values?: any[]) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(sql, values);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "数据库操作失败",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export default pool;
