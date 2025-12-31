<template>
  <div class="layout-default">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/person">重点人员</el-menu-item>
      <el-menu-item index="/management">平台管理</el-menu-item>
    </el-menu>
    <NuxtPage />
  </div>
</template>
<script lang="ts" setup></script>
<style>
html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
.layout-default {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-direction: column;
  .el-menu {
    margin-bottom: 20px;
  }
}
</style>
