<template>
  <div class="person-page">
    <el-card>
      <el-form
        :model="formState"
        ref="formRef"
        inline
        label-width="100px"
        class="search-form"
      >
        <!-- 分类多选下拉菜单 -->
        <el-form-item label="分类" prop="classifyIds">
          <el-select
            v-model="formState.classifyIds"
            multiple
            placeholder="请选择分类"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="classify in classifies"
              :key="classify.id"
              :label="classify.name"
              :value="classify.id"
            />
          </el-select>
        </el-form-item>

        <!-- 其他表单字段 -->
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="formState.name"
            placeholder="请输入姓名"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="classifies" label="所属分类" width="200">
          <template #default="scope">
            {{ scope.row.classifies.map((c: Classify) => c.name).join(", ") }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件（仅数据存在时显示） -->
      <div class="pagination" v-if="tableData.length > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.current"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElForm, ElMessage } from "element-plus";
// 导入自定义类型
import type { Res, ListData, PageParams } from "~/types";

// 核心类型定义
interface Classify {
  id: number;
  name: string;
}

interface Person {
  id: number;
  name: string;
  age?: number;
  email?: string;
  classifies: Classify[]; // 关联的分类信息
}

// 表单状态类型（继承分页参数，便于扩展）
interface SearchForm extends PageParams {
  classifyIds?: number[]; // 选中的分类ID数组（多选）
  name?: string; // 其他搜索字段
}

// 表单相关
const formRef = ref<InstanceType<typeof ElForm>>();
const formState: SearchForm = reactive({
  classifyIds: [],
  name: "",
  current: 1, // 分页参数：当前页
  pageSize: 10, // 分页参数：每页条数
});

// 分类数据
const classifies = ref<Classify[]>([]);

// 表格数据
const tableData = ref<Person[]>([]);

// 加载状态
const loading = ref(false);

// 分页状态（与接口返回的pagination对齐）
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

// 获取分类列表（从classify表）
const fetchClassifies = async () => {
  try {
    // 明确响应类型：Res<Classify[]>（data是分类数组）
    const response: Res<Classify[]> = await $fetch("/api/classify", {
      method: "GET",
    });

    // 根据后端约定的成功状态码判断（通常是200或0）
    if (response.code === 200) {
      classifies.value = response.data || [];
    } else {
      ElMessage.error(response.message || "获取分类失败");
    }
  } catch (error) {
    console.error("获取分类异常:", error);
    ElMessage.error("获取分类失败，请重试");
  }
};

// 获取人员列表（从person表，带搜索和分页）
const fetchPersons = async () => {
  try {
    loading.value = true;

    // 构建查询参数（符合PageParams规范）
    const params: PageParams = {
      ...formState,
      current: pagination.current,
      pageSize: pagination.pageSize,
    };

    // 明确响应类型：Res<ListData<Person>>（data是带分页的列表数据）
    const response: Res<ListData<Person>> = await $fetch("/api/persons", {
      method: "GET",
      params,
    });

    if (response.code === 200) {
      // 从ListData中提取列表和总数
      tableData.value = response.data?.list || [];
      pagination.total = response.data?.total || 0;

      // 如果后端返回了pagination，同步到本地（可选）
      if (response.pagination) {
        pagination.current = response.pagination.current;
        pagination.pageSize = response.pagination.pageSize;
      }
    } else {
      ElMessage.error(response.message || "获取人员数据失败");
    }
  } catch (error) {
    console.error("获取人员异常:", error);
    ElMessage.error("获取人员数据失败，请重试");
  } finally {
    loading.value = false;
  }
};

// 搜索处理
const handleSearch = async () => {
  pagination.current = 1; // 搜索时重置到第一页
  await fetchPersons();
};

// 重置处理
const handleReset = () => {
  formRef.value?.resetFields();
  // 重置分页和表格数据
  pagination.current = 1;
  pagination.total = 0;
  tableData.value = [];
};

// 分页大小变化
const handleSizeChange = async (size: number) => {
  pagination.pageSize = size;
  pagination.current = 1; // 切换页大小时重置到第一页
  await fetchPersons();
};

// 页码变化
const handleCurrentChange = async (page: number) => {
  pagination.current = page;
  await fetchPersons();
};

// 页面初始化时加载分类数据
onMounted(async () => {
  await fetchClassifies();
});
</script>

<style scoped>
.search-form {
  margin-bottom: 10px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>
