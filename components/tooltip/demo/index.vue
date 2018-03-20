<template>
  <div>
    <h1>Basic</h1>
    <Basic />
    <h1>ArrowCenter</h1>
    <ArrowCenter />
    <h1>AutoAdjust</h1>
    <AutoAdjust />
    <h1>Placement</h1>
    <Placement />
  </div>
</template>
<script>
import Basic from './basic'
import ArrowCenter from './arrow-point-at-center'
import AutoAdjust from './auto-adjust-overflow'
import Placement from './placement'
export default {
  category: 'Components',
  subtitle: '文字提示',
  type: 'Data Display',
  title: 'Tooltip',
  components: {
    Basic,
    ArrowCenter,
    AutoAdjust,
    Placement,
  },
}
</script>
