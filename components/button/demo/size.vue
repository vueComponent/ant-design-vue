<template>
  <div>
    <RadioGroup :value="size" @change="handleSizeChange">
      <RadioButton value="large">Large</RadioButton>
      <RadioButton value="default">Default</RadioButton>
      <RadioButton value="small">Small</RadioButton>
    </RadioGroup>
    <br /><br />
    <AntButton type="primary" :size="size">Primary</AntButton>
    <AntButton :size="size">Normal</AntButton>
    <AntButton type="dashed" :size="size">Dashed</AntButton>
    <AntButton type="danger" :size="size">Danger</AntButton>
    <br />
    <AntButton type="primary" shape="circle" icon="download" :size="size" />
    <AntButton type="primary" icon="download" :size="size">Download</AntButton>
    <br />
    <ButtonGroup :size="size">
      <AntButton type="primary">
        <Icon type="left" />Backward
      </AntButton>
      <AntButton type="primary">
        Forward<Icon type="right" />
      </AntButton>
    </ButtonGroup>
  </div>
</template>
<script>
import { Button, Radio, Icon } from 'antd'
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
  components: {
    AntButton: Button,
    ButtonGroup: Button.Group,
    RadioButton: Radio.Button,
    RadioGroup: Radio.Group,
    Icon,
  },
}
</script>
