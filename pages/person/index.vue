<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { ElForm, ElMessage } from "element-plus";
import type { Res } from "~/types";
import { Refresh, Search } from "@element-plus/icons-vue";
import type { IClassify, VClassify } from "~/types/classify";
import type { IPerson, VPerson } from "~/types/person";
// 表单相关
const formData = reactive({
  data: {
    classifyIds: [],
    name: ``,
    id_number: ``,
  },
  classifies: [] as VClassify[],
  fnc_init: async () => {
    try {
      const response: Res<IClassify[]> = await $fetch(`/api/classify/get`, {
        method: `GET`,
      });
      if (response.code === 200) {
        formData.classifies = [...(response.data?.list || [])];
        console.log(`分类数据加载成功:`, formData.classifies.length);
      } else {
        ElMessage.error(response.message || `获取分类失败`);
      }
    } catch (error) {
      console.error(`获取分类异常:`, error);
      ElMessage.error(`获取分类失败，请重试`);
    }
  },
  btn_search: async () => {
    try {
      tableData.loading = true;
      const params = {
        classifyIds: formData.data.classifyIds.join(`,`),
        id_number: formData.data.id_number,
        name: formData.data.name,
        page: paginationData.current,
        pageSize: paginationData.pageSize,
      };
      const response: Res<IPerson[]> = await $fetch(`/api/person/get`, {
        method: `GET`,
        params,
      });
      if (response.code === 200) {
        paginationData.current = response.data?.pagination?.page || 1;
        paginationData.pageSize = response.data?.pagination?.pageSize || 10;
        paginationData.total = response.data?.pagination?.total || 0;
        tableData.list = response.data?.list.map((row) => ({
          ...row,
          classify: row.classify
            ? (() => {
                try {
                  return JSON.parse(row.classify);
                } catch (e) {
                  return [];
                }
              })()
            : [],
        }));
        console.log(
          `数据加载成功，当前页: ${paginationData.current}, 总数: ${paginationData.total}`
        );
      } else {
        ElMessage.error(response.message || `获取人员数据失败`);
      }
    } catch (error) {
      console.error(`获取人员数据异常:`, error);
      ElMessage.error(`获取人员数据失败，请重试`);
    } finally {
      tableData.loading = false;
    }
  },
  btn_reset: () => {
    formData.data.classifyIds = [];
    formData.data.name = ``;
    formData.data.id_number = ``;
    paginationData.current = 1;
  },
});
// 表格数据
const tableData = reactive({
  list: [] as VPerson[],
  loading: false,
  fnc_init: async () => {
    tableData.list.length = 0;
    tableData.loading = false;
  },
});
// 分页状态（与接口返回的pagination对齐）
const paginationData = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  func_currentChange: async () => {
    await formData.btn_search();
  },
  func_sizeChange: async () => {
    await formData.btn_search();
  },
});
const init = async () => {
  await formData.fnc_init();
  await tableData.fnc_init();
};
onMounted(async () => {
  await init();
});
</script>

<template>
  <div class="page-person">
    <div class="search-section">
      <el-form
        :inline="true"
        :model="formData.data"
        label-position="right"
        label-suffix=":"
        label-width="auto"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="分类" prop="classifyIds">
              <el-select
                v-model="formData.data.classifyIds"
                multiple
                placeholder="请选择分类"
                clearable
              >
                <el-option
                  v-for="classify in formData.classifies"
                  :key="classify.id"
                  :label="classify.name"
                  :value="classify.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="formData.data.name"
                placeholder="请输入姓名"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证号" prop="id_number">
              <el-input
                v-model="formData.data.id_number"
                placeholder="请输入身份证号码"
                clearable
                maxlength="18"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button-group>
                <el-button
                  type="primary"
                  round
                  @click="formData.btn_search"
                  :icon="Search"
                >
                  搜索
                </el-button>
                <el-button
                  type="info"
                  round
                  @click="formData.btn_reset"
                  :icon="Refresh"
                >
                  重置
                </el-button></el-button-group
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-section">
      <el-table
        :border="true"
        :data="tableData.list"
        empty-text="暂无数据"
        style="width: 100%"
        v-loading="tableData.loading"
      >
        <el-table-column align="center" prop="id" label="ID" width="80" />
        <el-table-column
          align="center"
          prop="name"
          label="姓名"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          prop="gender"
          label="性别"
          width="120"
        />
        <el-table-column
          align="center"
          label="证件信息"
          min-width="350"
          show-overflow-tooltip
        >
          <template #default="scope">
            <div v-if="scope.row.credentials && scope.row.credentials.length">
              <div
                v-for="(item, idx) in scope.row.credentials"
                :key="idx"
                style="margin: 2px 0"
              >
                <el-tag size="small" type="primary" style="margin-right: 8px">
                  {{ item.type || "未知类型" }}
                </el-tag>
                <span>{{ item.number || "-" }}</span>
              </div>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属分类" min-width="200">
          <template #default="scope">
            {{
              scope.row.classify
                ?.map((classify: VClassify) => classify.name)
                .join(", ") || "-"
            }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="classifies"
          label="操作"
          width="200"
        >
          <template #default="scope">
            <el-button
              size="small"
              @click="handleDetail(scope.$index, scope.row)"
            >
              查看
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleEdit(scope.$index, scope.row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-section">
      <el-pagination
        size="large"
        :background="true"
        v-model:page-size="paginationData.pageSize"
        :default-page-size="1"
        :total="paginationData.total"
        :pager-count="7"
        v-model:current-page="paginationData.current"
        :default-current-page="1"
        layout="sizes, prev, pager, next, jumper, total, slot"
        :page-sizes="[1, 20, 50, 100]"
        prev-text="上一页"
        prev-icon="el-icon-arrow-left"
        next-text="下一页"
        next-icon="el-icon-arrow-right"
        :hide-on-single-page="false"
        @size-change="paginationData.func_sizeChange"
        @current-change="paginationData.func_currentChange"
      />
    </div>
  </div>
</template>

<style>
.page-person {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  padding: 20px;
  box-sizing: border-box;
  gap: 20px;
  min-height: 0;

  .search-section {
    flex: 0 0 auto;
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .table-section {
    flex: 1;
    background: white;
    border-radius: 8px;
    padding: 20px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .table-section :deep(.el-table) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .table-section :deep(.el-table__body-wrapper) {
    flex: 1;
    overflow: auto;
  }

  .pagination-section {
    flex: 0 0 auto;
    background: white;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}
</style>
