<script>
import Basic from './basic'
import NoBorder from './noBorder'
import Concise from './concise'
import ColRowCard from './colRowCard'
import Loading from './loading'
import Grid from './grid'
import Inline from './inline'
import TabsCard from './tabsCard'
import MoreConfigs from './moreConfigs'
import FlexibleContent from './flexible-content'

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
       ## Examples
        `,
}
export default {
  category: 'Components',
  type: 'Data Display',
  title: 'Card',
  subtitle: '卡片',
  cols: 1,
  render () {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <NoBorder />
        <Concise />
        <FlexibleContent />
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
