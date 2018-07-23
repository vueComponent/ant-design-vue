<cn>
#### 自定义箭头
自定义箭头展示。
</cn>

<us>
#### Custom Arrows
Custom arrows display
</us>

```html
<template>
  <a-carousel arrows>
    <template slot="prevArrow" slot-scope="props">
      <div
        class="custom-slick-arrow"
      >
        <a-icon type="left-square" />
      </div>
    </template>
    <template slot="nextArrow" slot-scope="props">
      <div
        class="custom-slick-arrow"
        style="right: -20px"
      >
        <a-icon type="right-square" />
      </div>
    </template>
    <div><h3>1</h3></div>
    <div><h3>2</h3></div>
    <div><h3>3</h3></div>
    <div><h3>4</h3></div>
  </a-carousel>
</template>
<script>
export default {}
</script>
<style scoped>
/* For demo */
.ant-carousel >>> .slick-slide {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel >>> .custom-slick-arrow {
  display: block;
  font-size: 25px;
  background: #fff;
  color: #5d5959;
}
.ant-carousel >>> .custom-slick-arrow:before {
  display: none;
}
.ant-carousel >>> .custom-slick-arrow:hover {
  color: #403d3d
}

.ant-carousel >>> .slick-slide  h3 {
  color: #fff;
}
</style>
```
