<template>
  <div>
    <div :style="{ borderBottom: '1px solid #E9E9E9' }">
      <Checkbox
        :indeterminate="indeterminate"
        @change="onCheckAllChange"
        :checked="checkAll"
      >
        Check all
      </Checkbox>
    </div>
    <br />
    <CheckboxGroup :options="plainOptions" v-model="checkedList" @change="onChange" />
  </div>
</template>
<script>
import { Checkbox } from 'antd'
const plainOptions = ['Apple', 'Pear', 'Orange']
const defaultCheckedList = ['Apple', 'Orange']
export default {
  data () {
    return {
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
      plainOptions,
    }
  },
  methods: {
    onChange (checkedList) {
      this.indeterminate = !!checkedList.length && (checkedList.length < plainOptions.length)
      this.checkAll = checkedList.length === plainOptions.length
    },
    onCheckAllChange (e) {
      Object.assign(this, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked,
      })
    },
  },
  components: {
    Checkbox,
    CheckboxGroup: Checkbox.Group,
  },
}
</script>
