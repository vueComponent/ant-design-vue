<template>
  <div>
    基本
    <Pagination :current="1" :total="50" />
    <br>
    更多
    <Pagination :current="6" :total="500" />
    <br>
    简洁
    <div style="margin-bottom:10px">
      <pagination :simple="simple" :current="5" :total="total"></pagination>
    </div>
    <br>
    改值操作
    <div style="margin-bottom:10px">
      <pagination :current="current" :total="total" @change="onchange"></pagination>
      <vc-button @click="changeValue">改值</vc-button>
    </div>
    <br>
    双向绑定
    <div>
      <pagination v-model="current" :total="total" :showTotal="showTotal"></pagination>
      <vc-button @click="getValue">当前值</vc-button>
    </div>
    <br>
    迷你
    <Pagination :current="1" :total="50" size="small"/>
    <Pagination :current="1" :total="50" :showTotal="showTotal" size="small" showSizeChanger showQuickJumper/>
    <br>
    总数
    <Pagination :current="1" :total="50" :showTotal="showTotal"/>
    <Pagination :current="1" :total="50" :showTotal="showTotal1"/>
    <br>
    跳转
    <Pagination v-model="current" :total="50" :showQuickJumper="showQuickJumper" showSizeChanger>
      <template slot='buildOptionText' slot-scope='props'>
        <span>{{props.value}}条/页</span>
      </template>
    </Pagination>
    <vc-button @click="getValue">当前值</vc-button>
    <br>
    上一步下一步
    <Pagination :total="500" :itemRender="itemRender" />
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
      showQuickJumper: true,
    }
  },
  methods: {
    changeValue () {
      this.current = 4
    },
    getValue () {
      console.log(this.current)
    },
    showTotal (total) {
      return `Total ${total} items`
    },
    showTotal1 (total, range) {
      return `${range[0]}-${range[1]} of ${total} items`
    },
    onchange (page) {
      console.log(page)
    },
    itemRender (current, type, originalElement) {
      if (type === 'prev') {
        return <a>Previous</a>
      } else if (type === 'next') {
        return <a>Next</a>
      }
      return originalElement
    },
  },
  components: {
    Pagination,
    vcButton: Button,
  },
}
</script>
