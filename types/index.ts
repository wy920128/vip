/**
 * 通用API响应接口
 * @param T 数据类型泛型，默认为any
 */
export interface Res<T = any> {
  // 状态码 (通常200或0表示成功)
  code: number;
  // 响应消息 (成功或错误信息)
  message: string;
  // 核心响应数据 (使用泛型)
  data: T;
  // 可选字段：请求状态 (某些后端框架会返回)
  status?: number;
  // 可选字段：分页信息 (对于列表数据)
  pagination?: {
    current: number;    // 当前页码
    pageSize: number;   // 每页大小
    total: number;      // 总数
    totalPages: number; // 总页数
  };
  // 可选字段：时间戳
  timestamp?: string;
}

/**
 * 分页查询参数接口 (通常与Res配合使用)
 */
export interface PageParams {
  current?: number;  // 当前页码
  pageSize?: number; // 每页大小
  [key: string]: any; // 其他查询参数
}

/**
 * 列表响应数据格式 (常用场景)
 */
export interface ListData<T = any> {
  list: T[];
  total: number;
}