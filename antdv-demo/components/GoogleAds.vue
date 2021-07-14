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
  render() {
    return (
      <div class="google-ads" id="API">
        <ins
          ref="ins"
          class="adsbygoogle"
          data-ad-client="ca-pub-4801326429087140"
          data-ad-slot="7647023136"
          style="display: inline-block; width: 728px; height: 90px"
        ></ins>
      </div>
    );
  },
};
</script>
