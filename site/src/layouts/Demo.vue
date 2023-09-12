<template>
  <article>
    <section class="markdown">
      <h1>
        {{ frontmatter.title }}
        <span v-if="isZhCN" class="subtitle">{{ frontmatter.subtitle }}</span>
      </h1>
      <section class="markdown" v-html="description"></section>
    </section>
    <section class="markdown">
      <h2>{{ $t('app.component.examples') }}</h2>
    </section>
    <slot />
    <!-- <GoogleAds v-if="showAd" :key="`goo-${route.path}`" /> -->
    <section class="markdown api-container" v-html="api"></section>
    <Contributor :is-zn="isZhCN" />
  </article>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
// import GoogleAds from '../components/rice/GoogleAds.vue';
import Contributor from '../components/Contributors/index.vue';

const showAd = location.host.indexOf('antdv.com') > -1;
export default defineComponent({
  name: 'Demo',
  components: {
    // GoogleAds,
    Contributor,
  },
  props: ['pageData', 'isZhCN'],
  setup(props) {
    const route = useRoute();
    const frontmatter = computed(() => props?.pageData?.frontmatter || {});
    const docHtml = computed(() => {
      return props?.pageData?.html || '';
    });
    const description = computed(() => {
      return docHtml.value.split('<h2 id="api">API <a class="header-anchor" href="#api">')[0];
    });
    const api = computed(() => {
      return `
      <h2 id="api"><span>API</span><a href="#api" class="anchor">#</a></h2>
      ${docHtml.value.split('<h2 id="api">API <a class="header-anchor" href="#api">')[1]}
      `;
    });
    return { frontmatter, description, api, route, showAd, docHtml };
  },
});
</script>
<style lang="less" scoped></style>
