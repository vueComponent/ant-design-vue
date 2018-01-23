<template>
  <div>
    <a-radio-group :value="size" @change="handleSizeChange">
      <a-radio-button value="large">Large</a-radio-button>
      <a-radio-button value="default">Default</a-radio-button>
      <a-radio-button value="small">Small</a-radio-button>
    </a-radio-group>
    <br /><br />
    <a-button type="primary" :size="size">Primary</a-button>
    <a-button :size="size">Normal</a-button>
    <a-button type="dashed" :size="size">Dashed</a-button>
    <a-button type="danger" :size="size">Danger</a-button>
    <br />
    <a-button type="primary" shape="circle" icon="download" :size="size" />
    <a-button type="primary" icon="download" :size="size">Download</a-button>
    <br />
    <a-button-group :size="size">
      <a-button type="primary">
        <a-icon type="left" />Backward
      </a-button>
      <a-button type="primary">
        Forward<a-icon type="right" />
      </a-button>
    </a-button-group>
  </div>
</template>
<script>
export default {
  data () {
    return {
      size: 'large',
    }
  },
  methods: {
    handleSizeChange (e) {
      this.size = e.target.value
    },
  },
}
</script>
