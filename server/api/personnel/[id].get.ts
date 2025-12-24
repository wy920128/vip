export default defineEventHandler(async (event) => {
  try {
    // 从动态路由参数中获取人员ID
    const id = getRouterParam(event, "id");

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: "无效的人员ID",
      });
    }

    // 使用参数化查询，将id作为参数传入，防止SQL注入
    const personnel = await executeQuery(
      "SELECT id, name, gender, id_number, created_time, updated_time FROM person WHERE id = ? AND deleted_time IS NULL",
      [id]
    );

    // 检查是否查询到结果
    if (Array.isArray(personnel) && personnel.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "人员不存在",
      });
    }

    return {
      success: true,
      data: personnel[0], // 返回单个人员对象
    };
  } catch (error) {
    console.error(
      `Failed to fetch personnel detail for ID: ${getRouterParam(event, "id")}`,
      error
    );
    throw error;
  }
});
