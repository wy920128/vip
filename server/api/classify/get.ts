import { query } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const param = getQuery(event);
    const {
      // 分页参数
      page = 1,
      pageSize = 10,
      // person 表字段搜索条件(id,name,gender是classify表的字段)
      id,
      name,
      // 忽略其他无关参数
      ...rest
    } = param;
    // 类型转换
    const currentPage = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 10;
    const offset = (currentPage - 1) * pageSizeNum;
    // 构建查询参数
    const params: any[] = [];
    // 基础 SQL（关联表并过滤软删除数据）
    let selectSql = `
      SELECT DISTINCT c.* 
      FROM classify c 
      LEFT JOIN classify2person pc ON c.id = pc.classifyId 
      WHERE c.deleted_time IS NULL 
        AND pc.deleted_time IS NULL
    `;
    // 动态添加 classify 表字段搜索条件
    // 1. id 精确匹配
    if (id !== undefined && id !== "") {
      selectSql += " AND c.id = ?";
      params.push(Number(id));
    }
    // 2. name 模糊匹配
    if (name !== undefined && name !== "") {
      selectSql += " AND c.name LIKE ?";
      params.push(`%${name}%`);
    }
    // 添加分页
    selectSql += " LIMIT ? OFFSET ?";
    // 补充分页参数
    params.push(pageSizeNum, offset);
    // 执行查询
    const classifyList = await query(selectSql, params);
    return {
      code: 200,
      message: "查询成功",
      data: {
        list: classifyList,
        pagination: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPage: 1,
        },
      },
    };
  } catch (error) {
    console.error("查询失败:", error);
    return {
      code: 500,
      message: "查询失败",
      error: error instanceof Error ? error.message : String(error),
    };
  }
});
