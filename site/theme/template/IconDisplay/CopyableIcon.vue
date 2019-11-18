<template>
  <li
    v-clipboard:copy="text"
    v-clipboard:success="onCopied"
    :class="justCopied === type ? 'copied' : ''"
  >
    <a-icon :type="type" :theme="theme" />
    <span class="anticon-class">
      <a-badge :dot="isNew">
        {{ type }}
      </a-badge>
    </span>
  </li>
</template>
<script>
export default {
  props: ['type', 'isNew', 'theme', 'justCopied'],
  data() {
    const { type, theme } = this;
    return {
      text:
        theme === 'outlined'
          ? `<a-icon type="${type}" />`
          : `<a-icon type="${type}" theme="${theme}" />`,
    };
  },
  methods: {
    onCopied() {
      this.$emit('copied', this.type, this.text);
    },
  },
};
</script>
