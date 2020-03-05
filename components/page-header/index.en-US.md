## API

| Param | Description | Type | Default value |
| --- | --- | --- | --- |
| title | custom title text | string\|slot | - |
| subTitle | custom subTitle text | string\|slot | - |
| ghost | PageHeader type, will change background color | boolean | true |
| avatar | Avatar next to the title bar | [avatar props](/components/avatar/) | - |
| backIcon | custom back icon, if false the back icon will not be displayed | string\|slot | `<Icon type="arrow-left" />` |
| tags | Tag list next to title | [Tag](/components/tag/)[] \| [Tag](/components/tag/) | - |
| extra | Operating area, at the end of the line of the title line | string\|slot | - |
| breadcrumb | Breadcrumb configuration | [breadcrumb](/components/breadcrumb/) | - |
| footer | PageHeader's footer, generally used to render TabBar | string\|slot | - |

### Events

| Events Name | Description           | Arguments   |
| ----------- | --------------------- | ----------- |
| back        | back icon click event | function(e) |
