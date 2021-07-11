<cn>
#### 表单域校验联动更新
这个例子展示了表单域之间如何联动更新校验。根据下拉框选择不同的值，另外两个表单域随之改变自己的校验规则。
</cn>

<us>
#### Update form item validation
This example shows how to update form item validation reactively. 
According to the different value selected in the dropdown, the other two fields will change their validation rules.
</us>

```vue
<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item label="Activity name" prop="name" :validateOnRuleChange="nameRuleChange">
      <a-input v-model="form.name" />
    </a-form-model-item>
    <a-form-model-item label="Activity ctrl" prop="ctrl">
      <a-select v-model="form.ctrl" @change="changeRule">
        <a-select-option value="opt1"> Name required </a-select-option>
        <a-select-option value="opt2"> Desc 50 characters </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="Activity form" prop="desc" :validateOnRuleChange="descRuleChange">
      <a-input v-model="form.desc" type="textarea" />
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit"> Create </a-button>
      <a-button style="margin-left: 10px" @click="resetForm"> Reset </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';

const formRules = {
  name: [
    {
      required: true,
      message: 'Please input Activity name',
      trigger: 'blur',
    },
  ],
  desc: [],
};
export default {
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      nameRuleChange: true,
      descRuleChange: true,
      form: {
        name: '',
        ctrl: 'opt1',
        desc: 'description for Activity form',
      },
      rules: cloneDeep(formRules),
    };
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      // remove validateOnRuleChange watcher, to prevent from triggering the validation
      this.nameRuleChange = false;
      this.descRuleChange = false;
      this.$nextTick(() => {
        this.rules = cloneDeep(formRules);
        this.$refs.ruleForm.resetFields();
        this.nameRuleChange = true;
        this.descRuleChange = true;
      });
    },
    changeRule(val) {
      const nameReqRule = this.rules.name.find(rule => rule.required !== undefined);
      switch (val) {
        case 'opt1':
          nameReqRule.required = true;
          this.rules.desc.pop();
          break;
        case 'opt2':
          nameReqRule.required = false;
          this.rules.desc.push({
            min: 50,
            message: 'At least 50 characters',
            trigger: ['blur', 'change'],
          });
          break;
      }
    },
  },
};
</script>
```
