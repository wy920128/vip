<!--
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-12-26 14:27:05
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2026-01-15 08:51:44
 * @FilePath: /vip/layouts/default.vue
 * @Description: 布局 默认
-->
<template>
  <div class="layout-default">
    <a-menu
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :items="items"
    />
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
import {
  HomeTwoTone,
  IdcardTwoTone,
  SettingTwoTone,
} from "@ant-design/icons-vue";
import type { MenuProps } from "ant-design-vue";
import { useCookie } from "nuxt/app";
import { computed } from "vue";
import type { UserCookieState } from "~/composables/useCookieStorage";

const userCookie = useCookie<UserCookieState>(`user`, {
  default: () => ({ token: ``, user: null, expiresAt: 0 }),
});

const items: Ref<MenuProps[`items`]> = computed(() => {
  if (!userCookie.value?.user?.role) return undefined;
  const defaultItems = [
    {
      key: `/`,
      icon: () => h(HomeTwoTone),
      label: `首页`,
      title: `首页`,
    },
    {
      key: `/person`,
      icon: () => h(IdcardTwoTone),
      label: `重点人员`,
      title: `重点人员`,
    },
  ];
  const roles = Array.isArray(userCookie.value.user.role)
    ? userCookie.value.user.role
    : [userCookie.value.user.role];
  if (roles.includes(`superadmin`)) {
    defaultItems.push({
      key: `/superadmin`,
      icon: () => h(SettingTwoTone),
      label: `超级管理员`,
      title: `超级管理员`,
    });
  }
  return defaultItems;
});
</script>

<style scoped>
.layout-default {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  /* :deep(.a-menu) {
    margin-bottom: 20px;
  } */
}
</style>
