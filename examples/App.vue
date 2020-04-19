<template>
  <div>
    <a-button type="primary" @click="hello">
      Primary
    </a-button>
    <a-button>Default</a-button>
    <a-button type="dashed">
      Dashed
    </a-button>
    <a-button type="danger">
      Danger
    </a-button>
    <a-button type="primary">
      按钮
    </a-button>
    <a-button type="link">
      Link
    </a-button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from '../components/button/button';
export default defineComponent({
  name: 'demo',
  components: { 'a-button': Button },
  setup() {
    return {
      hello: () => {
        alert('hello');
      },
    };
  },
});
</script>
