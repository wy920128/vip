<template>
  <div class="login-container">
    <a-card class="login-card" title="用户登录">
      <a-form
        class="login-form"
        layout="vertical"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
      >
        <a-form-item name="username">
          <a-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
          />
        </a-form-item>
        <a-form-item name="password">
          <a-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </a-form-item>
        <a-form-item>
          <div class="form-actions">
            <a-checkbox v-model="loginForm.remember">7日内免登录</a-checkbox>
            <a-link type="primary" @click="handleForgotPassword"
              >忘记密码？</a-link
            >
          </div>
        </a-form-item>
        <!-- 登录按钮 -->
        <a-form-item>
          <a-button
            type="primary"
            class="login-btn"
            @click="handleLogin"
            :loading="isLoading"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "nuxt/app";
import { useUserState } from "~/composables/useUserState";
import type { AuthVO, Res } from "~/types";
import bcrypt from "bcryptjs";
import { message } from "ant-design-vue";
console.log(`密码,${bcrypt.hashSync(`123456`, 10)}`);
const { setUser, setToken, getRememberedUsername } =
  useUserState();
const router = useRouter();

// 表单引用
const loginFormRef = ref();

// 登录表单数据
const loginForm = reactive<{
  username: string;
  password: string;
  remember: boolean;
}>({
  username: ``,
  password: ``,
  remember: false,
});

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: `请输入证件编号`, trigger: `blur` },
    { min: 6, message: `证件编号长度不能少于6位`, trigger: `blur` },
  ],
  password: [
    { required: true, message: `请输入密码`, trigger: `blur` },
    { min: 6, message: `密码长度不能少于6位`, trigger: `blur` },
  ],
};

// 状态管理
const isLoading = ref(false);

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return;
  const valid = await loginFormRef.value.validate();
  if (!valid) return;

  try {
    isLoading.value = true;
    const response: Res<Omit<AuthVO & { token: string }, `password`>> = await $fetch(`/api/auth/login`, {
      method: `POST`,
      body: {
        username: loginForm.username,
        password: loginForm.password,
        expiresIn: loginForm.remember ? `7d` : `1h`,
      },
    });
    if (response.code === 200 && response.success) {
      const userInfo = response.data.list;
      if (userInfo) {
        setUser(userInfo);
        setToken(userInfo.token);
      }
      message.success(`登录成功`);
      await router.push(`/`);
    } else {
      message.error(response.message || `登录失败`);
    }
  } catch (error) {
    console.error(`登录错误:`, error);
    message.error(`服务器异常，请稍后重试`);
  } finally {
    isLoading.value = false;
  }
};

// 忘记密码处理
const handleForgotPassword = () => {
  message.info(`请联系管理员重置密码`);
  // 实际项目可跳转至密码重置页面
};

// 初始化：填充记住的证件编号
onMounted(() => {
  const savedUsername = getRememberedUsername();
  if (savedUsername) {
    loginForm.username = savedUsername;
    loginForm.remember = true;
  }
});
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
}

.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-form {
  padding: 0 20px 20px;
}

.form-actions {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 0;
}

.login-btn {
  width: 100%;
  padding: 10px 0;
}
</style>
