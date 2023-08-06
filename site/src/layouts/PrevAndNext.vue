<template>
  <section class="prev-next-nav">
    <router-link
      v-if="prev"
      key="prev"
      class="prev-page"
      :to="getLocalizedPathname(prev.path, isZhCN)"
    >
      <span role="img" aria-label="left" class="anticon anticon-left footer-nav-icon-before">
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="left"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"
          ></path>
        </svg>
      </span>
      <span v-if="isZhCN" class="chinese">{{ prev.subtitle || prev.title }}</span>
      <span v-else>{{ prev.enTitle || prev.title }}</span>
    </router-link>
    <router-link
      v-if="next"
      key="next"
      class="next-page"
      :to="getLocalizedPathname(next.path, isZhCN)"
    >
      <span v-if="isZhCN" class="chinese">{{ next.subtitle || next.title }}</span>
      <span v-else>{{ next.enTitle || next.title }}</span>
      <span role="img" aria-label="right" class="anticon anticon-right footer-nav-icon-after">
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="right"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"
          ></path>
        </svg>
      </span>
    </router-link>
  </section>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { getLocalizedPathname } from '../utils/util';
export default defineComponent({
  name: 'PrevAndNext',
  props: ['menus', 'isZhCN', 'currentMenuIndex'],
  setup(props) {
    return {
      getLocalizedPathname,
      prev: computed(() => props.menus[props.currentMenuIndex - 1]),
      next: computed(() => props.menus[props.currentMenuIndex + 1]),
    };
  },
});
</script>
