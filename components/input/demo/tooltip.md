<cn>
#### 输入时格式化展示
结合 [Tooltip](/components/tooltip-cn/) 组件，实现一个数值输入框，方便内容超长时的全量展现。
</cn>

<us>
#### Format Tooltip Input
You can use the Input in conjunction with [Tooltip](/components/tooltip/) component to create a Numeric Input, which can provide a good experience for extra-long content display.
</us>

```tpl
<template>
  <a-tooltip :trigger="['focus']" placement="topLeft" overlayClassName="numeric-input">
    <span slot="title" v-if="value" class="numeric-input-title">
      {{value !== '-' ? formatNumber(value) : '-'}}
    </span>
    <template slot="title" v-else>
      Input a number
    </template>
    <a-input
      :value="value"
      @change="onChange"
      @blur="onBlur"
      placeholder="Input a number"
      :maxLength="25"
      style="width: 120px"
    />
  </a-tooltip>
</template>
<script>
  function formatNumber(value) {
    value += '';
    const list = value.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
  }

  export default {
    data() {
      return {
        value: '',
      };
    },
    methods: {
      formatNumber,
      onChange(e) {
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
          this.value = value;
        }
      },
      // '.' at the end or only '-' in the input box.
      onBlur() {
        const { value, onChange } = this;
        if (value.charAt(value.length - 1) === '.' || value === '-') {
          onChange({ value: value.slice(0, -1) });
        }
      },
    },
  };
</script>
<style>
  /* to prevent the arrow overflow the popup container,
or the height is not enough when content is empty */
  .numeric-input .ant-tooltip-inner {
    min-width: 32px;
    min-height: 37px;
  }

  .numeric-input .numeric-input-title {
    font-size: 14px;
  }
</style>
```
