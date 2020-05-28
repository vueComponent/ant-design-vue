<template>
  <a-config-provider>
    <a-button-group class="dddd" style="color: red" @click="onClick">
      <a-button>Cancel</a-button>
      <a-button type="primary">
        OK
      </a-button>
    </a-button-group>
    <a-button
      :class="['test']"
      class="aaa"
      style="display: inline"
      block
      :type="type"
      @click="onClick"
    >
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
  </a-config-provider>
</template>

<script>
export default {
  name: 'Demo',
  data() {
    return {
      type: 'primary',
    };
  },
  methods: {
    onClick() {
      console.log(1);
    },
  },
};
</script>
