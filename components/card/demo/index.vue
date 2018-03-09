<script>
import Basic from './basic.md'
import NoBorder from './noBorder.md'
import Concise from './concise.md'
import ColRowCard from './colRowCard.md'
import Loading from './loading.md'
import Grid from './grid.md'
import Inline from './inline.md'
import TabsCard from './tabsCard.md'
import MoreConfigs from './moreConfigs.md'

import CN from './../index.zh-CN.md'
import US from './../index.en-US.md'

import '../style'

const md = {
  cn: `# Card 卡片
         通用卡片容器
       ## 何时使用
         最基础的卡片容器，可承载文字、列表、图片、段落，常用于后台概览页面。
       ## 代码演示
        `,
  us: `# Card
         Simple rectangular container.
       ##When To Use
         A card can be used to display content related to a single subject. The content can consist of multiple elements of varying types and sizes.
       ##Examples
        `
}
export default {
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <NoBorder />
        <Concise />
        <ColRowCard />
        <Loading />
        <Grid />
        <Inline />
        <TabsCard />
        <MoreConfigs />
        <api>
          <CN slot='cn' />
          <US />
        </api>
      </div>
    )
  },
}
</script>
