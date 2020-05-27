<template>
  <div>
    <a-button type="primary" block @click="onClick">
      Primary
    </a-button>
    <a-button block>
      Default
    </a-button>
    <a-button type="dashed" block>
      Dashed
    </a-button>
    <a-button type="danger" block>
      Danger
    </a-button>
    <a-button type="link" block>
      Link
    </a-button>
  </div>
</template>

<script>
export default {
  name: 'Demo',
  methods: {
    onClick() {
      console.log(1);
    },
  },
};
</script>
