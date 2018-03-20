<template>
  <div>
    <h1>Basic</h1>
    <Basic />
    <h1>Dynamic Trigger</h1>
    <Trigger />
    <h1>Local</h1>
    <Local />
    <h1>Placement</h1>
    <Placement />
  </div>
</template>
<script>
import Basic from './basic'
import Trigger from './dynamic-trigger'
import Local from './local'
import Placement from './placement'
export default {
  category: 'Components',
  subtitle: '气泡确认框',
  type: 'Feedback',
  title: 'Popconfirm',
  components: {
    Basic,
    Trigger,
    Local,
    Placement,
  },
}
</script>
