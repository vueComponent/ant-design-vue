<cn>
#### 按钮样式
按钮样式的单选组合。
</cn>

<us>
#### radio style
The combination of radio button style.
</us>

```vue
<template>
  <div>
    <div>
      <a-radio-group v-model="value" @change="onChange">
        <a-radio-button value="a">
          Hangzhou
        </a-radio-button>
        <a-radio-button value="b">
          Shanghai
        </a-radio-button>
        <a-radio-button value="c">
          Beijing
        </a-radio-button>
        <a-radio-button value="d">
          Chengdu
        </a-radio-button>
      </a-radio-group>
    </div>
    <div :style="{ marginTop: '16px' }">
      <a-radio-group default-value="a" @change="onChange">
        <a-radio-button value="a">
          Hangzhou
        </a-radio-button>
        <a-radio-button value="b" disabled>
          Shanghai
        </a-radio-button>
        <a-radio-button value="c">
          Beijing
        </a-radio-button>
        <a-radio-button value="d">
          Chengdu
        </a-radio-button>
      </a-radio-group>
    </div>
    <div :style="{ marginTop: '16px' }">
      <a-radio-group disabled default-value="a" @change="onChange">
        <a-radio-button value="a">
          Hangzhou
        </a-radio-button>
        <a-radio-button value="b">
          Shanghai
        </a-radio-button>
        <a-radio-button value="c">
          Beijing
        </a-radio-button>
        <a-radio-button value="d">
          Chengdu
        </a-radio-button>
      </a-radio-group>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: 'a',
    };
  },
  methods: {
    onChange(e) {
      console.log(`checked = ${e.target.value}`);
    },
  },
};
</script>
```
