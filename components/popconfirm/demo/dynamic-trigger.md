<cn>
#### 条件触发
可以判断是否需要弹出。
</cn>

<us>
#### Conditional trigger
Make it pop up under some conditions.
</us>

```tpl
<template>
  <div>
    <a-popconfirm
      title="Are you sure delete this task?"
      :visible="visible"
      @visibleChange="handleVisibleChange"
      @confirm="confirm"
      @cancel="cancel"
      okText="Yes"
      cancelText="No"
    >
      <a href="#">Delete a task</a>
    </a-popconfirm>
    <br />
    <br />
    Whether directly execute：<a-checkbox defaultChecked @change="changeCondition" />
  </div>
</template>
<script>
  import { message } from 'ant-design-vue';

  export default {
    data() {
      return {
        visible: false,
        condition: true,
      };
    },
    methods: {
      changeCondition(e) {
        this.condition = e.target.checked;
      },
      confirm() {
        this.visible = false;
        message.success('Next step.');
      },
      cancel() {
        this.visible = false;
        message.error('Click on cancel.');
      },
      handleVisibleChange(visible) {
        if (!visible) {
          this.visible = false;
          return;
        }
        // Determining condition before show the popconfirm.
        console.log(this.condition);
        if (this.condition) {
          this.confirm(); // next step
        } else {
          this.visible = true;
        }
      },
    },
  };
</script>
```
