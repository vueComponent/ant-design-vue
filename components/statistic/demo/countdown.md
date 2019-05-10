<cn>
#### 倒计时
倒计时组件。
</cn>

<us>
#### Countdown
Countdown component.
</us>

```html
<template>
  <div>
    <a-statistic-countdown
      title="Countdown"
      :value="deadline"
      @finish="onFinish"
      style="margin-right: 50px"
    />
    <a-statistic-countdown
      title="Million Seconds"
      :value="deadline"
      format="HH:mm:ss:SSS"
    />
  </div>
</template>
<script>
export default {
  data () {
    return {
      deadline: Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30,
    }
  },
  methods: {
    onFinish() {
      console.log('over');
    },
  },
}
</script>
```