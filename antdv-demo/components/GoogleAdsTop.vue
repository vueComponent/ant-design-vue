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
      <div class="google-ads">
        <ins
          ref="ins"
          style="display:block"
          class="adsbygoogle"
          data-ad-client="ca-pub-4801326429087140"
          data-ad-slot="2425414214"
          data-ad-format="auto"
        ></ins>
      </div>
    );
  },
};
</script>
