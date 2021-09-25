<template>
  <demo-sort>
    <basic />
    <autosize-textarea />
    <presuffix />
    <search-input />
    <search-input-loading />
    <size />
    <group />
    <addon />
    <tooltip />
    <allow-clear />
    <password-input />
    <show-count />
    <textarea-resize />
  </demo-sort>
</template>

<script>
import Basic from './basic.vue';
import AutosizeTextarea from './autosize-textarea.vue';
import Presuffix from './presuffix.vue';
import SearchInput from './search-input.vue';
import SearchInputLoading from './search-input-loading.vue';
import Size from './size.vue';
import Group from './group.vue';
import TextareaResize from './textarea.vue';
import AllowClear from './allow-clear.vue';
import PasswordInput from './password-input.vue';
import ShowCount from './show-count.vue';
import Addon from './addon.vue';
import Tooltip from './tooltip.vue';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    AutosizeTextarea,
    Presuffix,
    SearchInput,
    SearchInputLoading,
    Size,
    Group,
    TextareaResize,
    Addon,
    Tooltip,
    AllowClear,
    PasswordInput,
    ShowCount,
  },
});
</script>
<style></style>
