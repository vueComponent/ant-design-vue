<cn>
#### 动态
  展示动态变化的效果。
</cn>

<us>
#### Dynamic
  The count will be animated as it changes.
</us>

```tpl
<template>
  <div>
    <div>
      <a-badge :count="count">
        <a href="#" class="head-example" />
      </a-badge>
      <a-button-group>
        <a-button @click="decline">
          <a-icon type="minus" />
        </a-button>
        <a-button @click="increase">
          <a-icon type="plus" />
        </a-button>
      </a-button-group>
    </div>
    <div style="margin-top: 10px">
      <a-badge :dot="show">
        <a href="#" class="head-example" />
      </a-badge>
      <a-switch v-model="show" />
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        count: 5,
        show: true,
      };
    },
    methods: {
      decline() {
        let count = this.count - 1;
        if (count < 0) {
          count = 0;
        }
        this.count = count;
      },
      increase() {
        this.count++;
      },
    },
  };
</script>
```
