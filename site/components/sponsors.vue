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
            href="https://www.bmatch.tech/?ref=ant-design-vue"
            target="_blank"
          >
            <img
              height="61"
              src="https://cdn.nlark.com/yuque/0/2019/png/87084/1552279877057-assets/web-upload/48a6ba91-6750-478c-956f-57aedb632fe5.png"
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
