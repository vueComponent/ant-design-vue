<template>
  <div>
    <demo />
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import demo from '../v2-doc/src/docs/mentions/demo/index.vue';
// import Affix from '../components/affix';
export default defineComponent({
  components: {
    demo,
    // Affix,
  },
  data() {
    return {
      visible: false,
      pStyle: {
        fontSize: '16px',
        color: 'rgba(0,0,0,0.85)',
        lineHeight: '24px',
        display: 'block',
        marginBottom: '16px',
      },
      pStyle2: {
        marginBottom: '24px',
      },
    };
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
  },
});
</script>
