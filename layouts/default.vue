<template>
  <div class="layout-default">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/person">重点人员</el-menu-item>
      <!-- 仅 admin 角色显示平台管理 -->
      <el-menu-item index="/management" v-if="isAdmin">平台管理</el-menu-item>
    </el-menu>
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
import { useCookie } from "nuxt/app";
import { computed } from "vue";
import type { UserCookieState } from "~/composables/useCookieStorage";

const userCookie = useCookie<UserCookieState>(`user`, {
  default: () => ({ token: ``, user: null, expiresAt: 0 }),
});

const isAdmin = computed(() => {
  if (!userCookie.value?.user?.role) return false;
  const roles = Array.isArray(userCookie.value.user.role)
    ? userCookie.value.user.role
    : [userCookie.value.user.role];
  return roles.includes(`admin`);
});
</script>

<style scoped>
.layout-default {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  :deep(.el-menu) {
    margin-bottom: 20px;
  }
}
</style>
