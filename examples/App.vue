<template>
  <div>
    <demo />
  </div>
</template>
<script>
import demo from '../antdv-demo/docs/tooltip/demo/index';

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
