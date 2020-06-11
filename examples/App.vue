<template>
  <div>
    <a-button @click="show = !show">按钮</a-button>
    <a-tooltip class="ddddd" style="color: blue" v-if="show">
      <template v-slot:title>prompt text</template>
      <a-button class="test" style="color: red">Tooltip will show when mouse enter.</a-button>
    </a-tooltip>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: true,
    };
  },
};
</script>
