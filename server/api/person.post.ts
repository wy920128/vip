import { Connection } from "mariadb";
import { pool } from "../utils/db";
import { Person } from "../../types/person";

/**
 * 批量添加人员信息
 * @param persons 需要添加的人员数组
 * @returns 成功插入的数量
 */
export const batchAddPersons = async (persons: Person[]): Promise<number> => {
  // 参数验证
  if (!Array.isArray(persons) || persons.length === 0) {
    throw new Error("输入必须是非空的人员数组");
  }

  let connection: Connection | null = null;
  let successCount = 0;

  try {
    // 从连接池获取连接
    connection = await pool.getConnection();

    // 遍历每个人员信息
    for (const person of persons) {
      try {
        // 1. 检查记录是否已存在（假设以 id 作为唯一标识，根据实际表结构调整条件）
        const existResult = await connection.query(
          "SELECT 1 FROM person WHERE id = ? LIMIT 1",
          [person.id]
        );

        // 2. 如果不存在则执行插入
        if (existResult.length === 0) {
          // 构建插入 SQL（根据 Person 类型的实际字段调整列名和参数）
          const insertResult = await connection.query(
            `INSERT INTO person (
              name, 
              gender, 
              id_number, 
              created_time, 
              updated_time
            ) VALUES (?, ?, ?, NOW(), NOW())`,
            [person.name, person.gender, person.id_number]
          );
          // 验证插入结果（mariadb 插入成功会返回 affectedRows）
          if (insertResult.affectedRows === 1) {
            successCount++;
          }
        }
      } catch (error) {
        console.error(`处理人员 [id: ${person.id}] 失败:`, error);
        continue;
      }
    }
    return successCount;
  } catch (error) {
    // 处理连接或全局错误
    console.error("批量添加人员发生全局错误:", error);
    throw error; // 向上层抛出错误，由调用方处理
  } finally {
    // 确保连接释放回池
    if (connection) {
      try {
        await connection.end();
      } catch (releaseError) {
        console.error("释放数据库连接失败:", releaseError);
      }
    }
  }
};
