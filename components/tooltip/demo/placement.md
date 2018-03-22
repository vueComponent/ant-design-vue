<cn>
#### 位置
位置有 12 个方向。
</cn>

<us>
#### Placement
The ToolTip has 12 placements choice.
</us>

```html
<template>
  <div id="components-a-tooltip-demo-placement">
    <div :style="{ marginLeft: `${buttonWidth}px`, whiteSpace: 'nowrap' }">
      <a-popconfirm placement="topLeft" >
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>TL</a-button>
      </a-popconfirm>
      <a-popconfirm placement="top" >
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>Top</a-button>
      </a-popconfirm>
      <a-popconfirm placement="topRight" >
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>TR</a-button>
      </a-popconfirm>
    </div>
    <div :style="{ width: `${buttonWidth}px`, float: 'left' }">
      <a-popconfirm placement="leftTop" >
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>LT</a-button>
      </a-popconfirm>
      <a-popconfirm placement="left" >
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>Left</a-button>
      </a-popconfirm>
      <a-popconfirm placement="leftBottom" >
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>LB</a-button>
      </a-popconfirm>
    </div>
    <div :style="{ width: `${buttonWidth}px`, marginLeft: `${buttonWidth * 4 + 24 }px`}">
      <a-popconfirm placement="rightTop" >
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>RT</a-button>
      </a-popconfirm>
      <a-popconfirm placement="right" >
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>Right</a-button>
      </a-popconfirm>
      <a-popconfirm placement="rightBottom" >
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>RB</a-button>
      </a-popconfirm>
    </div>
    <div :style="{ marginLeft: `${buttonWidth}px`, clear: 'both', whiteSpace: 'nowrap' }">
      <a-popconfirm placement="bottomLeft" >
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>BL</a-button>
      </a-popconfirm>
      <a-popconfirm placement="bottom" >
        <template slot="title">
            <span>prompt text</span>
        </template>
        <a-button>Bottom</a-button>
      </a-popconfirm>
      <a-popconfirm placement="bottomRight" >
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>BR</a-button>
      </a-popconfirm>
    </div>
  </div>
</template>
<script>
import { message } from 'antd'

export default {
  data () {
    return {
      buttonWidth: 70,
    }
  },
}
</script>
<style scoped>
#components-a-tooltip-demo-placement .ant-btn {
  width: 70px;
  text-align: center;
  padding: 0;
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
```

