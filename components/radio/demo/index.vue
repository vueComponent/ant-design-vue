<template>
  <demo-sort>
    <basic />
    <disabled />
    <radio-button />
    <radio-button-solid />
    <radio-group-more />
    <radio-group-options />
    <radio-group-with-name />
    <radio-group />
    <size />
  </demo-sort>
</template>

<script>
import Basic from './basic.vue';
import Disabled from './disabled.vue';
import RadioButton from './radioButton.vue';
import RadioGroupMore from './radioGroup-more.vue';
import RadioGroupOptions from './radioGroup-options.vue';
import RadioGroupWithName from './radioGroup-with-name.vue';
import RadioGroup from './radioGroup.vue';
import RadioButtonSolid from './radioButton-solid.vue';
import Size from './size.vue';

import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
import { defineComponent } from 'vue';

export default defineComponent({
  CN,
  US,
  components: {
    Basic,
    Disabled,
    RadioButton,
    RadioButtonSolid,
    RadioGroupMore,
    RadioGroupOptions,
    RadioGroupWithName,
    RadioGroup,
    Size,
  },
});
</script>
