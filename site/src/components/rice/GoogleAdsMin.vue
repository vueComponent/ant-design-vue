<template>
  <div
    style="
      width: 300px;
      float: right;
      margin-top: 75px;
      position: relative;
      right: 0;
      bottom: 0;
      padding: 0;
      z-index: 9;
    "
  >
    <ins
      ref="ins"
      class="adsbygoogle"
      style="display: inline-block; width: 300px; height: 100px"
      data-ad-client="ca-pub-4801326429087140"
      data-ad-slot="2774992529"
    ></ins>
  </div>
</template>
<script>
export default {
  mounted() {
    this.load();
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
};
</script>
