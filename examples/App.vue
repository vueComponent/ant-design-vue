<template>
  <div>
    <demo />
  </div>
</template>
<script>
import demo from '../antdv-demo/docs/menu/demo/horizontal';

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
