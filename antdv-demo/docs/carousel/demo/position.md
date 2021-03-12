<cn>
#### 位置
位置有 4 个方向。
</cn>

<us>
#### Position
There are 4 position options available.
</us>

```vue
<template>
  <div>
    <a-radio-group v-model="dotPosition" style="margin-bottom: 8px">
      <a-radio-button value="top">
        Top
      </a-radio-button>
      <a-radio-button value="bottom">
        Bottom
      </a-radio-button>
      <a-radio-button value="left">
        Left
      </a-radio-button>
      <a-radio-button value="right">
        Right
      </a-radio-button>
    </a-radio-group>
    <a-carousel :dot-position="dotPosition">
      <div><h3>1</h3></div>
      <div><h3>2</h3></div>
      <div><h3>3</h3></div>
      <div><h3>4</h3></div>
    </a-carousel>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dotPosition: 'top',
    };
  },
};
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

.ant-carousel >>> .slick-slide h3 {
  color: #fff;
}
</style>
```
