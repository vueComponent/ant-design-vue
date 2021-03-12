<cn>
#### 校验其他组件
以上演示没有出现的表单控件对应的校验演示。
</cn>

<us>
#### Other Form Controls
Demonstration of validation configuration for form controls which are not shown in the demos above.
</us>

<template>
  <a-form
    id="components-form-demo-validate-other"
    :form="form"
    v-bind="formItemLayout"
    @submit="handleSubmit"
  >
    <a-form-item label="Plain Text">
      <span class="ant-form-text">
        China
      </span>
    </a-form-item>
    <a-form-item label="Select" has-feedback>
      <a-select
        v-decorator="[
          'select',
          { rules: [{ required: true, message: 'Please select your country!' }] },
        ]"
        placeholder="Please select a country"
      >
        <a-select-option value="china">
          China
        </a-select-option>
        <a-select-option value="usa">
          U.S.A
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Select[multiple]">
      <a-select
        v-decorator="[
          'select-multiple',
          {
            rules: [
              { required: true, message: 'Please select your favourite colors!', type: 'array' },
            ],
          },
        ]"
        mode="multiple"
        placeholder="Please select favourite colors"
      >
        <a-select-option value="red">
          Red
        </a-select-option>
        <a-select-option value="green">
          Green
        </a-select-option>
        <a-select-option value="blue">
          Blue
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="InputNumber">
      <a-input-number v-decorator="['input-number', { initialValue: 3 }]" :min="1" :max="10" />
      <span class="ant-form-text">
        machines
      </span>
    </a-form-item>

    <a-form-item label="Switch">
      <a-switch v-decorator="['switch', { valuePropName: 'checked' }]" />
    </a-form-item>

    <a-form-item label="Slider">
      <a-slider
        v-decorator="['slider']"
        :marks="{ 0: 'A', 20: 'B', 40: 'C', 60: 'D', 80: 'E', 100: 'F' }"
      />
    </a-form-item>

    <a-form-item label="Radio.Group">
      <a-radio-group v-decorator="['radio-group']">
        <a-radio value="a">
          item 1
        </a-radio>
        <a-radio value="b">
          item 2
        </a-radio>
        <a-radio value="c">
          item 3
        </a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item label="Radio.Button">
      <a-radio-group v-decorator="['radio-button']">
        <a-radio-button value="a">
          item 1
        </a-radio-button>
        <a-radio-button value="b">
          item 2
        </a-radio-button>
        <a-radio-button value="c">
          item 3
        </a-radio-button>
      </a-radio-group>
    </a-form-item>

    <a-form-item label="Checkbox.Group">
      <a-checkbox-group
        v-decorator="['checkbox-group', { initialValue: ['A', 'B'] }]"
        style="width: 100%;"
      >
        <a-row>
          <a-col :span="8">
            <a-checkbox value="A">
              A
            </a-checkbox>
          </a-col>
          <a-col :span="8">
            <a-checkbox disabled value="B">
              B
            </a-checkbox>
          </a-col>
          <a-col :span="8">
            <a-checkbox value="C">
              C
            </a-checkbox>
          </a-col>
          <a-col :span="8">
            <a-checkbox value="D">
              D
            </a-checkbox>
          </a-col>
          <a-col :span="8">
            <a-checkbox value="E">
              E
            </a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
    </a-form-item>

    <a-form-item label="Rate">
      <a-rate v-decorator="['rate', { initialValue: 3.5 }]" allow-half />
    </a-form-item>

    <a-form-item label="Upload" extra="longgggggggggggggggggggggggggggggggggg">
      <a-upload
        v-decorator="[
          'upload',
          {
            valuePropName: 'fileList',
            getValueFromEvent: normFile,
          },
        ]"
        name="logo"
        action="/upload.do"
        list-type="picture"
      >
        <a-button> <a-icon type="upload" /> Click to upload </a-button>
      </a-upload>
    </a-form-item>

    <a-form-item label="Dragger">
      <div class="dropbox">
        <a-upload-dragger
          v-decorator="[
            'dragger',
            {
              valuePropName: 'fileList',
              getValueFromEvent: normFile,
            },
          ]"
          name="files"
          action="/upload.do"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p class="ant-upload-hint">
            Support for a single or bulk upload.
          </p>
        </a-upload-dragger>
      </div>
    </a-form-item>

    <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  data: () => ({
    formItemLayout: {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    },
  }),
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'validate_other' });
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
    normFile(e) {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    },
  },
};
</script>
<style>
#components-form-demo-validate-other .dropbox {
  height: 180px;
  line-height: 1.5;
}
</style>
