/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-12-24 09:46:58
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2026-01-07 16:15:52
 * @FilePath: /vip/types/person.ts
 * @Description: 类型定义 person
 */
import type { VClassify } from "./classify";

export interface IPerson {
  id: number; // id为数字类型
  name: string; // 姓名
  gender: string | null; // 性别
  id_number: string | null; // 证件编号
  classify: string; // 关联的分类信息
  created_time: Date | string; // 创建时间
  updated_time: Date | string; // 更新时间
  deleted_time: Date | string | null; // 删除时间，允许为空
}
export interface VPerson {
  id: number; // id为数字类型
  name: string; // 姓名
  gender: string | null; // 性别
  id_number: string | null; // 证件编号
  classify: VClassify[]; // 关联的分类信息
}
export type IPersonWithoutId = Omit<IPerson, `id`>;
