<template>
  <div>
    <h1>Basic</h1>
    <Basic />
    <h1>Disabled</h1>
    <Disabled />
    <Layout />
  </div>
</template>
<script>
import Basic from './basic'
import Disabled from './disabled'
export default {
  components: {
    Basic,
    Disabled,
  },
}
</script>
