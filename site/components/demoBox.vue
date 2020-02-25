<template>
  <section :id="id" :class="['code-box', codeExpand ? 'expand' : '']">
    <section class="code-box-demo">
      <template v-if="iframeDemo[iframeDemoKey]">
        <div class="browser-mockup with-url">
          <iframe :src="iframeDemo[iframeDemoKey]" height="360" />
        </div>
      </template>
      <template v-else>
        <slot name="component" />
      </template>
    </section>
    <section class="code-box-meta markdown">
      <slot v-if="isZhCN" name="description" />
      <slot v-else name="us-description" />
      <a-tooltip :title="codeExpand ? 'Hide Code' : 'Show Code'">
        <span class="code-expand-icon">
          <img
            width="16"
            alt="expand code"
            src="https://gw.alipayobjects.com/zos/rmsportal/wSAkBuJFbdxsosKKpqyq.svg"
            :class="codeExpand ? 'code-expand-icon-hide' : 'code-expand-icon-show'"
            @click="handleCodeExpand"
          />
          <img
            width="16"
            alt="expand code"
            src="https://gw.alipayobjects.com/zos/rmsportal/OpROPHYqWmrMDBFMZtKF.svg"
            :class="codeExpand ? 'code-expand-icon-show' : 'code-expand-icon-hide'"
            @click="handleCodeExpand"
          />
        </span>
      </a-tooltip>
    </section>
    <transition appear :css="false" @enter="enter" @leave="leave">
      <section v-show="codeExpand" class="highlight-wrapper" style="position: relative;">
        <a-tooltip
          :title="copied ? '复制成功' : '复制代码'"
          :visible="copyTooltipVisible"
          @visibleChange="onCopyTooltipVisibleChange"
        >
          <a-icon
            v-clipboard:copy="sourceCode"
            v-clipboard:success="handleCodeCopied"
            :type="copied && copyTooltipVisible ? 'check' : 'copy'"
            class="code-box-code-copy"
          />
        </a-tooltip>
        <slot name="code" />
      </section>
    </transition>
  </section>
</template>
<script>
import animate from 'antd/_util/openAnimation';
import BaseMixin from 'antd/_util/BaseMixin';
import { isZhCN } from '../util';
import { dev } from '../../build/config';
export default {
  name: 'DemoBox',
  mixins: [BaseMixin],
  props: {
    jsfiddle: Object,
    isIframe: Boolean,
  },
  inject: {
    iframeDemo: { default: {} },
    demoContext: { default: {} },
  },
  data() {
    const { name = '' } = this.demoContext;
    const { us, cn, sourceCode } = this.jsfiddle;
    // let sourceCode = `<template>${html}</template>\n`
    // sourceCode = script ? sourceCode + '\<script>' + script + '<\/script>' : sourceCode
    // sourceCode = style ? sourceCode + '\<style>' + style + '<\/style>' : sourceCode
    const usTitle = (us.split('#### ')[1] || '').split('\n')[0] || '';
    const cnTitle = (cn.split('#### ')[1] || '').split('\n')[0] || '';
    if (process.env.NODE_ENV !== 'production' && usTitle === '') {
      throw new Error(`not have usTitle`);
    }
    const iframeDemoKey = usTitle
      .split(' ')
      .join('-')
      .toLowerCase();
    const id = [
      'components',
      name.replace(/-cn\/?$/, '') || dev.componentName,
      'demo',
      ...usTitle.split(' '),
    ]
      .join('-')
      .toLowerCase();

    if (this.demoContext.store) {
      const { currentSubMenu } = this.demoContext.store.getState();
      // id = `${id}-${currentSubMenu.length + 1}`
      this.demoContext.store.setState({
        currentSubMenu: [...currentSubMenu, { cnTitle, usTitle, id }],
      });
    }
    return {
      codeExpand: false,
      isZhCN: isZhCN(name),
      copied: false,
      copyTooltipVisible: false,
      sourceCode,
      id,
      iframeDemoKey,
    };
  },
  methods: {
    handleCodeExpand() {
      this.codeExpand = !this.codeExpand;
    },
    enter: animate.enter,
    leave: animate.leave,
    handleCodeCopied() {
      this.setState({ copied: true });
    },

    onCopyTooltipVisibleChange(visible) {
      if (visible) {
        this.setState({
          copyTooltipVisible: visible,
          copied: false,
        });
        return;
      }
      this.setState({
        copyTooltipVisible: visible,
      });
    },
  },
};
</script>
<style scoped lang="less">
.box-demo {
  padding: 0;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
  box-shadow: none;
  margin-top: 20px;
  margin-bottom: 20px;
}
.box-demo-show {
  padding: 20px 25px 30px;
  border-bottom: 1px solid #e9e9e9;
}
.box-demo-description {
  position: relative;
  padding: 17px 16px 15px 20px;
  border-radius: 0 0 6px 6px;
  -webkit-transition: background-color 0.4s ease;
  transition: background-color 0.4s ease;
  width: 100%;
  font-size: 12px;
  &.bordered {
    border-bottom: 1px dashed #e9e9e9;
  }
  h3,
  h4 {
    position: absolute;
    top: -14px;
    padding: 1px 8px;
    margin-left: -8px;
    margin-top: 0;
    margin-bottom: 0;
    color: #777;
    border-radius: 4px;
    border-top-left-radius: 0;
    background: #fff;
    -webkit-transition: background-color 0.4s ease;
    transition: background-color 0.4s ease;
    .header-anchor {
      display: none;
    }
  }
  li {
    line-height: 21px;
  }
}
.box-demo-code {
  -webkit-transition: height 0.2s ease-in-out;
  transition: height 0.2s ease-in-out;
  overflow: auto;
  border-top: 1px dashed #e9e9e9;
  pre {
    margin: 0;
  }
  code {
    margin: 0;
    background: #f7f7f7;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
    border: 1px solid #eee;
  }
}
.btn-toggle {
  position: absolute;
  right: 16px;
  bottom: 17px;
  cursor: pointer;
  width: 18px;
  height: 18px;
  font-size: 18px;
  line-height: 18px;
  color: #999;
  i {
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  }
  &.open {
    i {
      -webkit-transform: rotate(-180deg);
      -ms-transform: rotate(-180deg);
      transform: rotate(-180deg);
    }
  }
}
</style>
