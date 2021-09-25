<template>
  <div id="carbon-ads" :class="isMobile ? 'carbon-mobile' : ''" />
</template>
<script>
const carbonUrls = {
  'www.antdv.com': '//cdn.carbonads.com/carbon.js?serve=CK7DL2JW&placement=antdvcom',
  // 'tangjinzhou.gitee.io':
  //   '//cdn.carbonads.com/carbon.js?serve=CK7DL2JN&placement=tangjinzhougiteeio',
  // 'ant-design-vue.gitee.io':
  //   '//cdn.carbonads.com/carbon.js?serve=CK7DL2JN&placement=antdesignvuegiteeio',
  'vue.ant.design': '//cdn.carbonads.com/carbon.js?serve=CK7DL2JW&placement=vueantdesign',
};
const carbonUrl =
  carbonUrls[location.host] ||
  '//cdn.carbonads.com/carbon.js?serve=CK7DL2JW&placement=vueantdesign';
export default {
  props: {
    isMobile: Boolean,
  },
  watch: {
    $route(e, t) {
      let adId = '#carbonads';
      // if(isGitee) {
      //   adId = '#cf';
      // }
      if (e.path !== t.path && this.$el.querySelector(adId)) {
        this.$el.innerHTML = '';
        this.load();
      }
      this.adInterval && clearInterval(this.adInterval);
      this.adInterval = setInterval(() => {
        if (!this.$el.querySelector(adId)) {
          this.$el.innerHTML = '';
          this.load();
        }
      }, 20000);
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      // if(isGitee) {
      //   axios.get('https://api.codefund.app/properties/162/funder.html?template=horizontal')
      //   .then(function (response) {
      //     document.getElementById("codefund-ads").innerHTML = response.data;
      //   });
      // } else
      if (carbonUrl) {
        const e = document.createElement('script');
        e.id = '_carbonads_js';
        e.src = carbonUrl;
        this.$el.appendChild(e);
      }
    },
  },
};
</script>
<style lang="less">
#carbon-ads {
  width: 280px;
  float: right;
  margin-top: 75px;
  position: relative;
  right: 0;
  bottom: 0;
  padding: 0;
  overflow: hidden;
  z-index: 9;
  background-color: #fff;
  border-radius: 3px;
  font-size: 13px;
  background: #f5f5f5;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
}
#carbonads {
  overflow: hidden;
}
#carbon-ads a {
  display: inline-block;
  color: #7f8c8d;
  font-weight: normal;
}
#carbon-ads span {
  color: #7f8c8d;
}
#carbon-ads img {
  float: left;
  padding-right: 10px;
}
#carbon-ads .carbon-img,
#carbon-ads .carbon-text {
  display: block;
  font-weight: normal;
  color: #34495e;
}
#carbon-ads .carbon-text {
  padding-top: 6px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}
#carbon-ads .carbon-poweredby {
  color: #aaa;
  font-weight: normal;
  line-height: 1.2;
  margin-top: 6px;
}
#carbon-ads.carbon-mobile {
  width: 100%;
  position: relative;
  right: 0;
  bottom: 0;
  padding: 0;
  margin-bottom: 15px;
  margin-top: 5px;
  .carbon-img {
    float: left;
    margin-right: 10px;
  }
}
</style>
