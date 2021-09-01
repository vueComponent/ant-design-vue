<template>
  <span id="github-btn" class="github-btn">
    <a class="gh-btn" href="https://github.com/vueComponent/ant-design-vue" target="_blank">
      <span class="gh-ico" aria-hidden="true"></span>
      <span class="gh-text">Star</span>
    </a>
  </span>
</template>
<style lang="less" scoped>
@import '../../theme/static/theme.less';
@import './Github.less';
#github-btn {
  display: flex;
  flex-flow: nowrap;
  height: auto;

  .gh-btn {
    height: auto;
    padding: 1px 4px;
    background: transparent;
    border: 0;

    .gh-ico {
      width: 20px;
      height: 20px;
      margin: 0;
    }

    .gh-text {
      display: none;
    }
  }

  .gh-count {
    height: auto;
    padding: 4px 8px;
    font-weight: normal;
    background: #fff;

    &:hover {
      color: @primary-color;
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
