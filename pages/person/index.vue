<template>
  <div class="person-container">
    <el-form :model="searchForm" class="search-form" inline>
      <el-form-item label="姓名">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入姓名"
          clearable
          @keyup.enter="handleSearch"
        ></el-input>
      </el-form-item>
      <el-form-item label="证件编号">
        <el-input
          v-model="searchForm.id_number"
          placeholder="请输入证件编号"
          clearable
          @keyup.enter="handleSearch"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch" :loading="loading">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="personList"
      border
      style="width: 100%; margin-top: 20px"
      v-loading="loading"
      empty-text="暂无数据"
    >
      <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="gender" label="性别" width="80" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.gender === '男' ? 'primary' : 'danger'" size="small">
            {{ scope.row.gender || "-" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="id_number" label="证件编号" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.id_number || "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="created_time" label="创建时间" width="160">
        <template #default="scope">
          {{ formatTime(scope.row.created_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="updated_time" label="更新时间" width="160">
        <template #default="scope">
          {{ formatTime(scope.row.updated_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination-container" v-if="pagination.total > 0">
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Res } from '~/types';
import type { Person } from '~/types/person';
import { Search } from '@element-plus/icons-vue';
import { useDebounceFn } from '@vueuse/core';

// 响应式数据
const loading = ref(false);
const personList = ref<Person[]>([]);
const searchForm = ref({
  name: '',
  id_number: ''
});

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
});

// 时间格式化函数
const formatTime = (time: string | null) => {
  if (!time) return '-';
  return new Date(time).toLocaleString('zh-CN');
};

// 获取人员列表数据
const getPersonList = async (params: any = {}) => {
  loading.value = true;
  
  try {
    // 使用 useFetch 并指定返回类型为 Res<Person[]>
    const { data, error } = await useFetch<Res<Person[]>>('/api/person/get', {
      method: 'GET',
      query: {
        ...params,
        page: pagination.current,
        pageSize: pagination.pageSize
      },
      key: `person-list-${pagination.current}-${pagination.pageSize}-${JSON.stringify(params)}`,
      server: true,
      // 响应拦截 - 基于 Res 接口进行类型安全处理
      onResponse({ response }) {
        const responseData = response._data as Res<Person[]>;
        
        // 业务状态码检查
        if (responseData.code !== 200 && responseData.code !== 0) {
          throw new Error(responseData.message || '获取人员列表失败');
        }
        
        // 如果有分页信息，更新分页状态
        if (responseData.pagination) {
          pagination.total = responseData.pagination.total;
          pagination.current = responseData.pagination.current;
          pagination.pageSize = responseData.pagination.pageSize;
        }
      }
    });

    // 错误处理
    if (error.value) {
      throw new Error(error.value.message || '请求失败');
    }

    // 类型安全的数据赋值
    if (data.value) {
      personList.value = data.value.data || [];
      
      // 只有在有数据时才显示成功消息
      if (personList.value.length > 0) {
        ElMessage.success(data.value.message || '获取人员列表成功');
      }
    }

  } catch (error: any) {
    console.error('获取人员列表失败:', error);
    ElMessage.error(`获取失败：${error.message || '未知错误'}`);
    personList.value = [];
    pagination.total = 0;
  } finally {
    loading.value = false;
  }
};
// 搜索处理 - 添加防抖优化
const handleSearch = useDebounceFn(() => {
  pagination.current = 1; // 搜索时重置到第一页
  const params = Object.fromEntries(
    Object.entries(searchForm.value).filter(([_, value]) => 
      value !== '' && value !== undefined && value !== null
    )
  );
  getPersonList(params);
}, 300);
// 重置处理
const handleReset = () => {
  searchForm.value = {
    name: '',
    id_number: ''
  };
  pagination.current = 1;
  getPersonList();
};
// 分页处理
const handleSizeChange = (newSize: number) => {
  pagination.pageSize = newSize;
  pagination.current = 1;
  getPersonList(searchForm.value);
};
const handleCurrentChange = (newPage: number) => {
  pagination.current = newPage;
  getPersonList(searchForm.value);
};

// 操作处理
const handleEdit = (row: Person) => {
  ElMessage.info(`编辑用户: ${row.name}`);
  // 这里可以跳转到编辑页面或打开编辑对话框
};

const handleDelete = async (row: Person) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    // 调用删除API
    const { data } = await useFetch<Res<void>>(`/api/person/delete/${row.id}`, {
      method: 'DELETE'
    });
    
    if (data.value?.code === 200 || data.value?.code === 0) {
      ElMessage.success('删除成功');
      // 重新加载数据
      getPersonList(searchForm.value);
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

// 生命周期
onMounted(() => {
  getPersonList();
});

// 监听路由参数变化（如果需要）
// const route = useRoute();
// watch(() => route.query, (newQuery) => {
//   // 根据路由参数更新搜索条件
// }, { immediate: true });
</script>

<style scoped>
.person-container {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-form {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table .cell) {
  word-break: keep-all;
}

:deep(.el-table .el-tag) {
  margin: 2px 0;
}
</style>