## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 自定义标题文字 | string\|slot | - |
| subTitle | 自定义的二级标题文字 | string\|slot | - |
| ghost | pageHeader 的类型，将会改变背景颜色 | boolean | true |
| avatar | 标题栏旁的头像 | [avatar props](/components/avatar-cn/) | - |
| backIcon | 自定义 back icon ，如果为 false 不渲染 back icon | string\|slot | `<Icon type="arrow-left" />` |
| tags | title 旁的 tag 列表 | [Tag](/components/tag-cn/)[] \| [Tag](/components/tag-cn/) | - |
| extra | 操作区，位于 title 行的行尾 | string\|slot | - |
| breadcrumb | 面包屑的配置 | [breadcrumb](/components/breadcrumb-cn/) | - |
| footer | PageHeader 的页脚，一般用于渲染 TabBar | string\|slot | - |

### 事件

| 事件名称 | 说明               | 回调参数    |
| -------- | ------------------ | ----------- |
| back     | 返回按钮的点击事件 | function(e) |
