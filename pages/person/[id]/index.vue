<!--
 * @Author: 王野 18545455617@163.com
 * @Date: 2026-01-09 08:48:44
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2026-01-09 14:54:06
 * @FilePath: /vip/pages/person/[id]/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="person-detail-page">
    <!-- 页面头部操作栏 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="goBack" icon="ArrowLeft" class="back-btn">
          返回列表
        </el-button>
        <h1 class="page-title">人员详情</h1>
      </div>
      <div class="header-actions">
        <el-button @click="handlePrint" icon="Printer" type="info">
          打印简历
        </el-button>
        <el-button @click="handleEdit" icon="Edit" type="warning">
          编辑信息
        </el-button>
        <el-button @click="handleExport" icon="Download" type="primary">
          导出PDF
        </el-button>
      </div>
    </div>
    <!-- 简历主体内容 -->
    <div class="resume-container" ref="resumeContent">
      <!-- 简历头部区域 -->
      <div class="resume-header">
        <div class="resume-title-section">
          <h1 class="resume-title">PERSONAL RESUME</h1>
          <div class="title-line"></div>
        </div>
        <div class="personal-header">
          <!-- 左侧基本信息 -->
          <div class="header-left">
            <h2 class="person-name">{{ personData.name || "未命名" }}</h2>
            <p class="job-intention">
              <span class="label">求职意向：</span>
              <span class="value">{{
                personData.jobIntention || "未填写"
              }}</span>
            </p>
            <div class="basic-info-grid">
              <div class="info-row">
                <div class="info-item">
                  <span class="info-label">民族：</span>
                  <span class="info-value">{{
                    personData.nation || "--"
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">政治面貌：</span>
                  <span class="info-value">{{
                    personData.politicalStatus || "--"
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">年龄：</span>
                  <span class="info-value">{{ personData.age || "--" }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">身高：</span>
                  <span class="info-value">{{
                    personData.height || "--"
                  }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="info-label">电话：</span>
                  <span class="info-value phone">{{
                    personData.phone || "--"
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">性别：</span>
                  <span class="info-value">{{
                    personData.gender || "--"
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">邮箱：</span>
                  <span class="info-value">{{ personData.email || "--" }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">学历：</span>
                  <span class="info-value">{{
                    personData.education || "--"
                  }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item full-width">
                  <span class="info-label">住址：</span>
                  <span class="info-value">{{
                    personData.address || "--"
                  }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item full-width">
                  <span class="info-label">毕业院校：</span>
                  <span class="info-value">{{
                    personData.school || "--"
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 右侧照片 -->
          <div class="header-right">
            <div class="photo-section">
              <el-carousel
                v-if="personData.photos && personData.photos.length > 0"
                :interval="4000"
                height="300px"
                indicator-position="outside"
                arrow="hover"
                :autoplay="false"
              >
                <el-carousel-item
                  v-for="(photo, index) in personData.photos"
                  :key="index"
                >
                  <el-image
                    :src="photo.url"
                    :preview-src-list="personData.photos.map((p) => p.url)"
                    style="width: 100%; height: 100%; border-radius: 4px"
                    fit="cover"
                  />
                </el-carousel-item>
              </el-carousel>
              <div v-else class="empty-photo">
                <el-icon :size="80" color="#c0c4cc">
                  <User />
                </el-icon>
                <p>暂无照片</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 证件信息区块 -->
      <div class="resume-section certificate-section">
        <div class="section-header">
          <h3 class="section-title">证件信息</h3>
          <div class="section-line"></div>
        </div>
        <div class="section-content">
          <el-row :gutter="30" class="certificate-grid">
            <el-col :span="8">
              <div class="certificate-item">
                <div class="cert-label">证件类型</div>
                <div class="cert-value">{{ personData.idType || "--" }}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="certificate-item">
                <div class="cert-label">证件编号</div>
                <div class="cert-value">{{ personData.idNumber || "--" }}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="certificate-item">
                <div class="cert-label">有效期</div>
                <div class="cert-value">{{ personData.idExpiry || "--" }}</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 联系方式区块 -->
      <div class="resume-section contact-section">
        <div class="section-header">
          <h3 class="section-title">联系方式</h3>
          <div class="section-line"></div>
        </div>
        <div class="section-content">
          <el-row :gutter="30" class="contact-grid">
            <el-col :span="6">
              <div class="contact-item">
                <el-icon class="contact-icon"><Iphone /></el-icon>
                <div class="contact-info">
                  <div class="contact-label">手机号码</div>
                  <div class="contact-value">
                    {{ personData.phone || "--" }}
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="contact-item">
                <el-icon class="contact-icon"><ChatDotSquare /></el-icon>
                <div class="contact-info">
                  <div class="contact-label">QQ</div>
                  <div class="contact-value">{{ personData.qq || "--" }}</div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="contact-item">
                <el-icon class="contact-icon"><ChatLineSquare /></el-icon>
                <div class="contact-info">
                  <div class="contact-label">微信</div>
                  <div class="contact-value">
                    {{ personData.wechat || "--" }}
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="contact-item">
                <el-icon class="contact-icon"><Wallet /></el-icon>
                <div class="contact-info">
                  <div class="contact-label">支付宝</div>
                  <div class="contact-value">
                    {{ personData.alipay || "--" }}
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 教育背景区块 -->
      <div
        class="resume-section education-section"
        v-if="personData.educationBackground"
      >
        <div class="section-header">
          <h3 class="section-title">教育背景</h3>
          <div class="section-line"></div>
        </div>
        <div class="section-content">
          <div
            class="timeline-item"
            v-for="(edu, index) in personData.educationBackground"
            :key="index"
          >
            <div class="timeline-period">{{ edu.period || "--" }}</div>
            <div class="timeline-content">
              <h4 class="timeline-title">{{ edu.school || "--" }}</h4>
              <p class="timeline-subtitle">{{ edu.major || "--" }}</p>
              <div class="timeline-details" v-if="edu.courses">
                <p class="detail-title">主修课程：</p>
                <p class="detail-content">{{ edu.courses }}</p>
              </div>
              <div class="timeline-details" v-if="edu.gpa">
                <p class="detail-title">专业成绩：</p>
                <p class="detail-content">{{ edu.gpa }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 工作经历区块 -->
      <div
        class="resume-section work-section"
        v-if="personData.workExperience && personData.workExperience.length > 0"
      >
        <div class="section-header">
          <h3 class="section-title">工作经历</h3>
          <div class="section-line"></div>
        </div>
        <div class="section-content">
          <div
            class="timeline-item"
            v-for="(work, index) in personData.workExperience"
            :key="index"
          >
            <div class="timeline-period">{{ work.period || "--" }}</div>
            <div class="timeline-content">
              <h4 class="timeline-title">{{ work.company || "--" }}</h4>
              <p class="timeline-subtitle">{{ work.position || "--" }}</p>
              <div
                class="work-description"
                v-html="formatWorkDescription(work.description)"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 专业技能区块 -->
      <div class="resume-section skills-section" v-if="personData.skills">
        <div class="section-header">
          <h3 class="section-title">专业技能</h3>
          <div class="section-line"></div>
        </div>
        <div class="section-content">
          <el-row :gutter="30" class="skills-grid">
            <el-col :span="8" v-if="personData.skills.language">
              <div class="skill-category">
                <div class="skill-header">
                  <el-icon class="skill-icon"><ChatLineRound /></el-icon>
                  <h4>语言能力</h4>
                </div>
                <div class="skill-content">
                  {{ personData.skills.language }}
                </div>
              </div>
            </el-col>
            <el-col :span="8" v-if="personData.skills.honors">
              <div class="skill-category">
                <div class="skill-header">
                  <el-icon class="skill-icon"><Trophy /></el-icon>
                  <h4>活动荣誉</h4>
                </div>
                <div class="skill-content">{{ personData.skills.honors }}</div>
              </div>
            </el-col>
            <el-col :span="8" v-if="personData.skills.general">
              <div class="skill-category">
                <div class="skill-header">
                  <el-icon class="skill-icon"><Tools /></el-icon>
                  <h4>通用技能</h4>
                </div>
                <div class="skill-content">{{ personData.skills.general }}</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 兴趣爱好区块 -->
      <div
        class="resume-section hobbies-section"
        v-if="personData.hobbies && personData.hobbies.length > 0"
      >
        <div class="section-header">
          <h3 class="section-title">兴趣爱好</h3>
          <div class="section-line"></div>
        </div>
        <div class="section-content">
          <div class="hobbies-list">
            <el-tag
              v-for="(hobby, index) in personData.hobbies"
              :key="index"
              class="hobby-tag"
              type="info"
              effect="light"
              size="large"
            >
              {{ hobby }}
            </el-tag>
          </div>
        </div>
      </div>
      <!-- 自我评价区块 -->
      <div
        class="resume-section evaluation-section"
        v-if="personData.selfEvaluation"
      >
        <div class="section-header">
          <h3 class="section-title">自我评价</h3>
          <div class="section-line"></div>
        </div>
        <div class="section-content">
          <div class="evaluation-content">
            <p>{{ personData.selfEvaluation }}</p>
          </div>
        </div>
      </div>
      <!-- 记录信息区块 -->
      <div
        class="resume-section records-section"
        v-if="personData.records && personData.records.length > 0"
      >
        <div class="section-header">
          <h3 class="section-title">记录信息</h3>
          <div class="section-line"></div>
        </div>
        <div class="section-content">
          <el-table
            :data="personData.records"
            style="width: 100%"
            stripe
            :header-cell-style="{
              backgroundColor: '#f5f7fa',
              fontWeight: '600',
            }"
          >
            <el-table-column
              prop="time"
              label="时间"
              width="180"
              align="center"
            />
            <el-table-column
              prop="location"
              label="地点"
              width="150"
              align="center"
            />
            <el-table-column prop="event" label="事件" />
          </el-table>
        </div>
      </div>
    </div>
    <!-- 打印时的页眉页脚 -->
    <div class="print-header" style="display: none">
      <div class="print-title">个人简历 - {{ personData.name }}</div>
      <div class="print-date">打印时间：{{ printTime }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  ArrowLeft,
  Printer,
  Edit,
  Download,
  User,
  Iphone,
  ChatDotSquare,
  ChatLineSquare,
  Wallet,
  ChatLineRound,
  Trophy,
  Tools,
} from "@element-plus/icons-vue"; // 定义类型
interface PersonRecord {
  time: string;
  location: string;
  event: string;
}
interface PersonData {
  id: number | string;
  name: string;
  gender: string;
  nation: string;
  nationality?: string;
  politicalStatus: string;
  age: string | number;
  height: string;
  phone: string;
  email: string;
  education: string;
  address: string;
  school: string;
  jobIntention: string; // 照片
  photos?: Array<{ url: string }>; // 证件信息
  idType?: string;
  idNumber?: string;
  idExpiry?: string; // 联系方式
  qq?: string;
  wechat?: string;
  alipay?: string; // 教育背景
  educationBackground?: Array<{
    period?: string;
    school?: string;
    major?: string;
    courses?: string;
    gpa?: string;
  }>; // 工作经历
  workExperience?: Array<{
    period?: string;
    company?: string;
    position?: string;
    description?: string;
  }>; // 专业技能
  skills?: {
    language?: string;
    honors?: string;
    general?: string;
  }; // 兴趣爱好
  hobbies?: string[]; // 自我评价
  selfEvaluation?: string; // 记录
  records?: PersonRecord[];
} // 获取路由参数
const route = useRoute();
const router = useRouter();
const personId = route.params.id; // 响应式数据
const personData = ref<PersonData>({});
const loading = ref(true);
const resumeContent = ref<HTMLElement>();
const printTime = ref(""); // 获取人员详情
const fetchPersonDetail = async () => {
  loading.value = true;
  try {
    // 这里调用API获取数据
    const { data, error } = await useFetch(`/api/person/${personId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (error.value) {
      throw error.value;
    }
    if (data.value) {
      // 模拟数据，实际项目中应该从API获取
      personData.value = {
        id: personId,
        name: "汤圆",
        gender: "女",
        nation: "汉",
        nationality: "中国",
        politicalStatus: "中共党员",
        age: 26,
        height: "172cm",
        phone: "13800138000",
        email: "tangyuan@example.com",
        education: "本科",
        address: "上海市浦东新区",
        school: "北京XX大学",
        jobIntention: "康复治疗师",
        photos: [
          { url: "https://example.com/photo1.jpg" },
          { url: "https://example.com/photo2.jpg" },
        ],
        idType: "身份证",
        idNumber: "310101199801010101",
        idExpiry: "2030-12-31",
        qq: "12345678",
        wechat: "tangyuan_wechat",
        alipay: "13800138000",
        educationBackground: [
          {
            period: "20XX.09-20XX.06",
            school: "XX医科大学",
            major: "康复治疗学专业(本科)",
            courses:
              "康复医学总论、物理治疗学、作业治疗学、语言治疗学、康复护理学、康复心理学、儿童康复学、骨科康复学、内科疾病康复学、神经伤病康复学、社区康复学、传统康复学等",
            gpa: "全系排名5/120，平均绩点GPA 3.8/4.0",
          },
        ],
        workExperience: [
          {
            period: "20XX.09-20XX.09",
            company: "XX市中心医院",
            position: "实习生",
            description:
              "1.轮转心肺康复、言语治疗、神经康复、骨关节康复、骨科、神经内科、物理治疗、作业治疗、儿童康复、推拿理疗部等科室实习；\n2.在上级医师的指导下评估患者，为患者制定近期和远期康复目标及康复治疗处方；\n3.指导患者进行康复训练、参加危重病人的抢救、监护工作。",
          },
        ],
        skills: {
          language: "英语六级证书、读写能力精通，能翻译专业领域文献",
          honors: "大学生创业计划大赛一等奖，新锐创业协会创业计划大赛二等奖",
          general: "取得驾驶执照、熟练掌握Office办公软件，会使用PS、AI设计软件",
        },
        hobbies: ["到处旅游", "游泳健身", "研究美食"],
        selfEvaluation:
          "本人康复治疗学专业毕业，已考取康复治疗士资格证书；通过大学五年的学习以及工作中的摸索和实践，已掌握较为扎实理论知识及康复科常见病种的评估及康复治疗手段；熟悉运动、器械康复的手段，能独立完成康复过程，拥有良好的分析总结能力、判断沟通能力、抗压能力。",
        records: [
          {
            time: "2023-05-10 14:30",
            location: "上海中心医院",
            event: "例行体检",
          },
          {
            time: "2023-03-15 09:00",
            location: "北京协和医院",
            event: "学术交流",
          },
        ],
      };
    }
  } catch (error) {
    console.error("获取人员详情失败:", error);
    ElMessage.error("获取人员详情失败，请稍后重试");
  } finally {
    loading.value = false;
  }
}; // 格式化工作描述
const formatWorkDescription = (description: string) => {
  if (!description) return "";
  return description.replace(/\n/g, "<br>");
}; // 返回列表
const goBack = () => {
  router.push("/person");
}; // 编辑信息
const handleEdit = () => {
  router.push(`/person/${personId}/edit`);
}; // 打印简历
const handlePrint = () => {
  printTime.value = new Date().toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  setTimeout(() => {
    window.print();
  }, 100);
}; // 导出PDF
const handleExport = async () => {
  try {
    ElMessage.info("PDF导出功能开发中...");
    // 这里可以集成html2pdf或类似库
  } catch (error) {
    console.error("导出PDF失败:", error);
  }
}; // 初始化
onMounted(() => {
  fetchPersonDetail();
});
</script>
<style scoped>
/* 页面整体样式 */
.person-detail-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
} /* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}
.back-btn {
  border-radius: 8px;
  padding: 10px 20px;
}
.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.header-actions {
  display: flex;
  gap: 12px;
} /* 简历容器 */
.resume-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
} /* 简历头部 */
.resume-header {
  margin-bottom: 40px;
}
.resume-title-section {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}
.resume-title {
  font-size: 36px;
  font-weight: 700;
  color: #1e3a8a;
  letter-spacing: 4px;
  margin: 0 0 20px 0;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
  padding: 0 20px;
}
.resume-title::before,
.resume-title::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3b82f6);
  transform: translateY(-50%);
}
.resume-title::before {
  right: 100%;
  margin-right: 20px;
}
.resume-title::after {
  left: 100%;
  margin-left: 20px;
  background: linear-gradient(90deg, #3b82f6, transparent);
}
.personal-header {
  display: flex;
  gap: 40px;
  margin-top: 20px;
}
.header-left {
  flex: 1;
}
.person-name {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #3b82f6;
  display: inline-block;
}
.job-intention {
  font-size: 18px;
  color: #6b7280;
  margin: 0 0 30px 0;
}
.job-intention .label {
  color: #4b5563;
  font-weight: 500;
}
.job-intention .value {
  color: #3b82f6;
  font-weight: 600;
} /* 基本信息网格 */
.basic-info-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.info-row {
  display: flex;
  gap: 40px;
}
.info-item {
  min-width: 200px;
}
.info-item.full-width {
  min-width: 100%;
}
.info-label {
  color: #6b7280;
  font-weight: 500;
  display: inline-block;
  width: 80px;
  text-align: right;
  margin-right: 8px;
}
.info-value {
  color: #1f2937;
  font-weight: 500;
  font-size: 16px;
}
.info-value.phone {
  color: #3b82f6;
  font-weight: 600;
} /* 右侧照片 */
.header-right {
  width: 300px;
  flex-shrink: 0;
}
.photo-section {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background: #f9fafb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.empty-photo {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  gap: 12px;
}
.empty-photo p {
  font-size: 16px;
  margin: 0;
} /* 区块通用样式 */
.resume-section {
  margin-bottom: 40px;
  position: relative;
}
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
  position: relative;
}
.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 20px 0 0;
  position: relative;
  padding-left: 12px;
}
.section-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 2px;
}
.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, #e5e7eb, transparent);
} /* 证件信息区块 */
.certificate-section .section-content {
  padding: 20px 0;
}
.certificate-grid {
  display: flex;
  gap: 20px;
}
.certificate-item {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}
.certificate-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}
.cert-label {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}
.cert-value {
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
  word-break: break-all;
} /* 联系方式区块 */
.contact-section .section-content {
  padding: 20px 0;
}
.contact-grid {
  display: flex;
  gap: 20px;
}
.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}
.contact-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}
.contact-icon {
  font-size: 24px;
  color: #3b82f6;
  background: #eff6ff;
  padding: 12px;
  border-radius: 8px;
}
.contact-info {
  flex: 1;
}
.contact-label {
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 4px;
}
.contact-value {
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
} /* 时间线样式 */
.timeline-item {
  display: flex;
  padding: 20px 0;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.3s ease;
}
.timeline-item:last-child {
  border-bottom: none;
}
.timeline-item:hover {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  margin: 0 -20px;
}
.timeline-period {
  width: 200px;
  flex-shrink: 0;
  color: #3b82f6;
  font-weight: 600;
  font-size: 16px;
  padding-right: 20px;
  display: flex;
  align-items: flex-start;
  position: relative;
}
.timeline-period::before {
  content: "";
  position: absolute;
  right: 8px;
  top: 6px;
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  border: 2px solid #eff6ff;
  box-shadow: 0 0 0 4px #dbeafe;
}
.timeline-content {
  flex: 1;
  position: relative;
}
.timeline-content::before {
  content: "";
  position: absolute;
  left: -20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #dbeafe 0%, transparent 100%);
}
.timeline-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}
.timeline-subtitle {
  font-size: 16px;
  color: #4b5563;
  margin: 0 0 12px 0;
  font-weight: 500;
}
.timeline-details {
  margin-top: 12px;
}
.detail-title {
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
  margin: 0 0 4px 0;
}
.detail-content {
  color: #4b5563;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  white-space: pre-line;
}
.work-description {
  color: #4b5563;
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-line;
} /* 专业技能区块 */
.skills-section .section-content {
  padding: 20px 0;
}
.skills-grid {
  display: flex;
  gap: 20px;
}
.skill-category {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  height: 100%;
}
.skill-category:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}
.skill-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}
.skill-icon {
  font-size: 20px;
  color: #3b82f6;
  background: #eff6ff;
  padding: 8px;
  border-radius: 6px;
}
.skill-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}
.skill-content {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-line;
} /* 兴趣爱好区块 */
.hobbies-section .section-content {
  padding: 20px 0;
}
.hobbies-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.hobby-tag {
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 14px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: none;
  color: #0369a1;
  transition: all 0.3s ease;
}
.hobby-tag:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.2);
} /* 自我评价区块 */
.evaluation-section .section-content {
  padding: 20px 0;
}
.evaluation-content {
  background: #f8fafc;
  border-radius: 8px;
  padding: 24px;
  border-left: 4px solid #3b82f6;
  font-size: 15px;
  line-height: 1.8;
  color: #4b5563;
  white-space: pre-line;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
} /* 记录信息区块 */
.records-section .section-content {
  padding: 20px 0;
} /* 打印样式 */
@media print {
  .page-header,
  .header-actions,
  .el-carousel__arrow,
  .el-carousel__indicators {
    display: none !important;
  }
  .person-detail-page {
    background: white;
    padding: 0;
  }
  .resume-container {
    box-shadow: none;
    padding: 20px;
    max-width: 100%;
  }
  .print-header {
    display: block !important;
    text-align: center;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 2px solid #1e3a8a;
  }
  .print-date {
    font-size: 12px;
    color: #666;
  }
  .photo-section {
    break-inside: avoid;
  }
  .resume-section {
    break-inside: avoid;
  }
} /* 响应式调整 */
@media (max-width: 1200px) {
  .personal-header {
    flex-direction: column;
  }
  .header-right {
    width: 100%;
    margin-top: 20px;
  }
  .certificate-grid,
  .contact-grid,
  .skills-grid {
    flex-direction: column;
  }
  .certificate-item,
  .contact-item {
    width: 100%;
  }
}
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 20px;
  }
  .header-left {
    flex-direction: column;
    align-items: flex-start;
  }
  .resume-container {
    padding: 20px;
  }
  .resume-title {
    font-size: 24px;
    letter-spacing: 2px;
  }
  .person-name {
    font-size: 24px;
  }
  .info-row {
    flex-direction: column;
    gap: 12px;
  }
  .info-item {
    min-width: 100%;
  }
  .timeline-item {
    flex-direction: column;
  }
  .timeline-period {
    width: 100%;
    margin-bottom: 8px;
    padding-right: 0;
  }
  .timeline-content::before {
    display: none;
  }
}
</style>
