<script setup lang="ts">
import { useFetch } from "nuxt/app";
import { Person } from "../../types/person";
const { data: personnelData, pending, error } = await useFetch<Person[]>("/api/personnel");
console.log(personnelData.value)
</script>

<template>
  <div>
    <h1>重点人员列表</h1>
    <div v-if="pending">加载中...</div>
    <div v-else-if="error">加载失败：{{ error.message }}</div>
    <ul v-else>
      <li v-for="person in personnelData" :key="person.id">
        <p>姓名：{{ person.name }}</p>
        <p>证件编号：{{ person.id_number }}</p>
        <!-- 显示其他字段 -->
      </li>
    </ul>
  </div>
</template>
