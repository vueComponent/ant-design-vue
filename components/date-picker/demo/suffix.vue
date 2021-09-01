<docs>
---
order: 13
title:
  zh-CN: 后缀图标
  en-US: Suffix
---

## zh-CN

通过 `suffixIcon` 自定义后缀图标

## en-US

Customize the suffix icon through `suffixIcon`

</docs>

<template>
  <a-space direction="vertical">
    <a-date-picker @change="onChange">
      <template #suffixIcon>
        <SmileOutlined />
      </template>
    </a-date-picker>
    <a-date-picker @change="onChange" placeholder="Select month" picker="month">
      <template #suffixIcon>
        <SmileOutlined />
      </template>
    </a-date-picker>
    <a-range-picker @change="onChange">
      <template #suffixIcon>
        <SmileOutlined />
      </template>
    </a-range-picker>
    <a-date-picker @change="onChange" placeholder="Select week" picker="week">
      <template #suffixIcon>
        <SmileOutlined />
      </template>
    </a-date-picker>
    <a-date-picker suffix-icon="ab" @change="onChange" />
    <a-date-picker suffix-icon="ab" placeholder="Select month" @change="onChange" picker="month"/>
    <a-range-picker suffix-icon="ab" @change="onChange" />
    <a-date-picker suffix-icon="ab" placeholder="Select week" @change="onChange" picker="week"/>
  </a-space>
</template>
<script lang="ts">
import { SmileOutlined } from '@ant-design/icons-vue';
import { Dayjs } from 'dayjs';
import { defineComponent } from 'vue';
export default defineComponent({
  components: {
    SmileOutlined,
  },
  setup() {
    const onChange = (date: Dayjs, dateString: string[]) => {
      console.log(date, dateString);
    };

    return {
      onChange,
    };
  },
});
</script>
