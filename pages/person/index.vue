<script setup lang="ts">
import { reactive, onMounted } from "vue"
import { ElMessage } from "element-plus"
import { Search, Refresh } from "@element-plus/icons-vue"
import type { Res } from "~/types"
import type { IPerson, VPerson } from "~/types/person"
import type { VClassify } from "~/types/classify"

// 使用全局工具函数和分类数据
const { formatTime, safeJsonParse } = useUtils()
const { getClassifyList, classifyList } = useClassify()

// 用户权限状态
const authState = reactive({
  currentRole: 'liekong', // 实际项目中从全局状态获取
  hasLieKongPermission: true
})

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
      await getClassifyList()
      console.log(`分类数据加载成功:`, classifyList.value.length)
    } catch (error) {
      console.error(`获取分类异常:`, error)
      ElMessage.error(`获取分类失败，请重试`)
    }
  },
  
  // 搜索方法
  btn_search: async () => {
    try {
      tableData.loading = true
      const params = {
        classifyIds: searchForm.data.classifyIds.join(`,`),
        id_number: searchForm.data.id_number,
        name: searchForm.data.name,
        page: paginationData.current,
        pageSize: paginationData.pageSize,
      }
      
      const response: Res<IPerson[]> = await $fetch(`/api/person/get`, {
        method: `GET`,
        params,
      })
      
      if (response.code === 200) {
        paginationData.current = response.data?.pagination?.page || 1
        paginationData.pageSize = response.data?.pagination?.pageSize || 10
        paginationData.total = response.data?.pagination?.total || 0
        
        // 使用安全JSON解析工具处理分类数据
        tableData.list = response.data?.list.map((row) => ({
          ...row,
          classify: row.classify ? safeJsonParse(row.classify, []) : [],
        })) || []
        
        console.log(`数据加载成功，当前页: ${paginationData.current}, 总数: ${paginationData.total}`)
      } else {
        ElMessage.error(response.message || `获取人员数据失败`)
      }
    } catch (error) {
      console.error(`获取人员数据异常:`, error)
      ElMessage.error(`获取人员数据失败，请重试`)
    } finally {
      tableData.loading = false
    }
  },
  
  // 重置搜索条件
  btn_reset: () => {
    searchForm.data.classifyIds = []
    searchForm.data.name = ``
    searchForm.data.id_number = ``
    paginationData.current = 1
    searchForm.btn_search()
  }
})

// 表格数据
const tableData = reactive({
  list: [] as VPerson[],
  loading: false
})

// 分页数据
const paginationData = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  func_currentChange: async (page: number) => {
    paginationData.current = page
    await searchForm.btn_search()
  },
  func_sizeChange: async (size: number) => {
    paginationData.pageSize = size
    paginationData.current = 1
    await searchForm.btn_search()
  }
})

// 路由导航
const router = useRouter()

// 导航方法
const goToCreate = () => {
  router.push('/person/create')
}

const goToDetail = (id: number) => {
  router.push(`/person/${id}`)
}

const goToEdit = (id: number) => {
  router.push(`/person/${id}/edit`)
}

// 初始化函数
const init = async () => {
  await searchForm.fnc_init() // 初始化分类数据
  await searchForm.btn_search() // 初始加载人员数据
}

onMounted(async () => {
  await init()
})
</script>

