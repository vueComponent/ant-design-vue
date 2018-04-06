<script>
import Basic from './basic.md'
import Search from './search.md'
import Advanced from './advanced.md'
import CustomItem from './custom-item.md'
import LargeData from './large-data.md'
import CN from '../index.zh-CN.md'
import US from '../index.en-US.md'

const md = {
  cn: `# 穿梭框
  双栏穿梭选择框。
  ## 何时使用
 用直观的方式在两栏中移动元素，完成选择行为。

选择一个或以上的选项后，点击对应的方向键，可以把选中的选项移动到另一栏。
其中，左边一栏为 'source'，右边一栏为 'target'，API 的设计也反映了这两个概念。。
        ## 代码演示`,
  us: `# Transfer
  Transfer the elements between two columns in an intuitive and efficient way.

  One or more elements can be selected from either column, one click on the proper 'direction' button, and the transfer is done. The left column is considered the 'source' and the right column is considered the 'target'. As you can see in the API description, these names are reflected in.
  ## Examples
  `,
}
export default {
  category: 'Components',
  subtitle: '穿梭框',
  type: 'Data Entry',
  title: 'Transfer',
  cols: '1',
  render () {
    return (
      <div>
        <md cn={md.cn} us={md.us}/>
        <br/>
        <Basic />
        <br/>
        <Search />
        <br />
        <Advanced />
        <br/>
        <CustomItem />
        <br/>
        <LargeData />
        <br/>
        <api>
          <template slot='cn'>
            <CN/>
          </template>
          <US/>
        </api>
      </div>
    )
  },
}
</script>
