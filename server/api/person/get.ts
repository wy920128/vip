import { Res } from "~/types";
import { IPerson } from "~/types/person";

export default defineEventHandler(async (event): Promise<Res<IPerson[]>> => {
  try {
    const query = getQuery(event);
    const {
      // 分页参数
      page = 1,
      pageSize = 10,
      // person 表字段搜索条件
      id,
      name,
      gender,
      id_number,
      // 分类关联条件
      classifyIds,
      // 忽略其他无关参数
      ...rest
    } = query;

    // 类型转换
    const currentPage = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 10;
    const offset = (currentPage - 1) * pageSizeNum;

    // 构建查询参数
    const params: any[] = [];
    // 基础 SQL（关联表并过滤软删除数据）
    let selectSql = `
      SELECT DISTINCT
        p.id,
        p.name,
        p.gender,
        p.credentials,
        COALESCE(
          (SELECT JSON_ARRAYAGG(
            JSON_OBJECT('id', c.id, 'name', c.name)
          ) FROM classify2person pc 
          LEFT JOIN classify c ON pc.classifyId = c.id AND c.deleted_time IS NULL
          WHERE pc.personId = p.id AND pc.deleted_time IS NULL),
          '[]'
        ) AS classify
      FROM person p 
      WHERE p.deleted_time IS NULL
    `;
    // 计数 SQL（用于分页总条数）
    let countSql = `
      SELECT COUNT(DISTINCT p.id) as total 
      FROM person p 
      LEFT JOIN classify2person pc
      ON p.id = pc.personId
      AND pc.deleted_time IS NULL
      LEFT JOIN classify c
      ON pc.classifyId = c.id
      AND c.deleted_time IS NULL
      WHERE p.deleted_time IS NULL
    `;
    // 动态添加 person 表字段搜索条件
    // 1. id 精确匹配
    if (id !== undefined && id !== ``) {
      selectSql += ` AND p.id = ?`;
      countSql += ` AND p.id = ?`;
      params.push(Number(id));
    }
    // 2. name 模糊匹配
    if (name !== undefined && name !== ``) {
      selectSql += ` AND p.name LIKE ?`;
      countSql += ` AND p.name LIKE ?`;
      params.push(`%${name}%`);
    }
    // 3. gender 精确匹配
    if (gender !== undefined && gender !== ``) {
      selectSql += ` AND p.gender = ?`;
      countSql += ` AND p.gender = ?`;
      params.push(gender);
    }
    // 5. id_number 模糊匹配
    if (id_number !== undefined && id_number !== ``) {
      selectSql += ` AND JSON_SEARCH(p.credentials, 'one', ? , null, '$[*].number') IS NOT NULL`;
      countSql += ` AND JSON_SEARCH(p.credentials, 'one', ? , null, '$[*].number') IS NOT NULL`;
      params.push(`%${id_number}%`);
    }
    // 添加分类关联条件
    if (classifyIds !== undefined && classifyIds !== ``) {
      const classifyArray = String(classifyIds)
        .split(`,`)
        .map((id) => Number(id))
        .filter((id) => !isNaN(id));
      if (classifyArray.length > 0) {
        selectSql += ` AND EXISTS (
          SELECT 1 FROM classify2person pc 
          WHERE pc.personId = p.id 
          AND pc.deleted_time IS NULL 
          AND pc.classifyId IN (${classifyArray.map(() => `?`).join(`,`)})
        )`;
        countSql += ` AND EXISTS (
          SELECT 1 FROM classify2person pc 
          WHERE pc.personId = p.id 
          AND pc.deleted_time IS NULL 
          AND pc.classifyId IN (${classifyArray.map(() => `?`).join(`,`)})
        )`;
        params.push(...classifyArray);
      }
    }
    // 必须GROUP BY p.id：否则聚合函数会把所有人员合并为一条
    // selectSql += ` GROUP BY p.id`;
    // 添加分页
    selectSql += ` LIMIT ? OFFSET ?`;
    // 复制查询参数用于计数查询（排除分页参数）
    const countParams = [...params];
    // 补充分页参数
    params.push(pageSizeNum, offset);
    // 执行查询
    console.log(selectSql, params);
    const personList = await db.execute(selectSql, params);
    const countResult = await db.execute(countSql, countParams);
    const total = Number((countResult as any[])[0]?.total) || 0;
    return {
      code: 200,
      data: {
        list: personList,
        pagination: {
          page: currentPage,
          pageSize: pageSizeNum,
          total,
          totalPages: Math.ceil(total / pageSizeNum),
        },
      },
      message: `查询成功，共 ${total} 条记录`,
      success: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`查询失败:`, error);
    return {
      code: 500,
      data: {
        list: [],
        pagination: {
          page: 1,
          pageSize: 1,
          total: 1,
          totalPages: 1,
        },
      },
      message: error instanceof Error ? error.message : String(error),
      success: false,
      timestamp: new Date().toISOString(),
    };
  }
});
