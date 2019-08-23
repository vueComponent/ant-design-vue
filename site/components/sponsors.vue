<template>
  <div class="snd-ad">
    <div class="sponsorsWrap">
      <span class="sponsorsTitle">
        {{ title }}
      </span>
      <ul>
        <li class="sponsorsItem">
          <a
            href="https://tipe.io/?ref=ant-design-vue"
            target="_blank"
          >
            <img
              height="51"
              src="https://cdn.tipe.io/tipe/tipe-cat-no-text.svg"
              alt="tipe"
            >
          </a>
        </li>
        <li
          v-if="isEffective(effectiveTime.bmatch)"
          class="sponsorsItem"
        >
          <a
            href="https://www.youkeda.com?from=vue"
            target="_blank"
          >
            <img
              height="66"
              src="https://qn.antdv.com/youkeda.jpeg"
              alt="bmatch"
            >
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
export default {
  props: ['title'],
  data() {
    return {
      top: 50,
      effectiveTime : {
        bmatch: {
          start: '2019-03-11',
          end: '2019-06-11',
        },
      },
    };
  },
  methods: {
    isEffective({start, end}){
      return moment().isBetween(start, end);
    },
  },
};
</script>
