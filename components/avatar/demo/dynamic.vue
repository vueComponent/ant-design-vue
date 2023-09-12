<docs>
---
order: 2
title:
  zh-CN: 自动调整字符大小
  en-US: Autoset Font Size
---

## zh-CN

对于字符型的头像，当字符串较长时，字体大小可以根据头像宽度自动调整。也可使用 `gap`` 来设置字符距离左右两侧边界单位像素。

## en-US

For letter type Avatar, when the letters are too long to display, the font size can be automatically adjusted according to the width of the Avatar. You can also use `gap` to set the unit distance between left and right sides.
</docs>

<template>
  <a-avatar size="large" :style="{ backgroundColor: color, verticalAlign: 'middle' }" :gap="gap">
    {{ avatarValue }}
  </a-avatar>
  <a-button size="small" :style="{ margin: '0 16px', verticalAlign: 'middle' }" @click="changeUser">
    ChangeUser
  </a-button>
  <a-button size="small" :style="{ verticalAlign: 'middle' }" @click="changeGap">
    ChangeGap
  </a-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const avatarValue = ref(UserList[0]);
const color = ref(colorList[0]);
const changeUser = () => {
  const index = UserList.indexOf(avatarValue.value);
  avatarValue.value = index < UserList.length - 1 ? UserList[index + 1] : UserList[0];
  color.value = index < colorList.length - 1 ? colorList[index + 1] : colorList[0];
};

const GapList = [4, 3, 2, 1];
const gap = ref(GapList[0]);
const changeGap = () => {
  const index = GapList.indexOf(gap.value);
  gap.value = index < GapList.length - 1 ? GapList[index + 1] : GapList[0];
};
</script>
