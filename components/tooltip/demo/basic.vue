<template>
  <div>
    <tool-tip
      placement="top"
      :title="showText">
      <h1 @click="boom" style="display: inline-block">This is just a test, put your cursor here</h1>
    </tool-tip>
    <ant-button>{{showText}}</ant-button>
    <div class="box">
      <table>
        <tr v-for="(tr, index) in table" :key="index">
          <td v-for="(td, i) in tr" :key="i">
            <tool-tip v-if="td" :placement="td" :title="td"><AntButton type="primary">{{td}}</AntButton></tool-tip>
          </td>
        </tr>
      </table>
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
        ]
      }
		},
    methods: {
		  boom() {
		    if (this.showText.length % 20) {
          this.showText += '3'
        } else {
		      this.showText += ' '
        }
      }
    },
    components: {
		  ToolTip,
      AntButton: Button,
    }
	}
</script>
<style scoped lang="less">
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
