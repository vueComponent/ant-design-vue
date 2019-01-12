<template>
<li :class="justCopied ? 'copied' : ''" v-clipboard:copy="text"
      v-clipboard:success="onCopied">
  <a-icon :type="type" />
  <span class='anticon-class'>
    <a-badge :dot="isNew">
      {{type}}
    </a-badge>
  </span>
</li>
</template>
<script>
import BaseMixin from 'antd/_util/BaseMixin';

export default {
  mixins: [BaseMixin],
  props: {
    type: String,
    isNew: Boolean,
  },
  data () {
    return {
      justCopied: false,
      text: `<a-icon type="${this.type}" />`,
    };
  },
  methods: {
    onCopied () {
      this.setState({ justCopied: true }, () => {
        setTimeout(() => {
          this.setState({ justCopied: false });
        }, 2000);
      });
    },
  },
};
</script>
