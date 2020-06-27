<template>
  <div>
    <demo />
  </div>
</template>
<script>
import demo from '../antdv-demo/docs/input/demo/tooltip';

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
