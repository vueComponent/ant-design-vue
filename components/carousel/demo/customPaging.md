<cn>
#### 自定义分页
自定义分页展示。
</cn>

<us>
#### Custom Paging
Custom paging display
</us>

```tpl
<template>
  <a-carousel arrows dotsClass="slick-dots slick-thumb">
    <a slot="customPaging" slot-scope="props">
      <img :src="getImgUrl(props.i)" />
    </a>
    <div v-for="item in 4">
      <img :src="baseUrl+'abstract0'+item+'.jpg'" />
    </div>
  </a-carousel>
</template>
<script>
  const baseUrl =
    'https://raw.githubusercontent.com/vueComponent/ant-design-vue/master/components/vc-slick/assets/img/react-slick/';
  export default {
    data() {
      return {
        baseUrl,
      };
    },
    methods: {
      getImgUrl(i) {
        return `${baseUrl}abstract0${i + 1}.jpg`;
      },
    },
  };
</script>
<style scoped>
  /* For demo */
  .ant-carousel >>> .slick-dots {
    height: auto;
  }
  .ant-carousel >>> .slick-slide img {
    border: 5px solid #fff;
    display: block;
    margin: auto;
    max-width: 80%;
  }
  .ant-carousel >>> .slick-thumb {
    bottom: -45px;
  }
  .ant-carousel >>> .slick-thumb li {
    width: 60px;
    height: 45px;
  }
  .ant-carousel >>> .slick-thumb li img {
    width: 100%;
    height: 100%;
    filter: grayscale(100%);
  }
  .ant-carousel >>> .slick-thumb li.slick-active img {
    filter: grayscale(0%);
  }
</style>
```
