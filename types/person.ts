export interface Person {
  id: number; // 假设id为数字类型
  name: string; // 姓名
  gender: string | null; // 性别
  id_number: string | null; // 证件编号
  created_time: Date | string; // 创建时间
  updated_time: Date | string; // 更新时间
  deleted_time: Date | string | null; // 删除时间，允许为空
}

export type PersonWithoutId = Omit<Person, "id">;
