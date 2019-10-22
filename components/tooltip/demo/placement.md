<cn>
#### 位置
位置有 12 个方向。
</cn>

<us>
#### Placement
The ToolTip has 12 placements choice.
</us>

```tpl
<template>
  <div id="components-a-tooltip-demo-placement">
    <div :style="{ marginLeft: `${buttonWidth}px`, whiteSpace: 'nowrap' }">
      <a-tooltip placement="topLeft">
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>TL</a-button>
      </a-tooltip>
      <a-tooltip placement="top">
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>Top</a-button>
      </a-tooltip>
      <a-tooltip placement="topRight">
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>TR</a-button>
      </a-tooltip>
    </div>
    <div :style="{ width: `${buttonWidth}px`, float: 'left' }">
      <a-tooltip placement="leftTop">
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>LT</a-button>
      </a-tooltip>
      <a-tooltip placement="left">
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>Left</a-button>
      </a-tooltip>
      <a-tooltip placement="leftBottom">
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>LB</a-button>
      </a-tooltip>
    </div>
    <div :style="{ width: `${buttonWidth}px`, marginLeft: `${buttonWidth * 4 + 24 }px`}">
      <a-tooltip placement="rightTop">
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>RT</a-button>
      </a-tooltip>
      <a-tooltip placement="right">
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>Right</a-button>
      </a-tooltip>
      <a-tooltip placement="rightBottom">
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>RB</a-button>
      </a-tooltip>
    </div>
    <div :style="{ marginLeft: `${buttonWidth}px`, clear: 'both', whiteSpace: 'nowrap' }">
      <a-tooltip placement="bottomLeft">
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>BL</a-button>
      </a-tooltip>
      <a-tooltip placement="bottom">
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>Bottom</a-button>
      </a-tooltip>
      <a-tooltip placement="bottomRight">
        <template slot="title">
          <span>prompt text</span>
        </template>
        <a-button>BR</a-button>
      </a-tooltip>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        buttonWidth: 70,
      };
    },
  };
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
