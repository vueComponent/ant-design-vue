<template>
  <div>
    <div style="margin-bottom:10px">
      <pagination :simple="simple" :current="current" :total="total"></pagination>
    </div>
    <div style="margin-bottom:10px">
      <pagination :current="current" :total="total" @change="onchange"></pagination>
      <vc-button @click="changeValue">改值</vc-button>
    </div>
    <div>
      <pagination v-model="current" :total="total" :showTotal="showTotal"></pagination>
      <vc-button @click="changeValue">改值</vc-button>
      <vc-button @click="getValue">当前值</vc-button>
    </div>
  </div>
</template>
<script>
import '../style'
import { Pagination, Button } from 'antd/index'
export default {
  data () {
    return {
      simple: true,
      current: 1,
      total: 483,
    }
  },
  methods: {
    changeValue () {
      this.current = 4
    },
    getValue () {
      alert(this.current)
    },
    showTotal (total) {
      return `共 ${total} 条`
    },
    onchange (page) {
      alert(page)
    },
  },
  components: {
    Pagination,
    vcButton: Button,
  },
}
</script>
