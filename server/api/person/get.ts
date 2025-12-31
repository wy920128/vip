// export default defineEventHandler(async (event) => {
//   try {
//     const personnel = await query(`
//       SELECT id, name, gender, id_number, created_time, updated_time
//       FROM person
//       WHERE deleted_time IS NULL
//       ORDER BY created_time DESC
//     `);

//     return {
//       success: true,
//       data: personnel,
//     };
//   } catch (error) {
//     console.error("Failed to fetch personnel list:", error);
//     throw error;
//   }
// });
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
      gender,
      id_number,
      // 分类关联条件
      classifyId,
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
      SELECT DISTINCT p.* 
      FROM person p 
      LEFT JOIN person2classify pc ON p.id = pc.personId 
      WHERE p.deleted_time IS NULL 
        AND pc.deleted_time IS NULL
    `;
    // 计数 SQL（用于分页总条数）
    let countSql = `
      SELECT COUNT(DISTINCT p.id) as total 
      FROM person p 
      INNER JOIN person2classify pc ON p.id = pc.personId 
      WHERE p.deleted_time IS NULL 
        AND pc.deleted_time IS NULL
    `;
    // 动态添加 person 表字段搜索条件
    // 1. id 精确匹配
    if (id !== undefined && id !== "") {
      selectSql += " AND p.id = ?";
      countSql += " AND p.id = ?";
      params.push(Number(id));
    }
    // 2. name 模糊匹配
    if (name !== undefined && name !== "") {
      selectSql += " AND p.name LIKE ?";
      countSql += " AND p.name LIKE ?";
      params.push(`%${name}%`);
    }
    // 3. gender 精确匹配
    if (gender !== undefined && gender !== "") {
      selectSql += " AND p.gender = ?";
      countSql += " AND p.gender = ?";
      params.push(gender);
    }
    // 5. id_number 模糊匹配
    if (id_number !== undefined && id_number !== "") {
      selectSql += " AND p.id_number LIKE ?";
      countSql += " AND p.id_number LIKE ?";
      params.push(`%${id_number}%`);
    }
    // 添加分类关联条件
    if (classifyId !== undefined && classifyId !== "") {
      // 存在分类ID时强制关联（过滤无分类关联的数据）
      selectSql += " AND pc.classifyId = ?";
      countSql += " AND pc.classifyId = ?";
      params.push(Number(classifyId));
    }
    // 添加分页
    selectSql += " LIMIT ? OFFSET ?";
    // 复制查询参数用于计数查询（排除分页参数）
    const countParams = [...params];
    // 补充分页参数
    params.push(pageSizeNum, offset);
    // 执行查询
    const personList = await db.execute(selectSql, params);
    const countResult = await db.execute(countSql, countParams);
    const total = Number((countResult as any[])[0]?.total) || 0;
    return {
      code: 200,
      message: "查询成功",
      data: {
        list: personList,
        pagination: {
          page: currentPage,
          pageSize: pageSizeNum,
          total,
          totalPages: Math.ceil(total / pageSizeNum),
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
