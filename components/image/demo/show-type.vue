<docs>
---
order: 7
title:
  zh-CN: 自定义预览选项
  en-US: Customize Preview Options
---

## zh-CN

可控制预览选项仅显示图标或仅显示文字或都显示。

## en-US

control the preview options to display only icons or only text or both.

</docs>

<template>
  <div>
    <div>
      <a-image
        :width="200"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
    </div>
    <div style="margin: 10px 0">
      <a-image
        :width="200"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        show-type="icon"
      />
    </div>
    <div>
      <a-image
        :width="200"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        show-type="text"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({});
</script>
