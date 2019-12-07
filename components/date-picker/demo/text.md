<cn>
#### 自定义渲染
增加自定义渲染功能，在默认 `slot` 中，你可以设置任何你想渲染的组件。
</cn>

<us>
#### Custum Time
Added custom rendering function, in the default `slot', you can set any component you want to render..
</us>

```tpl
<template>
  <div>
    <a-date-picker placeholder="Select Time" v-model="time1" @change="onChange" @ok="onOk">
      <span>{{time1?time1:'SelectTime'}}</span>
    </a-date-picker>
    <br />
    <a-range-picker v-model="time2">
      <span>
        {{time2?time2:'请选择'}}
      </span>
    </a-range-picker>
  </div>
</template>
<script>
  import moment from 'moment';
  export default {
    data() {
      return {
        time1: undefined,
        time2: undefined,
      };
    },
    methods: {
      onChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
      },
      onOk(value) {
        console.log('onOk: ', value);
      },
      clearTime() {
        this.time1 = undefined;
      },
    },
  };
</script>
```
