/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2026-01-14 15:57:28
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2026-01-14 15:59:40
 * @FilePath: /vip/types/person2tag.ts
 * @Description: types/person2tag 人员关联标签表
 */
import type { PageParams, TimeStamp } from ".";

/** 人员关联标签表-本体 */
interface Person2Tag {
  person_id: number; // 人员ID
  tag_id: number; // 标签ID
  created_time: TimeStamp; // 创建时间
  updated_time: TimeStamp; // 更新时间
  deleted_time: TimeStamp; // 软删除标记
}
/** 人员关联标签表-展示用VO */
interface Person2TagVO extends Person2Tag {
  person_name?: string; // 人员姓名
  tag_name?: string; // 标签名称
}
/** 人员关联标签表-提交用PO（创建/更新） */
interface Person2TagPO {
  person_id: number; // 人员ID
  tag_id: number; // 标签ID
}
/** 人员关联标签表-查询用GO（筛选条件） */
interface Person2TagGO extends PageParams {
  person_id?: number;
  tag_id?: number;
  deleted_time?: null; // 筛选未删除数据
}
