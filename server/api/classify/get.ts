export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const {
      // 分页参数
      page = 1,
      pageSize = 10,
      // person 表字段搜索条件
      id,
      name,
      // 分类关联条件
      personId,
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
      SELECT DISTINCT c.* 
      FROM classify c 
      LEFT JOIN person2classify pc ON c.id = pc.classifyId 
      WHERE c.deleted_time IS NULL 
        AND pc.deleted_time IS NULL
    `;
    // 计数 SQL（用于分页总条数）
    let countSql = `
      SELECT COUNT(DISTINCT c.id) as total 
      FROM classify c 
      LEFT JOIN person2classify pc ON c.id = pc.classifyId 
      WHERE c.deleted_time IS NULL 
        AND pc.deleted_time IS NULL
    `;
    // 动态添加 classify 表字段搜索条件
    // 1. id 精确匹配
    if (id !== undefined && id !== "") {
      selectSql += " AND c.id = ?";
      countSql += " AND c.id = ?";
      params.push(Number(id));
    }
    // 2. name 模糊匹配
    if (name !== undefined && name !== "") {
      selectSql += " AND c.name LIKE ?";
      countSql += " AND c.name LIKE ?";
      params.push(`%${name}%`);
    }
    // 3. personId 精确匹配
    if (personId !== undefined && personId !== "") {
      selectSql += " AND pc.personId = ?";
      countSql += " AND pc.personId = ?";
      params.push(Number(personId));
    }
    // 添加分类关联条件
    if (personId !== undefined && personId !== "") {
      // 存在分类ID时强制关联（过滤无分类关联的数据）
      selectSql += " AND pc.personId = ?";
      countSql += " AND pc.personId = ?";
      params.push(Number(personId));
    }
    // 添加分页
    selectSql += " LIMIT ? OFFSET ?";
    // 复制查询参数用于计数查询（排除分页参数）
    const countParams = [...params];
    // 补充分页参数
    params.push(pageSizeNum, offset);
    // 执行查询
    const [classifyList] = await db.execute(selectSql, params);
    const [countResult] = await db.execute(countSql, countParams);
    const total = (countResult as any[])[0]?.total || 0;
    return {
      code: 200,
      message: "查询成功",
      data: {
        list: classifyList,
        pagination: {
          page: currentPage,
          pageSize: pageSizeNum,
          total,
          totalPage: Math.ceil(total / pageSizeNum),
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
