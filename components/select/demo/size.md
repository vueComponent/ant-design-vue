<cn>
#### 三种大小
三种大小的选择框，当 size 分别为 `large` 和 `small` 时，输入框高度为 `40px` 和 `24px` ，默认高度为 `32px`。
</cn>

<us>
#### Sizes
The height of the input field for the select defaults to 32px. If size is set to large, the height will be 40px, and if set to small, 24px.
</us>

```tpl
<template>
  <div>
    <a-radio-group v-model="size">
      <a-radio-button value="large">Large</a-radio-button>
      <a-radio-button value="default">Default</a-radio-button>
      <a-radio-button value="small">Small</a-radio-button>
    </a-radio-group>
    <br /><br />
    <a-select :size="size" defaultValue="a1" style="width: 200px" @change="handleChange">
      <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
        {{(i + 9).toString(36) + i}}
      </a-select-option>
    </a-select>
    <br />
    <a-select
      mode="multiple"
      :size="size"
      placeholder="Please select"
      :defaultValue="['a1', 'b2']"
      style="width: 200px"
      @change="handleChange"
      @popupScroll="popupScroll"
    >
      <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
        {{(i + 9).toString(36) + i}}
      </a-select-option>
    </a-select>
    <br />
    <a-select
      mode="tags"
      :size="size"
      placeholder="Please select"
      :defaultValue="['a1', 'b2']"
      style="width: 200px"
      @change="handleChange"
    >
      <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
        {{(i + 9).toString(36) + i}}
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        size: 'default',
      };
    },
    methods: {
      handleChange(value) {
        console.log(`Selected: ${value}`);
      },
      popupScroll() {
        console.log('popupScroll');
      },
    },
  };
</script>
```
