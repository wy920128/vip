import { defineStore } from "pinia";

interface UserInfo {
  id: number;
  name: string;
  email: string;
}

export const useUserStore = defineStore(`user`, {
  state: () => ({
    userInfo: null as UserInfo | null,
    token: null as string | null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    async login(credentials: { email: string; password: string }) {
      // 调用登录 API
      const { data, error } = await useFetch("/api/auth/login", {
        method: "POST",
        body: credentials,
      });
      if (error.value) {
        throw new Error(error.value.message);
      }
      // 登录成功，更新 store 状态
      this.token = data.value.token;
      this.userInfo = data.value.user;
      // 可选：将 token 持久化到 sessionStorage 或 localStorage
      if (process.client) {
        sessionStorage.setItem("auth_token", this.token);
      }
    },
    logout() {
      this.token = null;
      this.userInfo = null;
      if (process.client) {
        sessionStorage.removeItem("auth_token");
      }
    },
    // 初始化时从存储中恢复状态
    initialize() {
      if (process.client) {
        const savedToken = sessionStorage.getItem("auth_token");
        if (savedToken) {
          this.token = savedToken;
          // 通常还需要调用一个接口来获取最新的用户信息
          // this.fetchUserInfo()
        }
      }
    },
  },
});
