<cn>
#### 自定义分页
自定义分页展示。
</cn>

<us>
#### Custom Paging
Custom paging display
</us>

```html
<template>
  <a-carousel arrows dotsClass="slick-dots slick-thumb">
    <a slot="customPaging" slot-scope="props">
      <img :src="getImgUrl(props.i)" />
    </a>
    <div>
      <img :src="imgList['abstract01']" />
    </div>
    <div>
      <img :src="imgList['abstract02']" />
    </div>
    <div>
      <img :src="imgList['abstract03']" />
    </div>
    <div>
      <img :src="imgList['abstract04']" />
    </div>
  </a-carousel>
</template>
<script>
import imgList from '../../vc-slick/demo/imglist'
export default {
  data() {
    return {
      imgList,
    }
  },
  methods: {
    getImgUrl(i) {
      return this.imgList[`abstract0${i + 1}`]
    }
  }
}
</script>
<style scoped>
/* For demo */
.ant-carousel >>> .slick-dots {
  height: auto
}
.ant-carousel >>> .slick-slide img{
    border: 5px solid #FFF;
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
.ant-carousel >>> .slick-thumb li.slick-active img{
    filter: grayscale(0%);
}
</style>
```
