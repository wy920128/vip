import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

export default defineNuxtPlugin((nuxtApp) => {
  // 将持久化插件应用到 Pinia 实例
  nuxtApp.$pinia.use(piniaPluginPersistedstate);
});
