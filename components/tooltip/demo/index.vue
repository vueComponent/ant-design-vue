<template>
  <div>
    <tool-tip
      placement="top"
      :title="showText"
      :autoAdjustOverflow="autoAdjustOverflow"
    >
      <h1 @click="boom" class="test">撞到边缘翻转位置 & 点击更新</h1>
    </tool-tip>
    <ant-button @click="reverse" type="primary">{{autoAdjustOverflow ? '启用' : '关闭'}}自动调整中</ant-button>
    <div class="box">
      <h2>切换arrowPointAtCenter模式</h2>
      <ant-button @click="change">{{arrowPointAtCenter}}</ant-button>
      <table>
        <tr v-for="(tr, index) in table" :key="index">
          <td v-for="(td, i) in tr" :key="i">
            <tool-tip
              v-if="td"
              :placement="td"
              :title="td"
              :arrowPointAtCenter="arrowPointAtCenter"
            >
              <AntButton type="primary">{{td}}</AntButton>
            </tool-tip>
          </td>
        </tr>
      </table>
    </div>
    <div>
      <p>
        <tool-tip :arrowPointAtCenter="true" title="Consider using the NamedModulesPlugin for module names." placement="topLeft">
          <ant-button>arrowPointAtCenter arrowPointAtCenter arrowPointAtCenter</ant-button>
        </tool-tip>
      </p>
    </div>
  </div>
</template>

<script>
  import { ToolTip, Button } from 'antd'
  import 'antd/button/style'
	export default {
		name: 'tooltip-basic',
		data() {
			return {
        show: true,
        showText: '你好啊，233',
        table: [
          ['', 'topLeft', 'top', 'topRight', ''],
          ['leftTop', '', '', '', 'rightTop'],
          ['left', '', '', '', 'right'],
          ['leftBottom', '', '', '', 'rightBottom'],
          ['', 'bottomLeft', 'bottom', 'bottomRight', ''],
        ],
        arrowPointAtCenter: false,
        autoAdjustOverflow: true,
      }
		},
    methods: {
		  boom() {
		    if (this.showText.length % 20) {
          this.showText += '3'
        } else {
		      this.showText += ' '
        }
      },
      change() {
		    this.arrowPointAtCenter = !this.arrowPointAtCenter
      },
      reverse() {
		    this.autoAdjustOverflow = !this.autoAdjustOverflow
      }
    },
    components: {
		  ToolTip,
      AntButton: Button,
    }
	}
</script>
<style scoped lang="less">
  .test {
    margin: 20px;
    display: inline-block;
  }
  .box {
    margin: 100px;
  }
  table {
    td {
      padding: 20px;
    }
    p {
      text-align: center;
      vertical-align: middle;
    }
  }
</style>
