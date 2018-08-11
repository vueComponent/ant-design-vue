<script>
import IconSet from '@/site/components/IconSet/index'
const md = {
  cn: `# 图标 Icon
        语义化的矢量图形。
        ## 图标的命名规范
        我们为每个图标赋予了语义化的命名，命名规则如下:
        - 实心和描线图标保持同名，用 \` - o\` 来区分，比如 \`question-circle\`（实心） 和 \`question-circle-o\`（描线）；
        - 命名顺序：\`[图标名]-[形状?]-[描线?]-[方向?]\`。
        > \`?\` 为可选。

        完整的图标设计规范请访问 [图标规范](/docs/spec/icon)。
        ## 如何使用
        使用 \`<a-icon />\` 标签声明组件，指定图标对应的 type 属性，示例代码如下:
        \`\`\`html
        <a-icon type="link" />
        \`\`\`
        ## 本地部署
        图标默认托管在 [iconfont.cn](http://iconfont.cn)，默认公网可访问。如需本地部署，可参考 [示例](https://github.com/ant-design/antd-init/tree/master/examples/local-iconfont)。
        ## 图标列表
        > 点击图标复制代码。
      `,
  us: `# Icon
        Semantic vector graphics.
        ## Icons naming convention
        We provide semantic name for every icon, and naming rules are as follows:
        - Scanning line icon has the similar name with its solid one，but it's distinguished by \`-o\`, for example, \`question-circle\` (a full circle) and \`question-circle-o\` (an empty circle);
        - Naming sequence：\`[name]-[shape?]-[outline?]-[direction?]\`.
        > \`?\` means is optional.
        See more design detail at [here](/docs/spec/icon).
        ## How To Use
        Use tag <a-icon /> to create an icon and set its type in the type prop, for example:
        \`\`\`html
        <a-icon type="link" />
        \`\`\`
        ## Local deployment
        By default, icons are deployed at [iconfont.cn](http://iconfont.cn), publicly available repository of a huge set of icons. In case you need to use a locally deployed version of the icon font, you can refer to [this example](https://github.com/ant-design/antd-init/tree/master/examples/local-iconfont)。
        ## List of icons
        > Click the icon and copy the code。
      `,
}
export default {
  category: 'Components',
  type: 'General',
  title: 'Icon',
  subtitle: '图标',
  render () {
    return (
      <div>
        <md class='api-container' cn={md.cn} us={md.us}/>
        <md cn='### 方向性图标' us='### Directional Icons'/>
        <IconSet class='icons' catigory='direction' />
        <md cn='### 提示建议性图标' us='### Suggested Icons'/>
        <IconSet class='icons' catigory='suggestion' />
        <md cn='### 网站通用图标' us='### Application Icons'/>
        <IconSet class='icons' catigory='other' />
        <md cn='### 品牌和标识' us='### Brand and Logos'/>
        <IconSet class='icons' catigory='logo' />

      </div>
    )
  },
}
</script>
