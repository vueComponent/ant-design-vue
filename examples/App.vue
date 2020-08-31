<cn>
#### 信息预览抽屉
需要快速预览对象概要时使用，点击遮罩区关闭。
</cn>

<us>
#### Preview drawer
Use Drawer to quickly preview details of an object, such as those in a list.
</us>

```vue
<template>
  <div>
    <demo />
  </div>
</template>
<script>
import demo from '../antdv-demo/docs/date-picker/demo';
export default {
  components: {
    demo,
  },
  data() {
    return {
      visible: false,
      pStyle: {
        fontSize: '16px',
        color: 'rgba(0,0,0,0.85)',
        lineHeight: '24px',
        display: 'block',
        marginBottom: '16px',
      },
      pStyle2: {
        marginBottom: '24px',
      },
    };
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
  },
};
</script>
```
