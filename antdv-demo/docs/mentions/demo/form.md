<cn>
#### 配合 Form 使用
受控模式，例如配合 Form 使用。
</cn>

<us>
#### With Form
Controlled mode, for example, to work with `Form`.
</us>

```vue
<template>
  <a-form :form="form" layout="horizontal">
    <a-form-item label="Top coders" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-mentions
        v-decorator="[
          'coders',
          {
            rules: [{ validator: checkMention }],
          },
        ]"
        rows="1"
      >
        <a-mentions-option value="afc163">
          afc163
        </a-mentions-option>
        <a-mentions-option value="zombieJ">
          zombieJ
        </a-mentions-option>
        <a-mentions-option value="yesmeck">
          yesmeck
        </a-mentions-option>
      </a-mentions>
    </a-form-item>
    <a-form-item label="Bio" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-mentions
        v-decorator="[
          'bio',
          {
            rules: [{ required: true }],
          },
        ]"
        rows="3"
        placeholder="You can use @ to ref user here"
      >
        <a-mentions-option value="afc163">
          afc163
        </a-mentions-option>
        <a-mentions-option value="zombieJ">
          zombieJ
        </a-mentions-option>
        <a-mentions-option value="yesmeck">
          yesmeck
        </a-mentions-option>
      </a-mentions>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
      <a-button type="primary" @click="handleSubmit">
        Submit
      </a-button>
      <a-button style="margin-left: 8px;" @click="handleReset">
        Reset
      </a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { Mentions } from 'ant-design-vue';
const { getMentions } = Mentions;
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: 'mentions' }),
    };
  },
  methods: {
    handleReset(e) {
      e.preventDefault();
      this.form.resetFields();
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((errors, values) => {
        if (errors) {
          console.log('Errors in the form!!!');
          return;
        }
        console.log('Submit!!!');
        console.log(values);
      });
    },
    checkMention(rule, value, callback) {
      const mentions = getMentions(value);
      if (mentions.length < 2) {
        callback(new Error('More than one must be selected!'));
      } else {
        callback();
      }
    },
  },
};
</script>
```
