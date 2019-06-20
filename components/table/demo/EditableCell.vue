<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input
        class="input-no-arrows"
        :type="type"
        :value="value"
        @change="handleChange"
        @pressEnter="check"
      />
      <a-icon type="check" class="editable-cell-icon-check" @click="check"/>
    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ value || ' ' }}
      <a-icon type="edit" class="editable-cell-icon" @click="edit"/>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: String,
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      value: this.text,
      editable: false
    }
  },
  methods: {
    handleChange(e) {
      const value = e.target.value
      this.value = value
    },
    check() {
      this.editable = false
      this.$emit('change', this.value)
    },
    edit() {
      this.editable = true
    }
  }
}
</script>
<style scoped>
.input-no-arrows::-webkit-inner-spin-button,
.input-no-arrows::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
