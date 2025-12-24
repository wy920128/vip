<!--
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-12-24 08:06:59
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-12-24 08:57:53
 * @FilePath: /vip/app/app.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <!-- 可在此处放置全局导航栏 -->
    <nav style="padding: 1rem; border-bottom: 1px solid #eee;">
      <NuxtLink to="/">首页</NuxtLink> | 
      <NuxtLink to="/personnel">重点人员管理</NuxtLink>
    </nav>
    
    <!-- 页面内容将在此渲染 -->
    <NuxtPage />
  </div>
</template>