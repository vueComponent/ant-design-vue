<template>
  <div>
    <a-button><span>按钮</span></a-button>
    <demo />
  </div>
</template>
<script>
import demo from '../antdv-demo/docs/upload/demo/drag';

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
