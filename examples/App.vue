<template>
  <div>
    <demo />
  </div>
</template>
<script>
import demo from '../antdv-demo/docs/tag/demo/basic';

export default {
  components: {
    demo,
  },
  data() {
    return {
      visible: true,
      current: ['mail'],
    };
  },
};
</script>
