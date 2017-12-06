<template>
<div>
<AntInput placeholder="Basic usage" value="123"/>
  <AntInput placeholder="Basic usage" defaultValue="mysite"/>
</div>

</template>
<script>

import { Input } from 'antd'
export default {
  components: {
    AntInput: Input,
  },
}
</script>