<template>
  <div class="person-list-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-header">
        <div class="search-conditions">
          <el-form :inline="true" :model="searchForm.data" class="search-form">
            <el-row :gutter="16" style="width: 100%">
              <!-- 分类筛选 -->
              <el-col :xs="24" :sm="12" :md="8" :lg="6">
                <el-form-item label="分类">
                  <el-select
                    v-model="searchForm.data.classifyIds"
                    multiple
                    placeholder="请选择分类"
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="classify in searchForm.classifies"
                      :key="classify.id"
                      :label="classify.name"
                      :value="classify.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              
              <!-- 姓名搜索 -->
              <el-col :xs="24" :sm="12" :md="8" :lg="6">
                <el-form-item label="姓名">
                  <el-input
                    v-model="searchForm.data.name"
                    placeholder="请输入姓名"
                    clearable
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              
              <!-- 身份证号搜索 -->
              <el-col :xs="24" :sm="12" :md="8" :lg="6">
                <el-form-item label="身份证号">
                  <el-input
                    v-model="searchForm.data.id_number"
                    placeholder="请输入身份证号码"
                    clearable
                    maxlength="18"
                    show-word-limit
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              
              <!-- 操作按钮 -->
              <el-col :xs="24" :sm="24" :md="24" :lg="6">
                <el-form-item class="action-buttons">
                  <el-button 
                    type="primary" 
                    :icon="Search"
                    @click="searchForm.btn_search"
                    :loading="tableData.loading"
                  >
                    搜索
                  </el-button>
                  <el-button 
                    :icon="Refresh"
                    @click="searchForm.btn_reset"
                  >
                    重置
                  </el-button>
                  <el-button 
                    v-if="authState.hasLieKongPermission"
                    type="success"
                    @click="goToCreate"
                  >
                    新增人员
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <el-table 
        :data="tableData.list" 
        v-loading="tableData.loading"
        border
        stripe
        style="width: 100%"
        empty-text="暂无数据"
      >
        <el-table-column 
          prop="id" 
          label="ID" 
          width="80" 
          align="center"
        />
        <el-table-column 
          prop="name" 
          label="姓名" 
          width="120" 
          align="center"
          show-overflow-tooltip
        />
        <el-table-column 
          prop="gender" 
          label="性别" 
          width="80" 
          align="center"
        >
          <template #default="scope">
            {{ scope.row.gender || '未填写' }}
          </template>
        </el-table-column>
        <el-table-column 
          prop="id_number" 
          label="身份证号" 
          width="180" 
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ scope.row.id_number || '未填写' }}
          </template>
        </el-table-column>
        <el-table-column 
          label="关联分类" 
          min-width="200" 
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            <div v-if="scope.row.classify && scope.row.classify.length">
              <el-tag
                v-for="classifyItem in scope.row.classify"
                :key="classifyItem.id"
                size="small"
                class="classify-tag"
              >
                {{ classifyItem.name }}
              </el-tag>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column 
          prop="created_time" 
          label="创建时间" 
          width="180" 
          align="center"
        >
          <template #default="scope">
            <span class="time-text">
              {{ formatTime(scope.row.created_time) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column 
          prop="updated_time" 
          label="更新时间" 
          width="180" 
          align="center"
        >
          <template #default="scope">
            <span class="time-text">
              {{ formatTime(scope.row.updated_time) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column 
          label="操作" 
          width="200" 
          align="center" 
          fixed="right"
        >
          <template #default="scope">
            <div class="action-buttons">
              <el-button 
                type="primary" 
                link
                size="small"
                @click="goToDetail(scope.row.id)"
              >
                查看
              </el-button>
              <el-button 
                v-if="authState.hasLieKongPermission"
                type="warning" 
                link
                size="small"
                @click="goToEdit(scope.row.id)"
              >
                编辑
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页区域 -->
    <div class="pagination-section" v-if="paginationData.total > 0">
      <el-pagination
        v-model:current-page="paginationData.current"
        v-model:page-size="paginationData.pageSize"
        :total="paginationData.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="paginationData.func_sizeChange"
        @current-change="paginationData.func_currentChange"
      />
    </div>

    <!-- 空状态提示 -->
    <div v-if="!tableData.loading && tableData.list.length === 0" class="empty-tip">
      <el-empty description="暂无重点人员数据" />
    </div>
  </div>
</template>

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
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-buttons .el-button {
    margin-bottom: 8px;
    width: 100%;
  }
}
</style>