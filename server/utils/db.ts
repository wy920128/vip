import mariadb from "mariadb";
import { Pool } from "mariadb";
import type { Connection } from "mariadb/promise";
import type { PoolConfig } from "mariadb";

// 配置连接池
const poolConfig: PoolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT!),
  connectionLimit: 10,
  connectTimeout: 5000,
};

// 创建连接池
const pool: Pool = mariadb.createPool(poolConfig);

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
export const query = async <T = unknown>(
  sql: string,
  params: any[] = []
): Promise<T> => {
  let conn: Connection | null = null;
  try {
    conn = await getConnection();
    const result = await conn.query(sql, params);
    return result as T;
  } catch (error) {
    console.error(`查询失败 [${sql}]:`, error);
    throw error;
  } finally {
    if (conn) conn.end();
  }
};

/**
 * 执行写操作（适用于 INSERT/UPDATE/DELETE 等）
 * @param sql SQL语句
 * @param params 参数数组
 * @returns 操作结果（包含影响行数等信息）
 */
export const execute = async (
  sql: string,
  params: any[] = []
): Promise<{ affectedRows: number; insertId?: number }> => {
  let conn: Connection | null = null;
  try {
    conn = await getConnection();
    const result: any = await conn.query(sql, params);
    return {
      affectedRows: result.affectedRows,
      insertId: result.insertId,
    };
  } catch (error) {
    console.error(`执行操作失败 [${sql}]:`, error);
    throw error;
  } finally {
    if (conn) conn.end();
  }
};

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
