<template>
  <div class="flex h-[200vh] flex-col gap-2">
    <a-affix :offset-top="top" @change="onChange">
      <a-button type="primary" @click="top += 10">Affix top</a-button>
    </a-affix>
    <br />
    <a-affix :offset-bottom="bottom">
      <a-button type="primary" @click="bottom += 10">Affix bottom</a-button>
    </a-affix>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const top = ref<number>(10)
const bottom = ref<number>(10)
const onChange = (lastAffix: boolean) => {
  console.log('onChange', lastAffix)
}
</script>
