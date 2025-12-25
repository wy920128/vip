/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-12-24 08:06:59
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-12-25 14:33:05
 * @FilePath: /vip/nuxt.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@element-plus/nuxt", "@vueuse/nuxt"],
  elementPlus: {
    components: [],
    icon: "ElIcon",
    // importStyle: "scss",
    themes: ["dark"],
  },
  runtimeConfig: {
    server: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "/api",
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
