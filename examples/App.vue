<template>
  <div>
    <demo />
  </div>
</template>
<script>
import demo from '../antdv-demo/docs/tree/demo/directory';

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
