<template>
  <div>
    <h1>Basic</h1>
    <Basic />
    <h1>CheckAll</h1>
    <CheckAll />
    <h1>Controller</h1>
    <Controller />
    <h1>Disabled</h1>
    <Disabled />
    <h1>Group</h1>
    <Group />
    <h1>Layout</h1>
    <Layout />
  </div>
</template>
<script>
import Basic from './basic'
import CheckAll from './check-all'
import Controller from './controller'
import Disabled from './disabled'

import Group from './group'
import Layout from './layout'
export default {
  components: {
    Basic,
    CheckAll,
    Disabled,
    Controller,
    Group,
    Layout,
  },
}
</script>
