// server/api/personnel.get.ts
import mysql, { Pool, PoolConnection, PoolOptions } from "mysql2/promise";

// ===================== 1. 类型定义（确保类型安全） =====================
interface Person {
  id: number;
  name: string;
  gender?: string; // 使用可选属性，避免数据库为NULL时类型错误
  id_number?: string;
  created_time?: Date;
  updated_time?: Date;
  deleted_time?: Date | null;
}

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
}

// ===================== 2. 全局连接池单例（优化配置获取逻辑） =====================
let dbPool: Pool | null = null;

function getDBPool(event: any): Pool {
  if (dbPool) {
    return dbPool;
  }

  // 推荐方式：尝试通过 event.context 获取配置（需在 nuxt.config.ts 或中间件中注入）
  // const config = event.context.config;
  // 备用方式：如果上述方式不可用，尝试使用 useRuntimeConfig（需确保在 Nuxt 上下文内）
  let config;
  try {
    config = useRuntimeConfig(event);
  } catch (e) {
    // 如果不在 Nuxt 上下文，则回退到 process.env
    console.warn("使用 process.env 获取环境变量");
    config = {
      dbHost: process.env.DB_HOST,
      dbPort: process.env.DB_PORT,
      dbUser: process.env.DB_USER,
      dbPassword: process.env.DB_PASSWORD,
      dbName: process.env.DB_NAME
    };
  }

  const poolConfig: PoolOptions = {
    host: config.dbHost || "localhost",
    port: config.dbPort ? Number(config.dbPort) : 3306,
    user: config.dbUser || "root",
    password: config.dbPassword || "",
    database: config.dbName || "qb", // 提供一个默认数据库名
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 5000,
    charset: "utf8mb4",
  };

  if (!poolConfig.database) {
    throw createError({
      statusCode: 500,
      statusMessage: "Server configuration error: Database name is required.",
    });
  }

  dbPool = mysql.createPool(poolConfig);
  dbPool.on("error", (err) => {
    console.error("[数据库连接池异常]", err);
    dbPool = null;
  });

  return dbPool;
}

// ===================== 3. 核心接口逻辑（使用 Nuxt 3 的 createError） =====================
export default defineEventHandler(async (event): Promise<ApiResponse<Person[]>> => {
  let connection: PoolConnection | null = null;

  try {
    const pool = getDBPool(event);
    connection = await pool.getConnection();

    const querySQL = `
      SELECT id, name, gender, id_number, created_time, updated_time, deleted_time 
      FROM person 
      WHERE deleted_time IS NULL 
      ORDER BY created_time DESC
    `;

    const [rows] = await connection.execute<mysql.RowDataPacket[]>(querySQL);
    // 将查询结果转换为 Person 类型数组
    const personnelData: Person[] = rows as Person[];

    // 返回标准化结果
    return {
      success: true,
      data: personnelData,
      total: personnelData.length,
    };

  } catch (error) {
    const err = error as Error & { code?: string };
    console.error("[人员数据查询失败]", {
      time: new Date().toISOString(),
      code: err.code,
      message: err.message,
    });

    // 使用 Nuxt 3 的 createError 抛出错误 [2,3,5](@ref)
    switch (err.code) {
      case "ER_ACCESS_DENIED_ERROR":
        throw createError({
          statusCode: 500, // 数据库认证错误属于服务器端配置问题
          statusMessage: "Database authentication failed.",
        });
      case "ER_BAD_DB_ERROR":
      case "ER_NO_SUCH_TABLE":
        throw createError({
          statusCode: 404,
          statusMessage: "Requested resource not found.",
        });
      case "ETIMEDOUT":
        throw createError({
          statusCode: 504,
          statusMessage: "Database connection timeout.",
        });
      default:
        throw createError({
          statusCode: 500,
          statusMessage: process.env.NODE_ENV === "development" ? err.message : "Internal server error.",
        });
    }
  } finally {
    if (connection) {
      try {
        connection.release();
      } catch (releaseErr) {
        console.error("[释放数据库连接失败]", releaseErr);
      }
    }
  }
});