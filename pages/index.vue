<template>
  <div class="home-container" v-if="!isChecking">
    <text> 首页 </text>
    <!-- 展示 Cookie 中的所有登录数据 -->
    <div class="cookie-data" v-if="isLoginValid">
      <h3>Cookie 中存放的登录数据：</h3>
      <!-- 格式化展示所有数据（处理空值） -->
      <div class="data-item">
        <span class="label">Token：</span>
        <span class="value">{{ userCookie.token || "无" }}</span>
      </div>
      <div class="data-item">
        <span class="label">用户ID：</span>
        <span class="value">{{ userCookie.user?.id || "无" }}</span>
      </div>
      <div class="data-item">
        <span class="label">用户名：</span>
        <span class="value">{{ userCookie.user?.username || "无" }}</span>
      </div>
      <div class="data-item">
        <span class="label">用户角色：</span>
        <span class="value">{{
          userCookie.user?.role?.join(", ") || "无"
        }}</span>
      </div>
      <div class="data-item">
        <span class="label">Token过期时间戳：</span>
        <span class="value">{{ userCookie.expiresAt || "无" }}</span>
      </div>
      <div class="data-item">
        <span class="label">Token过期时间（格式化）：</span>
        <span class="value">{{
          userCookie.expiresAt
            ? new Date(userCookie.expiresAt).toLocaleString()
            : "无"
        }}</span>
      </div>
      <!-- 展示原始 Cookie 数据（方便调试） -->
      <div class="data-item raw-data">
        <span class="label">原始 Cookie 数据：</span>
        <pre class="value">{{ JSON.stringify(userCookie, null, 2) }}</pre>
      </div>
    </div>
    <div v-else class="no-data">未检测到登录 Cookie 数据，请先登录</div>
  </div>
  <!-- 加载态：避免页面闪烁 -->
  <div class="loading" v-else>校验登录状态中...</div>
</template>

<script lang="ts" setup>
import { useCookie } from "nuxt/app";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import type { UserCookieState } from "~/composables/useCookieStorage";

// 1. 初始化核心变量
const router = useRouter(); // 路由实例（用于跳转登录页）
const isChecking = ref(true); // 登录态校验中标记（避免页面闪烁）

// 2. 读取登录 Cookie（SSR 安全）
const userCookie = useCookie<UserCookieState>(`user`, {
  default: () => ({ token: ``, user: null, expiresAt: 0 }),
});

// 3. 计算属性：判断登录态是否有效
const isLoginValid = computed(() => {
  // 校验条件：
  // - Token 非空
  // - 用户信息存在
  // - Token 未过期（expiresAt > 当前时间戳）
  const hasToken = !!userCookie.value.token;
  const hasUser = !!userCookie.value.user;
  const isNotExpired = userCookie.value.expiresAt > Date.now();
  return hasToken && hasUser && isNotExpired;
});

// 4. 封装：跳转到登录页（仅客户端执行）
const redirectToLogin = () => {
  if (import.meta.client) {
    // 避免重复跳转（当前已经是登录页则不跳转）
    if (router.currentRoute.value.path !== `/login`) {
      router.push({ path: `/login` });
    }
  }
};

// 5. 登录态校验 + 自动跳转（客户端挂载后执行）
onMounted(async () => {
  try {
    // 模拟短暂延迟（可选，优化体验）
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // 登录态无效则跳转
    if (!isLoginValid.value) {
      redirectToLogin();
    }
  } catch (error) {
    console.error(`登录态校验失败：`, error);
    redirectToLogin();
  } finally {
    // 结束校验，展示页面
    isChecking.value = false;
  }
});

// 6. 监听登录态变化（比如Token过期时实时跳转）
watch(isLoginValid, (newVal) => {
  if (!newVal) {
    redirectToLogin();
  }
});
</script>

<style scoped>
/* 原有样式保留 */
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}

/* 新增/优化样式 */
.home-container {
  padding: 20px;
}

/* 加载态样式 */
.loading {
  padding: 20px;
  color: #666;
  text-align: center;
}

.cookie-data {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.data-item {
  display: flex;
  margin: 8px 0;
  line-height: 1.5;
}

.label {
  font-weight: bold;
  width: 180px;
  color: #333;
}

.value {
  flex: 1;
  color: #666;
}

.raw-data {
  margin-top: 15px;
  flex-direction: column;
}

.raw-data .label {
  margin-bottom: 5px;
}

.raw-data pre {
  margin: 0;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  overflow-x: auto;
}

.no-data {
  margin-top: 20px;
  color: #999;
  padding: 15px;
  border: 1px dashed #e6e6e6;
  border-radius: 8px;
}
</style>