<template>
  <a-radio-group v-model:value="size">
    <a-radio-button value="large">Large</a-radio-button>
    <a-radio-button value="default">Default</a-radio-button>
    <a-radio-button value="small">Small</a-radio-button>
  </a-radio-group>
  <br />
  <br />
  <a-space direction="vertical">
    <a-select
      v-model:value="value1"
      :size="size"
      style="width: 200px"
      :options="options"
    ></a-select>
    <!-- <a-select
      v-model:value="value2"
      :options="options"
      mode="multiple"
      :size="size"
      placeholder="Please select"
      style="width: 200px"
      @popupScroll="popupScroll"
    >
    </a-select>
    <a-select
      v-model:value="value3"
      :options="options"
      mode="tags"
      :size="size"
      placeholder="Please select"
      style="width: 200px"
    >
    </a-select> -->
  </a-space>
</template>
<script>
import demo from '../v2-doc/src/docs/calendar/demo/index.vue';
// import Affix from '../components/affix';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const popupScroll = () => {
      console.log('popupScroll');
    };

    return {
      popupScroll,
      size: ref('default'),
      value1: ref('t20'),
      value2: ref(['a1', 'b2']),
      value3: ref(['a1', 'b2']),
      options: [...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) })),
    };
  },
});
</script>
<style>
.ant-select-dropdown {
  /* top: 140px !important;
  left: 50px !important; */
}
</style>
