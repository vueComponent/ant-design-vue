<template>
  <div style="font-size: 14px; line-height: 22px; margin-bottom: 7px; color: rgba(0, 0, 0, 0.65)">
    <p style="margin-right: 8px; display: inline-block; color: rgba(0, 0, 0, 0.85)">
      {{ title }}：
    </p>
    <template v-if="content">
      {{ content }}
    </template>
    <slot v-else name="content" />
  </div>
</template>
<script lang="ts" setup>
interface Props {
  title: string;
  content?: string;
}
defineProps<Props>();
</script>
