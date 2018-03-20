<template>
  <div>
    <h1>Basic</h1>
    <Basic />
    <h1>ArrowCenter</h1>
    <ArrowCenter />
    <h1>Control</h1>
    <Control />
    <h1>Placement</h1>
    <Placement />
    <h1>TriggerType</h1>
    <TriggerType />
  </div>
</template>
<script>
import Basic from './basic'
import ArrowCenter from './arrow-point-at-center'
import Control from './control'
import Placement from './placement'
import TriggerType from './triggerType'
export default {
  category: 'Components',
  subtitle: '气泡卡片',
  type: 'Data Display',
  title: 'Popover',
  components: {
    Basic,
    ArrowCenter,
    Control,
    Placement,
    TriggerType,
  },
}
</script>
