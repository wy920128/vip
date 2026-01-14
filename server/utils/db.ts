/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-12-24 10:12:05
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2026-01-14 15:03:05
 * @FilePath: /vip/server/utils/db.ts
 * @Description: 后台数据库连接池
 */
import mariadb from "mariadb";
import { Pool } from "mariadb";
import type { Connection } from "mariadb/promise";
import type { PoolConfig } from "mariadb";

const runtimeConfig = useRuntimeConfig();
// 配置连接池
const poolConfig: PoolConfig = {
  host: runtimeConfig.db_aliyun.dbHost,
  user: runtimeConfig.db_aliyun.dbUser,
  password: runtimeConfig.db_aliyun.dbPassword,
  database: runtimeConfig.db_aliyun.dbName,
  port: parseInt(runtimeConfig.db_aliyun.dbPort!),
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
