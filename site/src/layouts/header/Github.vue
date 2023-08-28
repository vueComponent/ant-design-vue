<template>
  <a-tooltip placement="bottom">
    <template #title>Github</template>
    <span id="github-btn" class="github-btn" :style="githubIconStyles">
      <a class="gh-btn" href="https://github.com/vueComponent/ant-design-vue" target="_blank">
        <GithubOutlined class="github-icon" />
      </a>
    </span>
  </a-tooltip>
</template>

<script lang="ts">
import { defineComponent, inject, computed } from 'vue';
import { GithubOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  components: {
    GithubOutlined,
  },
  setup() {
    const themeMode = inject('themeMode');
    const githubIconStyles = computed(() => {
      let iconBackgroundColor = 'rgba(0,0,0,0.06)';
      if ((themeMode as any).theme.value === 'dark') {
        iconBackgroundColor = 'rgba(255,255,255,0.12)';
      }
      return {
        '--github-icon-background-color': iconBackgroundColor,
      };
    });
    return {
      githubIconStyles,
    };
  },
});
</script>

<style lang="less" scoped>
@import './Github.less';
#github-btn {
  display: flex;
  flex-flow: nowrap;
  height: auto;

  .gh-btn {
    color: currentColor;
    height: auto;
    padding: 6px;
    background: transparent;
    border: 0;
    transition: all 0.2s;

    &:hover {
      background: var(--github-icon-background-color);
    }

    .gh-ico {
      width: 20px;
      height: 20px;
      margin: 0;
    }

    .gh-text {
      display: none;
    }
  }

  .github-icon {
    font-size: 18px;
    color: var(--text-color);
  }

  .gh-count {
    height: auto;
    padding: 4px 8px;
    font-weight: normal;
    background: #fff;

    &:hover {
      color: var(--primary-color);
    }
  }

  &.responsive-mode {
    .gh-count {
      display: none !important;
    }
  }
}

.ant-row-rtl {
  #github-btn {
    .gh-count {
      display: none !important;
    }
  }
}
</style>
