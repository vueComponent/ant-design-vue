<cn>
#### 输入框组合
输入框的组合展现。
注意：使用 `compact` 模式时，不需要通过 `Col` 来控制宽度。
</cn>

<us>
#### Input Group
Input.Group example
Note: You don't need `Col` to control the width in the `compact` mode.
</us>

```tpl
<template>
  <div>
    <a-input-group size="large">
      <a-row :gutter="8">
        <a-col :span="5">
          <a-input defaultValue="0571" />
        </a-col>
        <a-col :span="8">
          <a-input defaultValue="26888888" />
        </a-col>
      </a-row>
    </a-input-group>
    <br />
    <a-input-group compact>
      <a-input style="width: 20%" defaultValue="0571" />
      <a-input style="width: 30%" defaultValue="26888888" />
    </a-input-group>
    <br />
    <a-input-group compact>
      <a-select defaultValue="Zhejiang">
        <a-select-option value="Zhejiang">Zhejiang</a-select-option>
        <a-select-option value="Jiangsu">Jiangsu</a-select-option>
      </a-select>
      <a-input style="width: 50%" defaultValue="Xihu District, Hangzhou" />
    </a-input-group>
    <br />
    <a-input-group compact>
      <a-select defaultValue="Option1">
        <a-select-option value="Option1">Option1</a-select-option>
        <a-select-option value="Option2">Option2</a-select-option>
      </a-select>
      <a-input style="width: 50%" defaultValue="input content" />
    </a-input-group>
    <br />
    <a-input-group compact>
      <a-input style="width: 50%" defaultValue="input content" />
      <a-date-picker style="width: 50%" />
    </a-input-group>
    <br />
    <a-input-group compact>
      <a-select defaultValue="Option1-1">
        <a-select-option value="Option1-1">Option1-1</a-select-option>
        <a-select-option value="Option1-2">Option1-2</a-select-option>
      </a-select>
      <a-select defaultValue="Option2-2">
        <a-select-option value="Option2-1">Option2-1</a-select-option>
        <a-select-option value="Option2-2">Option2-2</a-select-option>
      </a-select>
    </a-input-group>
    <br />
    <a-input-group compact>
      <a-select defaultValue="1">
        <a-select-option value="1">Between</a-select-option>
        <a-select-option value="2">Except</a-select-option>
      </a-select>
      <a-input style=" width: 100px; text-align: center" placeholder="Minimum" />
      <a-input
        style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
        placeholder="~"
        disabled
      />
      <a-input style="width: 100px; text-align: center; border-left: 0" placeholder="Maximum" />
    </a-input-group>
    <br />
    <a-input-group compact>
      <a-select defaultValue="Sign Up">
        <a-select-option value="Sign Up">Sign Up</a-select-option>
        <a-select-option value="Sign In">Sign In</a-select-option>
      </a-select>
      <a-auto-complete
        :dataSource="dataSource"
        style="width: 200px"
        @change="handleChange"
        placeholder="Email"
      />
    </a-input-group>
    <br />
    <a-input-group compact>
      <a-select style="width: 30%" defaultValue="Home">
        <a-select-option value="Home">Home</a-select-option>
        <a-select-option value="Company">Company</a-select-option>
      </a-select>
      <a-cascader style="width: 70%" :options="options" placeholder="Select Address" />
    </a-input-group>
  </div>
</template>
<script>
  const options = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [
        {
          value: 'hangzhou',
          label: 'Hangzhou',
          children: [
            {
              value: 'xihu',
              label: 'West Lake',
            },
          ],
        },
      ],
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [
        {
          value: 'nanjing',
          label: 'Nanjing',
          children: [
            {
              value: 'zhonghuamen',
              label: 'Zhong Hua Men',
            },
          ],
        },
      ],
    },
  ];
  export default {
    data() {
      return {
        options,
        dataSource: [],
      };
    },
    methods: {
      handleChange(value) {
        this.dataSource =
          !value || value.indexOf('@') >= 0
            ? []
            : [`${value}@gmail.com`, `${value}@163.com`, `${value}@qq.com`];
      },
    },
  };
</script>
```
