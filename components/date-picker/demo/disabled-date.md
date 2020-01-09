<cn>
#### 不可选择日期和时间
可用 `disabledDate` 和 `disabledTime` 分别禁止选择部分日期和时间，其中 `disabledTime` 需要和 `showTime` 一起使用。
</cn>

<us>
#### Disabled Date & Time
Disabled part of dates and time by `disabledDate` and `disabledTime` respectively, and `disabledTime` only works with `showTime`.
</us>

```tpl
<template>
  <div>
    <a-date-picker
      format="YYYY-MM-DD HH:mm:ss"
      :disabledDate="disabledDate"
      :disabledTime="disabledDateTime"
      :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
    />
    <br />
    <a-month-picker :disabledDate="disabledDate" placeholder="Select month" />
    <br />
    <a-range-picker
      :disabledDate="disabledDate"
      :disabledTime="disabledRangeTime"
      :showTime="{
        hideDisabledOptions: true,
        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')]
      }"
      format="YYYY-MM-DD HH:mm:ss"
    />
  </div>
</template>
<script>
  import moment from 'moment';
  export default {
    methods: {
      moment,
      range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      },

      disabledDate(current) {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
      },

      disabledDateTime() {
        return {
          disabledHours: () => this.range(0, 24).splice(4, 20),
          disabledMinutes: () => this.range(30, 60),
          disabledSeconds: () => [55, 56],
        };
      },

      disabledRangeTime(_, type) {
        if (type === 'start') {
          return {
            disabledHours: () => this.range(0, 60).splice(4, 20),
            disabledMinutes: () => this.range(30, 60),
            disabledSeconds: () => [55, 56],
          };
        }
        return {
          disabledHours: () => this.range(0, 60).splice(20, 4),
          disabledMinutes: () => this.range(0, 31),
          disabledSeconds: () => [55, 56],
        };
      },
    },
  };
</script>
```
