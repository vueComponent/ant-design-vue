<template>
  <div id="components-button-demo-button-group">
    <h4>Basic</h4>
    <ButtonGroup>
      <AntButton>Cancel</AntButton>
      <AntButton type="primary">OK</AntButton>
    </ButtonGroup>
    <ButtonGroup>
      <AntButton disabled>L</AntButton>
      <AntButton disabled>M</AntButton>
      <AntButton disabled>R</AntButton>
    </ButtonGroup>
    <ButtonGroup>
      <AntButton type="primary">L</AntButton>
      <AntButton>M</AntButton>
      <AntButton>M</AntButton>
      <AntButton type="dashed">R</AntButton>
    </ButtonGroup>

    <h4>With Icon</h4>
    <ButtonGroup>
      <AntButton type="primary">
        <Icon type="left" />Go back
      </AntButton>
      <AntButton type="primary">
        Go forward<Icon type="right" />
      </AntButton>
    </ButtonGroup>
    <ButtonGroup>
      <AntButton type="primary" icon="cloud" />
      <AntButton type="primary" icon="cloud-download" />
    </ButtonGroup>
  </div>
</template>
<script>
import { Button, Icon } from 'antd'
export default {
  components: {
    AntButton: Button,
    ButtonGroup: Button.Group,
    Icon,
  },
}
</script>
<style>
#components-button-demo-button-group h4 {
  margin: 16px 0;
  font-size: 14px;
  line-height: 1;
  font-weight: normal;
}
#components-button-demo-button-group h4:first-child {
  margin-top: 0;
}
#components-button-demo-button-group .ant-btn-group {
  margin-right: 8px;
}
</style>
