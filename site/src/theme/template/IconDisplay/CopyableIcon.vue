<template>
  <li
    v-clipboard:copy="text"
    v-clipboard:success="onCopied"
    :class="justCopied === type ? 'copied' : ''"
  >
    <component :is="allIcons[name]"></component>
    <span class="anticon-class">
      <a-badge :dot="isNew">
        {{ kebabCasedType }}
      </a-badge>
    </span>
  </li>
</template>
<script>
import * as AntdIcons from '@ant-design/icons-vue';
import { Badge } from 'ant-design-vue';
import { defineComponent } from 'vue';

const allIcons = AntdIcons;

const kebabCase = function kebabCase(str) {
  return str
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase();
};

export default defineComponent({
  components: {
    'a-badge': Badge,
  },
  props: ['name', 'type', 'isNew', 'theme', 'justCopied'],
  data() {
    const kebabCasedName = kebabCase(this.name);
    const kebabCasedType = kebabCase(this.type);

    this.allIcons = allIcons;

    return {
      text: `<${kebabCasedName} />`,
      kebabCasedType,
    };
  },
  methods: {
    onCopied() {
      this.$emit('copied', this.type, this.text);
    },
  },
});
</script>
