<template>
  <section class="markdown">
    <h1>{{ isZhCN ? '组件总览' : 'Overview' }}</h1>
    <section class="markdown">
      <p>
        <code>ant-design-vue</code>
        {{
          isZhCN
            ? '为 Web 应用提供了丰富的基础 UI 组件，我们还将持续探索企业级应用的最佳 UI 实践。'
            : 'provides plenty of UI components to enrich your web applications, and we will improve components experience consistently. '
        }}
      </p>
    </section>
    <a-divider></a-divider>
    <a-input
      ref="inputRef"
      v-model:value="search"
      :placeholder="$t('app.components.overview.search')"
      class="components-overview-search"
      auto-focus
    >
      <template #suffix>
        <SearchOutlined />
      </template>
    </a-input>
    <a-divider></a-divider>
    <template v-for="group in menuItems" :key="group.title">
      <div class="components-overview">
        <h2 class="ant-typography components-overview-group-title">
          <a-space align="center">
            {{ isZhCN ? group.title : group.enTitle }}
            <a-tag style="display: block">{{ group.children.length }}</a-tag>
          </a-space>
        </h2>
        <a-row :gutter="[24, 24]">
          <template v-for="component in group.children" :key="component.title">
            <a-col :xs="24" :sm="12" :lg="8" :xl="6">
              <router-link :to="getLocalizedPathname(component.path, isZhCN)">
                <a-card size="small" class="components-overview-card">
                  <template #title>
                    <div class="components-overview-title">
                      {{ component.title }}
                      {{ isZhCN ? component.subtitle : '' }}
                    </div>
                  </template>
                  <div class="components-overview-img">
                    <img :src="component.cover" :alt="component.title" />
                  </div>
                </a-card>
              </router-link>
            </a-col>
          </template>
        </a-row>
      </div>
    </template>
  </section>
</template>
<script lang="ts">
import type { GlobalConfig } from '../App.vue';
import { computed, defineComponent, inject, onMounted, ref } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { GLOBAL_CONFIG } from '../SymbolKey';
import useMenus from '../hooks/useMenus';
import { getLocalizedPathname } from '../utils/util';
export default defineComponent({
  name: 'ComponentOverview',
  components: {
    SearchOutlined,
  },
  setup() {
    const globalConfig = inject<GlobalConfig>(GLOBAL_CONFIG);
    const search = ref('');
    const inputRef = ref();
    const { dataSource } = useMenus();
    const menuItems = computed(() => {
      return dataSource.value
        .filter(i => i.order > -1)
        .map(group => {
          const components = group.children.filter(
            (component: any) =>
              !search.value.trim() ||
              component.title.toLowerCase().includes(search.value.trim().toLowerCase()) ||
              (component.subtitle || '').toLowerCase().includes(search.value.trim().toLowerCase()),
          );
          return { ...group, children: components };
        })
        .filter(i => i.children.length);
    });
    onMounted(() => {
      inputRef.value.focus();
    });
    return {
      globalConfig,
      search,
      menuItems,
      getLocalizedPathname,
      inputRef,
      isZhCN: globalConfig?.isZhCN,
    };
  },
});
</script>
<style lang="less" src="./ComponentOverview.less"></style>
