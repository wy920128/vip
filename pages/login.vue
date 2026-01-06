<template>
  <div class="login-container">
    <el-card class="login-card" header="用户登录">
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <!-- 证件编号登录（对应 IPerson 中的 id_number） -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
          />
        </el-form-item>
        <!-- 密码输入 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <!-- 记住密码与忘记密码 -->
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
definePageMeta({
  layout: false,
});
import { ref, reactive, onMounted } from "vue";
import { ElForm, ElMessage, ElLink } from "element-plus";
import { useRouter } from "nuxt/app";
import { useUserStore } from "~/stores/user";

// 表单类型定义
interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

// 表单引用
const loginFormRef = ref<InstanceType<typeof ElForm>>();

// 登录表单数据
const loginForm = reactive<LoginForm>({
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
const router = useRouter();
const userStore = useUserStore();

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return;
  const valid = await loginFormRef.value.validate();
  if (!valid) return;

  try {
    isLoading.value = true;
    // 调用登录接口（使用 username 作为登录标识）
    const response: Res<IAuth> = await $fetch(`/api/auth`, {
      method: `POST`,
      body: {
        username: loginForm.username,
        password: loginForm.password,
      },
    });

    if (response.success) {
      // 存储用户信息（类型与 IPerson 对齐）
      userStore.setUser(response.data.user);
      userStore.setToken(response.data.token);

      // 记住密码（仅存储证件编号，密码不本地存储）
      if (loginForm.remember) {
        localStorage.setItem(`rememberedusername`, loginForm.username);
      } else {
        localStorage.removeItem(`rememberedusername`);
      }

      await router.push(`/`);
      ElMessage.success(`登录成功`);
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
  const savedId = localStorage.getItem(`rememberedusername`);
  if (savedId) {
    loginForm.username = savedId;
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
