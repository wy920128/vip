import { defineNuxtConfig } from `nuxt/config`;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: `2025-07-15`,
  devtools: { enabled: true },
  modules: [`@element-plus/nuxt`, `@vueuse/nuxt`, `@pinia/nuxt`, `@pinia-plugin-persistedstate/nuxt`],
  elementPlus: {
    components: [],
    icon: `ElIcon`,
    // importStyle: `scss`,
    themes: [`dark`],
  },
  pinia: {
    autoImports: [`defineStore`]
  },
  runtimeConfig: {
    server: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || `/api`,
    },
    db: {
      dbHost: process.env.DB_HOST,
      dbPort: process.env.DB_PORT,
      dbUser: process.env.DB_USER,
      dbPassword: process.env.DB_PASSWORD,
      dbName: process.env.DB_NAME,
    },
  },
});
