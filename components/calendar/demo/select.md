<cn>
#### 选择功能
一个通用的日历面板，支持年/月切换。
</cn>

<us>
#### Selectable Calendar
A basic calendar component with Year/Month switch.
</us>

```tpl
<template>
  <div>
    <a-alert
      :message="`You selected date: ${selectedValue && selectedValue.format('YYYY-MM-DD')}`"
    />
    <div
      :style="{ display: 'inline-block', width: '500px', border: '1px solid #d9d9d9', borderRadius: '4px' }"
    >
      <a-calendar :value="value" @select="onSelect" @panelChange="onPanelChange" />
    </div>
    <div
      :style="{ display: 'inline-block', width: '500px',marginLeft: '20px', border: '1px solid #d9d9d9', borderRadius: '4px' }"
    >
      <a-calendar v-model="value1" />
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  export default {
    data() {
      return {
        value: moment('2017-01-25'),
        selectedValue: moment('2017-01-25'),
        value1: moment('2017-01-25'),
      };
    },
    methods: {
      onSelect(value) {
        this.value = value;
        this.selectedValue = value;
      },
      onPanelChange(value) {
        this.value = value;
      },
    },
  };
</script>
```
