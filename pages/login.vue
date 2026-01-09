<template>
  <div class="login-container">
    <el-card class="login-card" header="用户登录">
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <div class="form-actions">
            <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
            <el-link type="primary" @click="handleForgotPassword"
              >忘记密码？</el-link
            >
          </div>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            @click="handleLogin"
            :loading="isLoading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });
import { ref, reactive, onMounted } from "vue";
import { ElForm, ElMessage } from "element-plus";
import { useRouter } from "nuxt/app";
import { useUserState } from "~/composables/useUserState";
import type { Res } from "~/types";
import type { IAuth } from "~/types/auth";
import bcrypt from "bcryptjs";
console.log(`密码,${bcrypt.hashSync(`123456`, 10)}`);
const { setUser, setToken, getRememberedUsername, rememberUsername } =
  useUserState();
const router = useRouter();

// 表单引用
const loginFormRef = ref<InstanceType<typeof ElForm>>();

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
    const response: Res<IAuth> = await $fetch(`/api/auth/post`, {
      method: `POST`,
      body: {
        username: loginForm.username,
        password: loginForm.password,
      },
    });
    if (response.code === 200 && response.success) {
      const userInfo = response.data.list;
      if (userInfo) {
        setUser(userInfo);
        setToken(userInfo.token);
      }
      if (loginForm.remember) {
        rememberUsername(loginForm.username);
      } else {
        document.cookie = `rememberedusername=; max-age=-1; path=/`;
      }
      ElMessage.success(`登录成功`);
      await router.push(`/`);
    } else {
      ElMessage.error(response.message || `登录失败`);
    }
  } catch (error) {
    console.error(`登录错误:`, error);
    ElMessage.error(`服务器异常，请稍后重试`);
  } finally {
    isLoading.value = false;
  }
};

// 忘记密码处理
const handleForgotPassword = () => {
  ElMessage.info(`请联系管理员重置密码`);
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
