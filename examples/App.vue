<template>
  <div>
    <demo />
  </div>
</template>
<script>
import demo from '../antdv-demo/docs/upload/demo/picture-style';

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
