<script>
import Basic from './basic'
import CertainCategory from './certain-category'
import Custom from './custom'
import NonCaseSensitive from './non-case-sensitive'
import Options from './options'
import UncertainCategory from './uncertain-category'

import CN from '../index.zh-CN.md'
import US from '../index.en-US.md'
const md = {
  cn: `# AutoComplete 自动完成
          输入框自动完成功能。
## 何时使用
需要自动完成时。
          ## 代码演示`,
  us: `# AutoComplete
        Autocomplete function of input field.
## When To Use
When there is a need for autocomplete functionality.
`,
}
export default {
  render () {
    return (
      <div>
        <md cn={md.cn} us={md.us}/>
        <Basic/>
        <CertainCategory/>
        <Custom/>
        <NonCaseSensitive/>
        <Options/>
        <UncertainCategory/>
        <api>
          <CN slot='cn' />
          <US/>
        </api>
      </div>
    )
  },
}
</script>
<style>
.certain-category-search-dropdown .ant-select-dropdown-menu-item-group-title {
  color: #666;
  font-weight: bold;
}

.certain-category-search-dropdown .ant-select-dropdown-menu-item-group {
  border-bottom: 1px solid #F6F6F6;
}

.certain-category-search-dropdown .ant-select-dropdown-menu-item {
  padding-left: 16px;
}

.certain-category-search-dropdown .ant-select-dropdown-menu-item.show-all {
  text-align: center;
  cursor: default;
}

.certain-category-search-dropdown .ant-select-dropdown-menu {
  max-height: 300px;
}
.global-search-wrapper {
  padding-right: 50px;
}

.global-search {
  width: 100%;
}

.global-search.ant-select-auto-complete .ant-select-selection--single {
  margin-right: -46px;
}

.global-search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input:not(:last-child) {
  padding-right: 62px;
}

.global-search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input-suffix {
  right: 0;
}

.global-search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input-suffix button {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.global-search-item-count {
  position: absolute;
  right: 16px;
}
</style>
