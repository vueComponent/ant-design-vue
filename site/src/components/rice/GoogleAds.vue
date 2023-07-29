<template>
  <div v-if="false" id="api" class="google-ads">
    <ins
      ref="ins"
      class="adsbygoogle"
      style="display: block"
      data-ad-client="ca-pub-4801326429087140"
      data-ad-slot="7647023136"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  </div>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  mounted() {
    // this.load();
  },
  methods: {
    load() {
      if (this.scriptDom) {
        this.$el.removeChild(this.scriptDom);
      }
      this.$refs.ins.innerHTML = '';
      const e = document.createElement('script');
      e.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      e.async = true;
      this.$el.appendChild(e);
      this.scriptDom = e;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    },
  },
});
</script>
