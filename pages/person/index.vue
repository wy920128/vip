<script setup lang="ts">
import { reactive, onMounted } from "vue";
import type { PersonVO, Res } from "~/types";
import { message } from "ant-design-vue";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons-vue";
import { h } from "vue";

// 使用全局工具函数和分类数据
const { safeJsonParse } = useUtils();
const { getClassifyList, classifyList } = useClassify();

// 用户权限状态
const authState = reactive({
  currentRole: "liekong",
  hasLieKongPermission: true,
});

// 搜索表单数据与方法
const searchForm = reactive({
  data: {
    classifyIds: [] as number[],
    name: ``,
    id_number: ``,
  },
  // 直接使用全局分类列表
  classifies: classifyList,
  loading: false,

  // 初始化分类数据
  fnc_init: async () => {
    try {
      await getClassifyList();
      console.log(`分类数据加载成功:`, classifyList.value.length);
    } catch (error) {
      console.error(`获取分类异常:`, error);
      message.error(`获取分类失败，请重试`);
    }
  },

  // 搜索方法
  btn_search: async () => {
    try {
      tableData.loading = true;
      const params = {
        classifyIds: searchForm.data.classifyIds.join(`,`),
        id_number: searchForm.data.id_number,
        name: searchForm.data.name,
        page: paginationData.current,
        pageSize: paginationData.pageSize,
      };

      const response: Res<PersonVO[]> = await $fetch(`/api/person/get`, {
        method: `GET`,
        params,
      });

      if (response.code === 200) {
        paginationData.current = response.data?.pagination?.page || 1;
        paginationData.pageSize = response.data?.pagination?.pageSize || 10;
        paginationData.total = response.data?.pagination?.total || 0;

        // 使用安全JSON解析工具处理分类数据
        tableData.list =
          response.data?.list.map((row) => ({
            ...row,
            classify: row.classify
              ? safeJsonParse(
                  typeof row.classify === `string` ? row.classify : `[]`,
                  []
                )
              : [],
          })) || [];

        console.log(
          `数据加载成功，当前页: ${paginationData.current}, 总数: ${paginationData.total}`
        );
      } else {
        message.error(response.message || `获取人员数据失败`);
      }
    } catch (error) {
      console.error(`获取人员数据异常:`, error);
      message.error(`获取人员数据失败，请重试`);
    } finally {
      tableData.loading = false;
    }
  },

  // 重置搜索条件
  btn_reset: () => {
    searchForm.data.classifyIds = [];
    searchForm.data.name = ``;
    searchForm.data.id_number = ``;
    paginationData.current = 1;
    searchForm.btn_search();
  },
});

// 表格数据
const tableData = reactive({
  columns: [
    {
      dataIndex: "id",
      title: "ID",
      width: 80,
    },
  ],
  list: [] as PersonVO[],
  loading: false,
});

// 分页数据
const paginationData = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  func_currentChange: async (page: number) => {
    paginationData.current = page;
    await searchForm.btn_search();
  },
  func_sizeChange: async (size: number) => {
    paginationData.pageSize = size;
    paginationData.current = 1;
    await searchForm.btn_search();
  },
});

// 路由导航
const router = useRouter();

// 导航方法
const goToCreate = () => {
  router.push("/person/create");
};

const goToDetail = (id: number) => {
  router.push(`/person/${id}`);
};

const goToEdit = (id: number) => {
  router.push(`/person/${id}/edit`);
};

// 初始化函数
const init = async () => {
  await searchForm.fnc_init(); // 初始化分类数据
  await searchForm.btn_search(); // 初始加载人员数据
};

onMounted(async () => {
  await init();
});
</script>

<template>
  <div class="person-list-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-header">
        <div class="search-conditions">
          <a-form :model="searchForm.data" layout="inline" class="search-form">
            <a-form-item label="分类">
              <a-select
                v-model:value="searchForm.data.classifyIds"
                mode="multiple"
                placeholder="请选择分类"
                allow-clear
                style="width: 100%"
              >
                <a-select-option
                  v-for="classify in searchForm.classifies"
                  :key="classify.id"
                  :label="classify.name"
                  :value="classify.id"
                />
              </a-select>
            </a-form-item>
            <a-form-item label="姓名">
              <a-input
                v-model:value="searchForm.data.name"
                placeholder="请输入姓名"
                allow-clear
                style="width: 100%"
              />
            </a-form-item>
            <a-form-item label="身份证号">
              <a-input
                v-model:value="searchForm.data.id_number"
                placeholder="请输入身份证号码"
                allow-clear
                :max-length="18"
                show-count
                style="width: 100%"
              />
            </a-form-item>
            <a-form-item class="action-buttons">
              <a-button
                type="primary"
                :icon="h(SearchOutlined)"
                @click="searchForm.btn_search"
                :loading="tableData.loading"
              >
                搜索
              </a-button>
              <a-button :icon="h(ReloadOutlined)" @click="searchForm.btn_reset">
                重置
              </a-button>
              <a-button
                v-if="authState.hasLieKongPermission"
                type="success"
                @click="goToCreate"
              >
                新增人员
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <a-table
        :data-source="tableData.list"
        :loading="tableData.loading"
        bordered
        stripe
        style="width: 100%"
        :locale="{ emptyText: '暂无数据' }"
        :columns="tableData.columns"
        :pagination="false"
        row-key="id"
      />
    </div>

    <!-- 分页区域 -->
    <div class="pagination-section" v-if="paginationData.total > 0">
      <a-pagination
        v-model:current="paginationData.current"
        v-model:page-size="paginationData.pageSize"
        :total="paginationData.total"
        :page-size-options="[10, 20, 50, 100]"
        show-size-changer
        show-quick-jumper
        show-total="(total) => `共 ${total} 条记录`"
        @show-size-change="paginationData.func_sizeChange"
        @change="paginationData.func_currentChange"
      />
    </div>

    <!-- 空状态提示 -->
    <div
      v-if="!tableData.loading && tableData.list.length === 0"
      class="empty-tip"
    >
      <a-empty description="暂无重点人员数据" />
    </div>
  </div>
</template>

<style scoped>
/* 原有样式完全保留，无需修改 */
.person-list-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.search-section {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.search-conditions {
  width: 100%;
}

.search-form {
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.table-section {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.pagination-section {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.classify-tag {
  margin: 2px;
}

.time-text {
  color: #666;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .person-list-container {
    padding: 12px;
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons .a-button {
    margin-bottom: 8px;
    width: 100%;
  }
}
</style>

<style scoped>
.person-list-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.search-section {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.search-conditions {
  width: 100%;
}

.search-form {
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.table-section {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.pagination-section {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.classify-tag {
  margin: 2px;
}

.time-text {
  color: #666;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .person-list-container {
    padding: 12px;
  }

  .action-buttons {
    align-items: stretch;
    flex-direction: column;
    margin-bottom: 8px;
    width: 100%;
  }
}
</style>
