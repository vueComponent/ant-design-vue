
<cn>
#### 自定义日期范围选择
当 `RangePicker` 无法满足业务需求时，可以使用两个 `DatePicker` 实现类似的功能。
> * 通过设置 `disabledDate` 方法，来约束开始和结束日期。
> * 通过 `open` `onOpenChange` 来优化交互。
</cn>

<us>
#### Customized Range Picker
When `RangePicker` does not satisfied your requirements, try to implement similar functionality with two `DatePicker`.
> * Use the `disabledDate` property to limit the start and end dates.
> * Improve user experience with `open` and `onOpenChange`.
</us>

```html
<template>
  <div>
    <a-date-picker
      :disabledDate="disabledStartDate"
      showTime
      format="YYYY-MM-DD HH:mm:ss"
      :value="startValue"
      placeholder="Start"
      @change="onStartChange"
      @openChange="handleStartOpenChange"
    />
    <a-date-picker
      :disabledDate="disabledEndDate"
      showTime
      format="YYYY-MM-DD HH:mm:ss"
      :value="endValue"
      placeholder="End"
      @change="onEndChange"
      :open="endOpen"
      @openChange="handleEndOpenChange"
    />
  </div>
</template>
<script>
export default {
  data () {
    return {
      startValue: null,
      endValue: null,
      endOpen: false,
    }
  },
  methods: {
    disabledStartDate (startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate (endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    onStartChange (value) {
      this.startValue = value;
    },
    onEndChange (value) {
      this.endValue = value
    },
    handleStartOpenChange (open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange (open) {
      this.endOpen = open;
    },
  },
}
</script>
```
