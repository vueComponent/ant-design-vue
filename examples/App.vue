<template>
  <div>
    <demo />
  </div>
</template>
<script>
import demo from '../antdv-demo/docs/config-provider/demo/index';

export default {
  components: {
    demo,
  },
  data() {
    return {
      current: ['mail'],
    };
  },
};
</script>
