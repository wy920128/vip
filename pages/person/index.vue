<script setup lang="ts">
import { useFetch } from "nuxt/app";
import { ref } from "vue";
import type { Person } from "../../types/person";
import type { ApiResponse } from "../../types";

// 分类选项数据（实际项目中可从API获取）
const categoryOptions = [
  { label: "重点关注", value: "focus" },
  { label: "一般关注", value: "normal" },
  { label: "低风险", value: "low_risk" },
  { label: "高风险", value: "high_risk" },
];

// 表单搜索数据
const formData = ref({
  categories: [] as string[], // 多选分类
  name: "", // 姓名
  idNumber: "", // 身份证号
});

// 分页相关参数
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

// 获取人员数据（带分页和筛选参数）
const fetchPersonData = async () => {
  const { data, pending, error, refresh } = await useFetch<
    ApiResponse<Person[]>
  >("/api/person", {
    params: {
      page: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
      categories: formData.value.categories.join(","),
      name: formData.value.name,
      idNumber: formData.value.idNumber,
    },
  });

  // 假设API返回格式包含total字段
  if (data.value?.data.length !== undefined) {
    pagination.value.total = data.value.data.length;
  }

  return { data, pending, error, refresh };
};

// 初始加载数据
const { data: personData, pending, error, refresh } = await fetchPersonData();

// 搜索按钮事件
const handleSearch = async () => {
  pagination.value.currentPage = 1; // 重置到第一页
  await refresh();
};

// 重置按钮事件
const handleReset = async () => {
  formData.value = {
    categories: [],
    name: "",
    idNumber: "",
  };
  pagination.value.currentPage = 1;
  await refresh();
};

// 分页变更事件
const handlePageChange = async (page: number, pageSize: number) => {
  pagination.value.currentPage = page;
  pagination.value.pageSize = pageSize;
  await refresh();
};
</script>

<template>
  <div class="person-list-container">
    <h1>重点人员列表</h1>

    <!-- 加载状态 -->
    <el-loading v-if="pending" fullscreen text="数据加载中..."></el-loading>

    <!-- 错误提示 -->
    <el-alert
      v-else-if="error"
      type="error"
      title="加载失败"
      :description="error.message || '请稍后重试'"
      show-icon
      style="margin-bottom: 16px"
    ></el-alert>

    <el-card v-else>
      <!-- 搜索表单 -->
      <el-form
        :model="formData"
        inline
        label-width="80px"
        style="margin-bottom: 16px"
      >
        <el-form-item label="人员分类">
          <el-select
            v-model="formData.categories"
            multiple
            placeholder="请选择分类"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="option in categoryOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="姓名">
          <el-input
            v-model="formData.name"
            placeholder="请输入姓名"
            clearable
            style="width: 180px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item label="身份证号">
          <el-input
            v-model="formData.idNumber"
            placeholder="请输入身份证号"
            clearable
            style="width: 220px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <el-table
        v-if="personData?.data && personData.data.length > 0"
        :data="personData.data"
        border
        stripe
        style="width: 100%; margin-bottom: 16px"
        :header-cell-style="{ background: '#f5f7fa' }"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="gender" label="性别" width="80" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.gender === '男' ? 'primary' : 'success'">
              {{ scope.row.gender }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="id_number" label="证件编号" />
        <el-table-column prop="created_time" label="创建时间" width="180">
          <template #default="scope">
            {{ new Date(scope.row.created_time).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-button size="small" type="text"> 查看 </el-button>
            <el-button size="small" type="text"> 编辑 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <el-empty
        v-else
        description="暂无符合条件的数据"
        style="margin: 40px 0"
      />

      <!-- 分页组件 -->
      <div class="pagination-container" v-if="pagination.total > 0">
        <el-pagination
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="(val) => handlePageChange(pagination.currentPage, val)"
          @current-change="(val) => handlePageChange(val, pagination.pageSize)"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.person-list-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  color: #1f2329;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
}

.pagination-container {
  text-align: right;
  margin-top: 16px;
}

/* 引入Element Plus图标 */
@import "element-plus/es/components/icon/style/css";
</style>
