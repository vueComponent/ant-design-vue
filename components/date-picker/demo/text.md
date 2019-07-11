
<cn>
#### 自定义渲染
增加选择时间功能，当 `showTime` 为一个对象时，其属性会传递给内建的 `TimePicker`。
</cn>

<us>
#### Custum Time
This property provide an additional time selection. When `showTime` is an Object, its properties will be passed on to built-in `TimePicker`.
</us>

```html
<template>
  <div>
    <a-date-picker
      placeholder="Select Time"
      v-model="time1"
      @change="onChange"
      @ok="onOk"
    >
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
import moment from 'moment'
export default {
    data(){
        return {
            time1:undefined,
            time2:undefined
        }
    },
  methods: {
    onChange(value, dateString) {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
    },
    onOk(value) {
      console.log('onOk: ', value);
    },
    clearTime(){
      this.time1 = undefined
    }
  }
}
</script>
```

