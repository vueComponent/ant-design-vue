<template>
  <a-empty
    class="ddd"
    image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
    :image-style="{
      height: '60px',
    }"
  >
    <template v-slot:description>
      <span> Customize <a href="#API">Description</a> </span>
    </template>
    <a-button type="primary">
      Create Now
    </a-button>
  </a-empty>
</template>
