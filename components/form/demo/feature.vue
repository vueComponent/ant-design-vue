<cn>
#### global labelCol,wrapperCol,formItems,initialValues
使用
</cn>

<us>
#### global labelCol,wrapperCol,formItems,initialValues
Use `global labelCol,wrapperCol,formItems,initialValues.
</us>


<template>
  <a-form
    :form="form"
    :label-col="{span:5}"
    :wrapper-col="{span:15}"
    :form-items="formItems"
    :initial-values="initialValues"
    @submit="handleSubmit"
  />
</template>

<script>
export default {
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      formItems: [
        {
          field: 'age',
          label: '年龄',
        },
        {
          field: 'name',
          label: '名称',
        },
        {
          wrapperCol:{offset:5},
          el: (
            <a-button type="primary" html-type="submit">
              提交
            </a-button>
          ),
        },
      ],
      initialValues: {
        age: 14,
        name: 'zcc',
      },
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
    handleSelectChange(value) {
      console.log(value);
      this.form.setFieldsValue({
        note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
      });
    },
  },
};
</script>





