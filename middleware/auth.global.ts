/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2026-01-10 09:36:52
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2026-01-10 09:41:52
 * @FilePath: /vip/middleware/auth.global.ts
 * @Description: 认证中间件
 */
export default defineNuxtRouteMiddleware((to) => {
  // 使用 useUserState 管理用户状态（替代直接 useCookie）
  const { getUserInfo, getUserRoles, isTokenExpired } = useUserState();
  
  // 白名单路由（无需登录即可访问）[2,6](@ref)
  const publicRoutes = [`/login`, `/register`];
  if (publicRoutes.includes(to.path)) {
    return;
  }

  // 检查登录状态：token 存在且未过期
  const userInfo = getUserInfo();
  if (!userInfo || isTokenExpired()) {
    return navigateTo(`/login`);
  }

  // 获取用户角色并检查 liekong/admin 权限
  const userRoles = getUserRoles();
  const hasPermission = userRoles.includes(`liekong`) || userRoles.includes(`admin`);
  
  // 如果需要特定权限的路由，可在此添加检查
  // 例如：管理后台路由需要 admin 角色
  if (to.path.startsWith(`/admin`) && !userRoles.includes(`admin`)) {
    return navigateTo(`/unauthorized`); // 无权限页面
  }
});