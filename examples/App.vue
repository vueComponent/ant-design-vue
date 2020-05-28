<template>
  <a-config-provider prefixCls="ss">
    jdjj
    <div>ddd</div>
    <a-button
      :class="['test']"
      class="aaa"
      style="display: inline"
      block
      @click="onClick"
      :type="type"
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
