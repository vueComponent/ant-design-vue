<template>
  <section :class="['code-box', isOpen ? 'expand': '']" :id="id">
    <section class="code-box-demo">
      <slot name="component"></slot>
    </section>
    <section class="code-box-meta markdown">
      <slot v-if="isZhCN" name="description"></slot>
      <slot v-else name="us-description"></slot>
      <span class="btn-toggle" :class="{open: isOpen}" @click="toggle"><i class="anticon anticon-down-circle-o"></i></span>
    </section>
    <transition appear :css="false" @enter="enter" @leave="leave">
      <section class="highlight-wrapper" style="position: relative;" v-show="isOpen">
        <a-tooltip
          :title="copied ? '复制成功' : '复制代码'"
          :visible="copyTooltipVisible"
          @change="onCopyTooltipVisibleChange"
        >
          <a-icon
            :type="copied && copyTooltipVisible ? 'check' : 'copy'"
            class="code-box-code-copy"
            v-clipboard:copy="sourceCode"
            v-clipboard:success="handleCodeCopied"
          />
        </a-tooltip>
        <slot name="code"></slot>
      </section>
    </transition>
  </section>
</template>
<script>
import animate from 'antd/_util/openAnimation'
import BaseMixin from 'antd/_util/BaseMixin'
import { isZhCN } from '../util'
export default {
  mixins: [BaseMixin],
  name: 'demoBox',
  props: {
    jsfiddle: Object,
  },
  inject: {
    _store: { default: {}},
  },
  data () {
    const { name = '' } = this.$route.params
    const { html, script, style, us, cn } = this.jsfiddle
    let sourceCode = `<template>${html}</template>\n`
    sourceCode = script ? sourceCode + '\<script>' + script + '<\/script>' : sourceCode
    sourceCode = style ? sourceCode + '\<style>' + style + '<\/style>' : sourceCode
    const usTitle = (us.split('#### ')[1] || '').split('\n')[0] || ''
    const cnTitle = (cn.split('#### ')[1] || '').split('\n')[0] || ''
    if (process.env.NODE_ENV !== 'production' && usTitle === '') {
      throw new Error(
        `not have usTitle`,
      )
    }
    const id = ['components', name.replace('-cn', ''), 'demo', ...usTitle.split(' ')].join('-').toLowerCase()
    if (this._store.store) {
      const { currentSubMenu } = this._store.store.getState()
      this._store.store.setState({ currentSubMenu: [...currentSubMenu, { cnTitle, usTitle, id }] })
    }
    return {
      isOpen: false,
      isZhCN: isZhCN(name),
      copied: false,
      copyTooltipVisible: false,
      sourceCode,
      id,
    }
  },
  methods: {
    toggle () {
      this.isOpen = !this.isOpen
    },
    enter: animate.enter,
    leave: animate.leave,
    handleCodeCopied () {
      this.setState({ copied: true })
    },

    onCopyTooltipVisibleChange (visible) {
      if (visible) {
        this.setState({
          copyTooltipVisible: visible,
          copied: false,
        })
        return
      }
      this.setState({
        copyTooltipVisible: visible,
      })
    },
  },
}
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
  h3, h4 {
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
  -webkit-transition: height .2s ease-in-out;
  transition: height .2s ease-in-out;
  overflow: auto;
  border-top: 1px dashed #e9e9e9;
  pre {
    margin: 0;
  }
  code {
    margin: 0;
    background: #f7f7f7;
    padding: .2em .4em;
    border-radius: 3px;
    font-size: .9em;
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
