<template>
  <div>
    <Basic />
    <br>
    <withIcon />
    <br>
    <separator />
  </div>
</template>
<script>
import Basic from './basic'
import withIcon from './withIcon'
import separator from './separator'
export default {
  components: {
    Basic,
    withIcon,
    separator,
  },
}
</script>
