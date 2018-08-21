<template>
  <div
      style="fontSize: 14px;lineHeight: 22px;marginBottom: 7px;color: rgba(0,0,0,0.65)"
    >
      <p
        style="marginRight: 8px;display: inline-block;color: rgba(0,0,0,0.85)"
      >
        {{title}}
      </p>
      <template v-if="content">{{content}}</template>
      <slot name="content" v-else></slot>
    </div>
</template>
<script>
export default {
  props: {
    title: String,
    content: String,
  },
}
</script>

