<cn>
#### 按钮样式
按钮样式的单选组合。
</cn>

<us>
#### radio style
The combination of radio button style.
</us>

```tpl
<template>
  <div>
    <div>
      <a-radio-group @change="onChange" v-model="value">
        <a-radio-button value="a">Hangzhou</a-radio-button>
        <a-radio-button value="b">Shanghai</a-radio-button>
        <a-radio-button value="c">Beijing</a-radio-button>
        <a-radio-button value="d">Chengdu</a-radio-button>
      </a-radio-group>
    </div>
    <div :style="{ marginTop: '16px' }">
      <a-radio-group @change="onChange" defaultValue="a">
        <a-radio-button value="a">Hangzhou</a-radio-button>
        <a-radio-button value="b" disabled>Shanghai</a-radio-button>
        <a-radio-button value="c">Beijing</a-radio-button>
        <a-radio-button value="d">Chengdu</a-radio-button>
      </a-radio-group>
    </div>
    <div :style="{ marginTop: '16px' }">
      <a-radio-group disabled @change="onChange" defaultValue="a">
        <a-radio-button value="a">Hangzhou</a-radio-button>
        <a-radio-button value="b">Shanghai</a-radio-button>
        <a-radio-button value="c">Beijing</a-radio-button>
        <a-radio-button value="d">Chengdu</a-radio-button>
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
