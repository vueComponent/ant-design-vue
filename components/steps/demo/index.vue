<template>
  <div>
    <a-steps :current="1">
      <a-step title="Finished" description="This is a description." />
      <a-step title="In Progress" description="This is a description." />
      <a-step title="Waiting" description="This is a description." />
    </a-steps>
  </div>
</template>
<script>
import '../style'
import {} from 'antd'
export default {
  data () {
    return {}
  },
}
</script>
