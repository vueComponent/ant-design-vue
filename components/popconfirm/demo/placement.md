<cn>
#### 位置
位置有十二个方向。如需箭头指向目标元素中心，可以设置 `arrowPointAtCenter`。
</cn>

<us>
#### Placement
There are 12 `placement` options available. Use `arrowPointAtCenter` if you want arrow point at the center of target.
</us>

```tpl
<template>
  <div id="components-a-popconfirm-demo-placement">
    <div :style="{ marginLeft: `${buttonWidth}px`, whiteSpace: 'nowrap' }">
      <a-popconfirm placement="topLeft" okText="Yes" cancelText="No" @confirm="confirm">
        <template slot="title">
          <p>{{text}}</p>
          <p>{{text}}</p>
        </template>
        <a-button>TL</a-button>
      </a-popconfirm>
      <a-popconfirm placement="top" okText="Yes" cancelText="No" @confirm="confirm">
        <template slot="title">
          <p>{{text}}</p>
          <p>{{text}}</p>
        </template>
        <a-button>Top</a-button>
      </a-popconfirm>
      <a-popconfirm placement="topRight" okText="Yes" cancelText="No" @confirm="confirm">
        <template slot="title">
          <p>{{text}}</p>
          <p>{{text}}</p>
        </template>
        <a-button>TR</a-button>
      </a-popconfirm>
    </div>
    <div :style="{ width: `${buttonWidth}px`, float: 'left' }">
      <a-popconfirm placement="leftTop" okText="Yes" cancelText="No" @confirm="confirm">
        <template slot="title">
          <p>{{text}}</p>
          <p>{{text}}</p>
        </template>
        <a-button>LT</a-button>
      </a-popconfirm>
      <a-popconfirm placement="left" okText="Yes" cancelText="No" @confirm="confirm">
        <template slot="title">
          <p>{{text}}</p>
          <p>{{text}}</p>
        </template>
        <a-button>Left</a-button>
      </a-popconfirm>
      <a-popconfirm placement="leftBottom" okText="Yes" cancelText="No" @confirm="confirm">
        <template slot="title">
          <p>{{text}}</p>
          <p>{{text}}</p>
        </template>
        <a-button>LB</a-button>
      </a-popconfirm>
    </div>
    <div :style="{ width: `${buttonWidth}px`, marginLeft: `${buttonWidth * 4 + 24 }px`}">
      <a-popconfirm placement="rightTop" okText="Yes" cancelText="No" @confirm="confirm">
        <template slot="title">
          <p>{{text}}</p>
          <p>{{text}}</p>
        </template>
        <a-button>RT</a-button>
      </a-popconfirm>
      <a-popconfirm placement="right" okText="Yes" cancelText="No" @confirm="confirm">
        <template slot="title">
          <p>{{text}}</p>
          <p>{{text}}</p>
        </template>
        <a-button>Right</a-button>
      </a-popconfirm>
      <a-popconfirm placement="rightBottom" okText="Yes" cancelText="No" @confirm="confirm">
        <template slot="title">
          <p>{{text}}</p>
          <p>{{text}}</p>
        </template>
        <a-button>RB</a-button>
      </a-popconfirm>
    </div>
    <div :style="{ marginLeft: `${buttonWidth}px`, clear: 'both', whiteSpace: 'nowrap' }">
      <a-popconfirm placement="bottomLeft" okText="Yes" cancelText="No" @confirm="confirm">
        <template slot="title">
          <p>{{text}}</p>
          <p>{{text}}</p>
        </template>
        <a-button>BL</a-button>
      </a-popconfirm>
      <a-popconfirm placement="bottom" okText="Yes" cancelText="No" @confirm="confirm">
        <template slot="title">
          <p>{{text}}</p>
          <p>{{text}}</p>
        </template>
        <a-button>Bottom</a-button>
      </a-popconfirm>
      <a-popconfirm placement="bottomRight" okText="Yes" cancelText="No" @confirm="confirm">
        <template slot="title">
          <p>{{text}}</p>
          <p>{{text}}</p>
        </template>
        <a-button>BR</a-button>
      </a-popconfirm>
    </div>
  </div>
</template>
<script>
  import { message } from 'ant-design-vue';

  export default {
    data() {
      return {
        buttonWidth: 70,
        text: 'Are you sure to delete this task?',
      };
    },
    methods: {
      confirm() {
        message.info('Clicked on Yes.');
      },
    },
  };
</script>
<style scoped>
  #components-a-popconfirm-demo-placement .ant-btn {
    width: 70px;
    text-align: center;
    padding: 0;
    margin-right: 8px;
    margin-bottom: 8px;
  }
</style>
```
