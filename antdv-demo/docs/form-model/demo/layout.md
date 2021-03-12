<cn>
#### 表单布局
表单有三种布局。
</cn>

<us>
#### Form Layout
There are three layout for form: `horizontal`, `vertical`, `inline`.
</us>

```vue
<template>
  <a-form-model :layout="form.layout" :model="form" v-bind="formItemLayout">
    <a-form-model-item label="Form Layout">
      <a-radio-group v-model="form.layout">
        <a-radio-button value="horizontal">
          Horizontal
        </a-radio-button>
        <a-radio-button value="vertical">
          Vertical
        </a-radio-button>
        <a-radio-button value="inline">
          Inline
        </a-radio-button>
      </a-radio-group>
    </a-form-model-item>
    <a-form-model-item label="Field A">
      <a-input v-model="form.fieldA" placeholder="input placeholder" />
    </a-form-model-item>
    <a-form-model-item label="Field B">
      <a-input v-model="form.fieldB" placeholder="input placeholder" />
    </a-form-model-item>
    <a-form-model-item :wrapper-col="buttonItemLayout.wrapperCol">
      <a-button type="primary">
        Submit
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>
<script>
export default {
  data() {
    return {
      form: {
        layout: 'horizontal',
        fieldA: '',
        fieldB: '',
      },
    };
  },
  computed: {
    formItemLayout() {
      const { layout } = this.form;
      return layout === 'horizontal'
        ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
          }
        : {};
    },
    buttonItemLayout() {
      const { layout } = this.form;
      return layout === 'horizontal'
        ? {
            wrapperCol: { span: 14, offset: 4 },
          }
        : {};
    },
  },
};
</script>
```
