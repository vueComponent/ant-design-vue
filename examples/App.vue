<template>
  <div>
    <a-button><span>按钮</span></a-button>
    <demo />
  </div>
</template>
<script>
import demo from '../antdv-demo/docs/menu/demo/inline';

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
