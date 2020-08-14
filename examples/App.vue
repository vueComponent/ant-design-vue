<template>
  <div>
    <demo />
  </div>
</template>
<script>
import demo from '../antdv-demo/docs/carousel/demo/autoplay.md';

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
