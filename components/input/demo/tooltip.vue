<docs>
---
order: 9
title:
  zh-CN: 输入时格式化展示
  en-US: Format Tooltip Input
---

## zh-CN

结合 [Tooltip](/components/tooltip-cn/) 组件，实现一个数值输入框，方便内容超长时的全量展现。

## en-US

You can use the Input in conjunction with [Tooltip](/components/tooltip/) component to create a Numeric Input, which can provide a good experience for extra-long content display.

</docs>
<template>
  <a-tooltip :trigger="['focus']" placement="topLeft" overlay-class-name="numeric-input">
    <template v-if="inputValue" #title>
      <span class="numeric-input-title">
        {{ formatValue }}
      </span>
    </template>

    <a-input
      v-model:value="inputValue"
      placeholder="Input a number"
      :max-length="25"
      style="width: 120px"
      @blur="onBlur"
    />
  </a-tooltip>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

function formatNumber(value: string) {
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

const inputValue = ref<string>('111');
const formatValue = computed(() => {
  if (inputValue.value === '-') return '-';
  return formatNumber(inputValue.value);
});

const format = (val: string, preVal: string) => {
  const reg = /^-?\d*(\.\d*)?$/;

  if ((!isNaN(+val) && reg.test(val)) || val === '' || val === '-') {
    inputValue.value = val;
  } else {
    inputValue.value = preVal;
  }
};

// '.' at the end or only '-' in the input box.
const onBlur = () => {
  if (inputValue.value.charAt(inputValue.value.length - 1) === '.' || inputValue.value === '-') {
    format(inputValue.value.slice(0, -1), inputValue.value);
  }
};

watch(inputValue, (val, preVal) => {
  format(val, preVal);
});
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
