<template>
  <slot></slot>
</template>
<script lang="ts" setup>
import useSiteToken from './hooks/useSiteToken';
useSiteToken();
</script>
