<template>
  <div>
    <Horizontal />
    <InlineCollapsed />
    <SiderCurrent />
    <SwitchMode />
    <Theme />
    <Vertical />
  </div>
</template>
<script>
import Horizontal from './horizontal'
import InlineCollapsed from './inline-collapsed'
import SiderCurrent from './sider-current'
import SwitchMode from './switch-mode'
import Theme from './theme'
import Vertical from './vertical'
export default {
  components: {
    Horizontal,
    InlineCollapsed,
    SiderCurrent,
    SwitchMode,
    Theme,
    Vertical,
  },
}
</script>
