<script>
export default {
  props: {
    isMobile: Boolean,
  },
  watch: {
    $route(e, t) {
      if (e.path !== t.path && this.$refs.ins && this.$refs.ins.innerHTML) {
        this.$nextTick(() => {
          this.load();
        });
      }
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      if (this.scriptDom) {
        this.$el.removeChild(this.scriptDom);
      }
      this.$refs.ins.innerHTML = '';
      window.adsbygoogle = undefined;
      const e = document.createElement('script');
      e.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      e.async = true;
      this.$el.appendChild(e);
      this.scriptDom = e;
      (adsbygoogle = window.adsbygoogle || []).push({});
    },
  },
  render() {
    return (
      <div id="google-ads">
        <ins
          ref="ins"
          class="adsbygoogle"
          style="display:block"
          data-ad-client="ca-pub-4801326429087140"
          data-ad-slot="7647023136"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    );
  },
};
</script>
