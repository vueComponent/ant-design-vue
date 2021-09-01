<docs>
---
order: 2
title:
  zh-CN: 自动调整字符大小
  en-US: Autoset Font Size
---

## zh-CN

对于字符型的头像，当字符串较长时，字体大小可以根据头像宽度自动调整。

## en-US

For letter type Avatar, when the letters are too long to display, the font size can be automatically adjusted according to the width of the Avatar.
</docs>

<template>
  <a-avatar
    shape="square"
    size="large"
    :style="{ backgroundColor: color, verticalAlign: 'middle' }"
  >
    {{ avatarValue }}
  </a-avatar>
  <a-button
    size="small"
    :style="{ marginLeft: '16px', verticalAlign: 'middle' }"
    @click="changeValue"
  >
    改变
  </a-button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
export default defineComponent({
  setup() {
    const avatarValue = ref(UserList[0]);
    const color = ref(colorList[0]);
    const changeValue = () => {
      const index = UserList.indexOf(avatarValue.value);
      avatarValue.value = index < UserList.length - 1 ? UserList[index + 1] : UserList[0];
      color.value = index < colorList.length - 1 ? colorList[index + 1] : colorList[0];
    };
    return {
      avatarValue,
      color,
      changeValue,
    };
  },
});
</script>
