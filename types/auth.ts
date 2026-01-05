type UserRole = `admin` | `user` | `editor`;
export interface IAuth {
  id: number; // id为数字类型
  username: string; // 用户名
  password: string; // 密码
  role: UserRole[]; // 角色数组
  created_time: Date | string; // 创建时间
  updated_time: Date | string; // 更新时间
  deleted_time: Date | string | null; // 删除时间，允许为空
}
export interface VAuth {
  id: number; // id为数字类型
  username: string; // 用户名
  role: UserRole[]; // 角色数组
}
export type IAuthWithoutId = Omit<IAuth, `id`>;
export interface Sauth {
  username: string;
}
