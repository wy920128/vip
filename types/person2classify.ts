export interface IPerson2Classify {
  id: number; // id为数字类型
  personId: number; // 关联的人员ID（对应person表的id）
  classifyId: number; // 关联的分类ID（对应classify表的id）
  created_time: Date | string; // 创建时间
  updated_time: Date | string; // 更新时间
  deleted_time: Date | string | null; // 删除时间，允许为空
}

export type IPerson2ClassifyWithoutId = Omit<IPerson2Classify, "id">;