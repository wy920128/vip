import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: `2025-07-15`,
  css: [`~/assets/styles/global.css`],
  devtools: { enabled: true },
  modules: [`@element-plus/nuxt`, `@vueuse/nuxt`],
  elementPlus: {
    components: [],
    icon: `ElIcon`,
    // importStyle: `scss`,
    themes: [`dark`],
  },
  nitro: {
    experimental: {
      database: true,
    },
    database: {
      default: {
        connector: `sqlite`,
        options: {
          name: `vip`,
        },
      },
    },
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
