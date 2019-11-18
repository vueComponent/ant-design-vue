<cn>
#### 按钮尺寸
按钮有大、中、小三种尺寸。
通过设置 `size` 为 `large` `small` 分别把按钮设为大、小尺寸。若不设置 `size`，则尺寸为中。
</cn>

<us>
#### Size
Ant Design supports a default button size as well as a large and small size.
If a large or small button is desired, set the `size` property to either `large` or `small` respectively. Omit the `size` property for a button with the default size.
</us>

```tpl
<template>
  <div>
    <a-radio-group :value="size" @change="handleSizeChange">
      <a-radio-button value="large">Large</a-radio-button>
      <a-radio-button value="default">Default</a-radio-button>
      <a-radio-button value="small">Small</a-radio-button>
    </a-radio-group>
    <br /><br />
    <a-button type="primary" :size="size">Primary</a-button>
    <a-button :size="size">Normal</a-button>
    <a-button type="dashed" :size="size">Dashed</a-button>
    <a-button type="danger" :size="size">Danger</a-button>
    <a-button type="link" :size="size">Link</a-button>
    <br />
    <a-button type="primary" shape="circle" icon="download" :size="size" />
    <a-button type="primary" shape="round" icon="download" :size="size">Download</a-button>
    <a-button type="primary" icon="download" :size="size">Download</a-button>
    <br />
    <a-button-group :size="size">
      <a-button type="primary"> <a-icon type="left" />Backward </a-button>
      <a-button type="primary"> Forward<a-icon type="right" /> </a-button>
    </a-button-group>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        size: 'large',
      };
    },
    methods: {
      handleSizeChange(e) {
        this.size = e.target.value;
      },
    },
  };
</script>
```
