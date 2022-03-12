<template>
  <div id="rice">
    <div class="wwads-cn wwads-vertical" data-id="62" style="max-width: 200px"></div>
  </div>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  // mounted() {
  //   // this.load();
  // },
  // methods: {
  //   load() {
  //     if (this.scriptDom) {
  //       this.$el.removeChild(this.scriptDom);
  //     }
  //     this.$refs.inner.innerHTML = '';
  //     const e = document.createElement('script');
  //     e.src = 'https://wwads.cn/js/makemoney.js';
  //     e.async = true;
  //     this.$el.appendChild(e);
  //     this.scriptDom = e;
  //   },
  // },
});
</script>
<style scoped>
#rice {
  width: 125px;
  position: fixed;
  z-index: 19;
  bottom: 10px;
  right: 10px;
  padding: 10px;
  border-radius: 3px;
  font-size: 13px;
}
</style>
