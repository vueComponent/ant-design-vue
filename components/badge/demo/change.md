<cn>
#### 动态
  展示动态变化的效果。
</cn>

<us>
#### Dynamic
  The count will be animated as it changes.
</us>

```html
<template>
  <a-badge :count="count">
    <a href="#" class="head-example"></a>
  </a-badge>
  <a-button-group>
    <a-button @click="decline">
      <a-icon type="minus"></a-icon>
    </a-button>
    <a-button @click="increase">
      <a-icon type="plus"></a-icon>
    </a-button>
  </a-button-group>
  <br />
  <a-badge :dot="isShow">
    <a href="#" class="head-example()"></a>
  </a-badge>
  <a-button @click="changeShow()">toggle</a-button>
</template>
<script>
export default {
  data(){
    return {
      count: 3,
      isShow: true,
    }
  },
  methods: {
    decline () {
      let count = this.count - 1
      if (count < 0) {
        count = 0
      }
      this.count = count
    },
    increase () {
      const count = this.count+1
      this.count = count // 为什么不用this.count++?省事还简单？
    },
    changeShow () {
      this.isShow = !this.isShow
    }
  }
}
</script>     
```
