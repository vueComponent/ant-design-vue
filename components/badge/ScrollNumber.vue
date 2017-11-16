<template>
  <sup :class="[prefixCls, className]" :title="titleNumber" :style="styleNumber">
    <!-- <span v-if="!count || isNaN(count)">{{count}}</span> -->
    <span>{{count}}</span>
  </sup>
</template>
<script>
export default {
  name: 'ScrollNumber',
  props: {
    className: Object,
    prefixCls: String,
    count: [Number, String],
    titleNumber: [Number, String],
    styleNumber: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {

    }
  },
  computed: {

  },
  methods: {

  },
  components: {
  },
}
</script>
