import mariadb from "mariadb";
import { Pool } from "mariadb";
import type { Connection } from "mariadb/promise";
import type { PoolConfig } from "mariadb";

const runtimeConfig = useRuntimeConfig();
// 配置连接池
const poolConfig: PoolConfig = {
  host: runtimeConfig.db.dbHost,
  user: runtimeConfig.db.dbUser,
  password: runtimeConfig.db.dbPassword,
  database: runtimeConfig.db.dbName,
  port: parseInt(runtimeConfig.db.dbPort!),
  connectionLimit: 10,
  connectTimeout: 5000,
};

// 创建连接池
export const pool: Pool = mariadb.createPool(poolConfig);

/**
 * 获取数据库连接
 * @returns 数据库连接实例
 */
export const getConnection = async (): Promise<Connection> => {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error("获取数据库连接失败:", error);
    throw new Error("数据库连接失败");
  }
};

/**
 * 通用查询函数（适用于 SELECT 等返回结果集的操作）
 * @param sql SQL语句
 * @param params 参数数组
 * @returns 查询结果（泛型类型，由调用方指定）
 */
export async function query<T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  let conn: Connection | null = null;
  try {
    conn = await getConnection();
    const result: T[] = await conn.query<T[]>(sql, params);
    return result;
  } catch (error) {
    console.error(`数据库查询失败 [${sql}]:`, error);
    throw new Error(`数据库查询失败: ${(error as Error).message}`);
  } finally {
    if (conn) conn.end();
  }
}

/**
 * 关闭连接池（应用退出时调用）
 */
export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    console.log("数据库连接池已关闭");
  } catch (error) {
    console.error("关闭连接池失败:", error);
    throw error;
  }
};

// 导出默认连接池（如需直接操作池）
export default pool;
