<cn>
#### 表单数据存储于 Vuex Store 中
通过使用 onFieldsChange 与 mapPropsToFields，可以把表单的数据存储到 Vuex 中。
**注意：**
`mapPropsToFields` 里面返回的表单域数据必须使用 `Form.createFormField` 包装。
</cn>

<us>
#### Store Form Data into Vuex Store
We can store form data into Vuex Store.
**Note:**
You must wrap field data with `Form.createFormField` in `mapPropsToFields`.
</us>

<template>
  <div id="components-form-demo-vuex">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="Username">
        <a-input
          v-decorator="[
            'username',
            {
              rules: [{ required: true, message: 'Username is required!' }],
            },
          ]"
        />
      </a-form-item>
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form>
  </div>
</template>

<script>
export default {
  computed: {
    username() {
      return this.$store.state.username;
    },
  },
  watch: {
    username(val) {
      console.log('this.$store.state.username: ', val);
      this.form.setFieldsValue({ username: val });
    },
  },
  created() {
    this.form = this.$form.createForm(this, {
      onFieldsChange: (_, changedFields) => {
        this.$emit('change', changedFields);
      },
      mapPropsToFields: () => {
        return {
          username: this.$form.createFormField({
            value: this.username,
          }),
        };
      },
      onValuesChange: (_, values) => {
        console.log(values);
        // Synchronize to vuex store in real time
        // this.$store.commit('update', values)
      },
    });
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.$store.commit('update', values);
        }
      });
    },
  },
};
</script>
<style>
#components-form-demo-vuex .language-bash {
  max-width: 400px;
  border-radius: 6px;
  margin-top: 24px;
}
</style>
