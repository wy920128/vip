export interface IClassify {
  id: number; // id为数字类型
  name: string; // 名称
  created_time: Date | string; // 创建时间
  updated_time: Date | string; // 更新时间
  deleted_time: Date | string | null; // 删除时间，允许为空
}
export interface VClassify {
  id: number; // id为数字类型
  name: string; // 名称
}
export type IClassifyWithoutId = Omit<IClassify, "id">;
