import mysql from "mysql2/promise";

export default defineEventHandler(async (event) => {
  // 获取运行时配置
  const config = useRuntimeConfig();
  const pool = mysql.createPool({
    host: config.dbHost,
    port: config.dbPort,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
  });
  // 创建数据库连接
  try {
    const connection = await pool.getConnection();
    ({
      host: config.dbHost,
      port: config.dbPort,
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,
    });

    // 执行SQL查询，筛选有效数据（假设delete_time为NULL表示未删除）
    const [rows] = await connection.execute(`
      SELECT id, name, gender, id_number, created_time, updated_time, deleted_time 
      FROM person 
      WHERE deleted_time IS NULL 
      ORDER BY created_time DESC
    `);

    // 返回查询结果
    return {
      success: true,
      data: rows,
    };
  } catch (error) {
    console.error("Database query error:", error);
    // 返回错误信息，避免敏感信息泄露
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  } finally {
    // 确保连接被关闭
    if (connection) {
      await connection.end();
    }
  }
});
