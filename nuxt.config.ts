/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-12-24 08:06:59
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2026-01-15 08:39:47
 * @FilePath: /vip/nuxt.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: [`ant-design-vue`],
  },
  compatibilityDate: `2025-07-15`,
  css: [`~/assets/styles/global.css`, `ant-design-vue/dist/reset.css`],
  devtools: { enabled: true },
  modules: [
    `@vueuse/nuxt`,
    (options, nuxt) => {
      import(`unplugin-vue-components/vite`).then(({ default: Components }) => {
        nuxt.hooks.hook(`vite:extendConfig`, (config) => {
          config.plugins?.push(
            Components({
              resolvers: [
                // 自动识别A开头组件（如AButton → ant-design-vue/Button）
                (componentName) => {
                  if (componentName.startsWith(`A`)) {
                    return {
                      name: componentName.slice(1),
                      from: `ant-design-vue`,
                    };
                  }
                },
              ],
            })
          );
        });
      });
    },
  ],
  runtimeConfig: {
    server: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || `/api`,
    },
    // db: {
    //   dbHost: process.env.DB_HOST,
    //   dbPort: process.env.DB_PORT,
    //   dbUser: process.env.DB_USER,
    //   dbPassword: process.env.DB_PASSWORD,
    //   dbName: process.env.DB_NAME,
    // },
    db_aliyun: {
      dbHost: process.env.DB_ALY_HOST,
      dbPort: process.env.DB_ALY_PORT,
      dbUser: process.env.DB_ALY_USER,
      dbPassword: process.env.DB_ALY_PASSWORD,
      dbName: process.env.DB_ALY_NAME,
    },
  },
});
