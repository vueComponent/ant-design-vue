<template>
  <div>
    <h1>
      如果您正在寻找顶级的 Vue.js 开发者，请联系
      <a-tooltip title="发送邮件到：antdv@foxmail.com">
        <a href="mailto:antdv@foxmail.com">我们</a>
      </a-tooltip>
      ！！！
    </h1>
    <div style="margin-top: 30px">
      <a-list item-layout="vertical" size="large" :data-source="list">
        <template #renderItem="item">
          <a-list-item v-show="isEffective(item.effectiveTime)">
            <a-list-item-meta>
              <template #description>
                <div>
                  <p>工作地点：{{ item.location }}</p>
                  <h3>职位描述</h3>
                  <p v-html="item.desc" />
                </div>
              </template>
              <template #title>
                <div>
                  <h2>
                    <a :href="item.url" target="_blank">{{ item.company }}</a>
                    <span>{{ item.title }}(岗位 ID: {{ item.id }})</span>
                  </h2>
                </div>
              </template>
            </a-list-item-meta>
            <template #actions>
              <div>
                <a-tooltip title="发送邮件到：antdv@foxmail.com">
                  <a :href="`mailto:antdv@foxmail.com?subject=应聘 ${item.id} 职位`">
                    <a-icon type="link" style="margin-right: 8px" />
                    立刻申请
                  </a>
                </a-tooltip>

                <span>注：邮件中请注明投递岗位 ID</span>
              </div>
            </template>
            <p v-html="item.condition" />
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs';
export default {
  data() {
    return {
      list: [
        {
          id: '9999',
          company: '蚂蚁金服体验技术部',
          title: '资深/专家前端开发工程师',
          location: '杭州',
          desc: `
          1、本科及以上学历，计算机相关专业，3 年以上工作经验 <br/>
          2、关注业界，持续学习，逻辑缜密，有创新意识 <br/>
          3、有扎实的专业基础知识，熟悉基本的数据结构和算法，深刻了解 web 原理 <br/>
          4、以下能力二选一 <br/>
            &nbsp;&nbsp;&nbsp; • 前端方向：熟练掌握 HTML，CSS，JavaScript，React/Vue/Angular 及配套社区项目（redux/mobx/rxjs/…）<br/>
            &nbsp;&nbsp;&nbsp; • Node、Java 方向：熟练掌握 NodeJS 或 Java，掌握主流 Web Server 原理，熟悉常用设计模式。 <br/>
          5、具有高度的责任心、较强的团队合作精神以及良好的协调与沟通能力 <br/>
          `,
          condition: `
          1、沟通产品需求，进行需求分析和风险识别 <br/>
          2、提供解决方案，设计技术架构，制定技术规范 <br/>
          3、进行研发排期，高质量完成产品研发、沉淀相关文档 <br/>
          4、了解竞品，切磋前沿技术和创新交互，推动产品不断完善 <br/>
          `,
          email: 'antdv',
          effectiveTime: {
            start: '2020-06-02 00:00:00',
            end: '2020-08-15 17:00:00',
          },
          url: 'https://xtech.antfin.com/',
        },
        {
          id: '10000',
          company: '杭州校宝在线科技有限公司',
          title: '高级/资深前端开发工程师',
          location: '杭州',
          desc: `
          1、负责公司 Saas、CRM 等产品的设计研发工作；<br/>
          2、根据实际业务场景及需求，设计前端基础架构，并带领其他组员实现并持续优化；<br/>
          3、优化团队开发方式及流程、提升团队开发效率、推动团队技术发展；<br/>
          4、负责组件库 Ant Design Vue 的开发维护工作。<br/>
          `,
          condition: `
          1、三年以上前端大型工程研发经验,并有自己的技术沉淀；<br/>
          2、精通javascript、CSS、HTML，了解相关的前端生态；<br/>
          3、精通一类MV*的jsframework，如AngularJS、React.js、Vue.js；<br/>
          4、对前端开发规范、工程化、组件化、测试有深入认识和实践；<br/>
          5、思路清晰，具备良好的沟通能力和学习能力，且具备强烈的进取心、团队合作精神；<br/>
          6、掌握Node.js，有后端开发经验的优先。<br/>
          `,
          email: 'antdv',
          effectiveTime: {
            start: '2020-06-02 00:00:00',
            end: '2020-08-15 17:00:00',
          },
          url: 'https://www.xiaobaoonline.com',
        },
        {
          id: '10001',
          company: '美团闪购',
          title: '高级前端开发工程师',
          location: '北京',
          desc: `
          1、负责公司中等规模业务线前端页面开发和维护。 <br/>
2、优化代码结构并保持良好兼容性、规范性；持续的优化用户体验，深入优化、定位瓶颈，权衡多种技术手段，实现最优的交互设计。<br/>
3、主动关注线上瓶颈，并对瓶颈进行有效优化。 <br/>
4、结合业务情况，参与多种平台技术建设，包括但不限于公共组件库、中台系统等。根据项目需求，分析、评估并给出最优的前端解决方案。<br/>
          `,
          condition: `
         1、本科及以上计算机相关专业，四年及以上前端开发经验。 <br/>
2、有良好的计算机基础。有扎实的html、css、javascript语言基础，能够编写结构合理，可维护性强的代码； <br/>
3、熟悉常用数据结构与算法及设计模式；熟悉常见的前端框架和响应式页面设计; <br/>
4、精通至少一种JS框架或者对JS原生掌握较深，熟悉Vue/React/angular的一种且了解其基本原理。   <br/>
5、有以下特征加分：<br/>
  &nbsp;&nbsp;&nbsp; • 技术社区活跃分子，有开源作品或有深度的技术博客； <br/>
  &nbsp;&nbsp;&nbsp; • 对nodejs/React Native/Flutter/webpack/Linux熟悉其中一种或几种； <br/>
  &nbsp;&nbsp;&nbsp; • 在工程化领域、可视化搭建平台、数据可视化、泛安全等领域有一项或是多项有深入研究（不仅仅只是使用）。 <br/>
          `,
          email: 'antdv',
          effectiveTime: {
            start: '2020-06-02 00:00:00',
            end: '2020-08-15 17:00:00',
          },
          url: 'https://shangou.meituan.com/',
        },
        {
          id: '10002',
          company: '北京阿拉丁未来科技有限责任公司',
          title: '高级/资深前端开发工程师',
          location: '北京',
          desc: `
          1、负责公司Saas平台的需求研究、技术研究和实现；<br/>
          2、优化团队前端架构，提高团队开发效率和质量；<br/>
          3、探索前端新的技术框架和边界（Vue.js，ReactNative等）；<br/>
          4、发现和产出对团队效率提升有价值的产品和工具。<br/>
          5、要求有Ant-vue版本实际项目经验（项目数量大于1）<br/>`,
          condition: `
          1、本科及以上学历，计算机相关专业，3年以上Web前端开发经验；<br/>
2、追求极致和完美，有代码洁癖，善于总结和挖掘事物本质；<br/>
3、前端基础扎实，有Ajax技术、json，H5相关的实践经验，对React.js，VUE.js，Angular.js等MVVM框架能熟练运用至少一种，且了解其基本原理；<br/>
4、关注Web发展，对新技术充满激情，期待或者已经开发出优秀的产品；<br/>
5、对实现高性能、高可用、优秀用户体验的 Web 应用有实际的了解和实践经验；<br/>
6、有团队精神，性格乐观，能积极面对压力。<br/>
          `,
          email: 'antdv',
          effectiveTime: {
            start: '2020-06-02 00:00:00',
            end: '2020-06-15 17:00:00',
          },
          url: 'https://www.aldwx.com',
        },
      ],
    };
  },
  methods: {
    isEffective({ start, end }) {
      return dayjs().isBetween(start, end);
    },
  },
};
</script>
<style scoped></style>
