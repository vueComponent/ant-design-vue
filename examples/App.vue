<template>
  <div>
    <demo />
  </div>
</template>
<script>
import demo from '../antdv-demo/docs/cascader/demo/index';

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
