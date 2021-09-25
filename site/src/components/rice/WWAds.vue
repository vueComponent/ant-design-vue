<template>
  <div>
    <div ref="inner" class="wwads-cn wwads-horizontal" data-id="62" style="max-width: 350px"></div>
  </div>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  mounted() {
    this.load();
  },
  methods: {
    load() {
      if (this.scriptDom) {
        this.$el.removeChild(this.scriptDom);
      }
      this.$refs.inner.innerHTML = '';
      const e = document.createElement('script');
      e.src = 'https://wwads.cn/js/makemoney.js';
      e.async = true;
      this.$el.appendChild(e);
      this.scriptDom = e;
    },
  },
});
</script>
