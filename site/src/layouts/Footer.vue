<template>
  <footer id="footer">
    <div class="footer-wrap">
      <a-row>
        <a-col :md="6" :sm="24" :xs="24">
          <div class="footer-center">
            <h2>Ant Design</h2>
            <div>
              <a href="https://github.com/vueComponent/ant-design-vue" target="_blank ">
                <span>GitHub</span>
              </a>
              <span></span>
              <span>
                <i class="anticon anticon-github"></i>
              </span>
            </div>
            <div>
              <a href="https://ant.design/docs/react/introduce-cn" target="_blank">Ant Design</a>
              <span>-</span>
              <span>React</span>
            </div>
            <div>
              <a href="https://github.com/NG-ZORRO/ng-zorro-antd" target="_blank">Ant Design</a>
              <span>-</span>
              <span>Angular</span>
            </div>
            <div>
              <a href="https://github.com/websemantics/awesome-ant-design" target="_blank ">
                <span>Awesome Ant Design</span>
              </a>
            </div>
            <div>
              <a href="http://library.ant.design/" rel="noopener noreferrer" target="_blank">
                AntD Library
              </a>
            </div>
          </div>
        </a-col>
        <a-col :md="6" :sm="24" :xs="24">
          <div class="footer-center">
            <h2>{{ isCN ? '社区' : 'Community' }}</h2>
            <div v-if="isCN">
              <a href="https://zhuanlan.zhihu.com/ant-design-vue" target="_blank">
                <span>知乎专栏</span>
              </a>
            </div>
            <div>
              <a href="https://github.com/vueComponent/ant-design-vue/releases" target="_blank">
                <span>{{ isCN ? '更新记录' : 'Change Log' }}</span>
              </a>
            </div>
            <div>
              <a
                rel="noopener noreferrer"
                target="_blank"
                :href="`https://vuecomponent.github.io/issue-helper/${isCN ? '?lang=zh' : ''}`"
              >
                <span>{{ isCN ? '报告 Bug' : 'Bug Report' }}</span>
              </a>
            </div>
          </div>
        </a-col>
        <!-- <a-col :md="6" :sm="24" :xs="24">
          <div class="footer-center">
            <h2>{{ isCN ? '友情链接' : 'Links' }}</h2>
            <div>
              <a href="https://cn.vuejs.org/" target="_blank">Vue</a>
            </div>
            <div>
              <a href="https://cli.vuejs.org/" target="_blank">Vue CLI</a>
            </div>
            <div>
              <a href="https://vitejs.dev/" target="_blank">Vite</a>
            </div>
            <div>
              <a href="https://antdv.formilyjs.org/" target="_blank">@formily/antdv</a>
            </div>
          </div>
        </a-col> -->
        <a-col :md="12" :sm="24" :xs="24">
          <div class="footer-center">
            <h2>
              <img
                alt=""
                class="title-icon"
                src="https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg"
              />
              <span>{{ isCN ? '友情链接' : 'Links' }}</span>
            </h2>
            <div>
              <a href="https://www.demoget.com?atp=tangjinzhou" target="_blank">DemoGet</a>
              <span>-</span>
              <span>{{ isCN ? '好看好用的录屏工具' : 'Beautiful Screen Recordings' }}</span>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </footer>
</template>
<script>
import dayjs from 'dayjs';
import { computed } from 'vue';
export default {
  props: {
    isCN: Boolean,
  },
  setup() {
    const showJeecg = computed(() => {
      return dayjs().isBefore(dayjs('2023-09-10'));
    });
    return {
      dayjs,
      showJeecg,
    };
  },
};
</script>
