<script>
import axios from 'axios';
const carbonUrls = {
  'vuecomponent.github.io':'//cdn.carbonads.com/carbon.js?serve=CK7DL2JW&placement=vuecomponentgithubio',
  'tangjinzhou.gitee.io':'//cdn.carbonads.com/carbon.js?serve=CK7DL2JN&placement=tangjinzhougiteeio',
};
const carbonUrl = '//cdn.carbonads.com/carbon.js?serve=CK7DL2JW&placement=vuecomponentgithubio' || carbonUrls[location.host];
const isGitee = location.host.indexOf('gitee') !== -1;
export default {
  mounted() {
    this.load();
  },
  watch: {
    $route(e, t) {
      let adId = '#carbonads';
      if(isGitee) {
        adId = '#cf';
      }
      if(e.path !== t.path && this.$el.querySelector(adId)){
        this.$el.innerHTML = "";
        this.load();
      }
      this.adInterval && clearInterval(this.adInterval);
      this.adInterval = setInterval(()=>{
        if(!this.$el.querySelector(adId)){
          this.$el.innerHTML = "";
          this.load();
        }
      }, 20000);

    },
  },
  methods: {
    load() {
      if(isGitee) {
        axios.get('https://api.codefund.app/properties/162/funder.html?template=horizontal')
        .then(function (response) {
          document.getElementById("codefund-ads").innerHTML = response.data;
        });
      } else if(carbonUrl) {
        const e = document.createElement("script");
        e.id = "_carbonads_js";
        e.src = carbonUrl;
        this.$el.appendChild(e);
      }
    },
  },
  render () {
    return (
      isGitee ? <div id="codefund-ads"/> : <div id="carbon-ads"/>
    );
  },
};
</script>
<style>
 #carbon-ads {
  width: 145px;
  position: fixed;
  z-index: 9;
  bottom: 10px;
  right: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 3px;
  font-size: 13px;
  font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
}
#carbon-ads a {
  display: inline-block;
  color: #7f8c8d;
  font-weight: normal;
}
#carbon-ads span {
  color: #7f8c8d;
  display: inline-block;
  margin-bottom: 5px;
}
#carbon-ads img {
  width: 125px;
}
#carbon-ads .carbon-img,
#carbon-ads .carbon-text {
  display: block;
  margin-bottom: 6px;
  font-weight: normal;
  color: #34495e;
}
#carbon-ads .carbon-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}
#carbon-ads .carbon-poweredby {
  color: #aaa ;
  font-weight: normal ;
  line-height: 1.2 ;
}
</style>
