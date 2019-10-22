## API

```jsx
<Layout>
  <Header>header</Header>
  <Layout>
    <Sider>left sidebar</Sider>
    <Content>main content</Content>
    <Sider>right sidebar</Sider>
  </Layout>
  <Footer>footer</Footer>
</Layout>
```

### Layout

The wrapper.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| class | container className | string | - |
| style | to customize the styles | object\|string | - |
| hasSider | whether contain Sider in children, don't have to assign it normally. Useful in ssr avoid style flickering | boolean | - |

> APIs of `Layout.Header` `Layout.Footer` `Layout.Content` are the same as that of `Layout`.

### Layout.Sider

The sidebar.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| breakpoint | [breakpoints](/ant-desing-vue/components/grid#api) of the responsive layout | Enum { 'xs', 'sm', 'md', 'lg', 'xl', 'xxl' } | - |
| class | container className | string | - |
| collapsed(v-model) | to set the current status | boolean | - |
| collapsedWidth | width of the collapsed sidebar, by setting to `0` a special trigger will appear | number | 80 |
| collapsible | whether can be collapsed | boolean | false |
| defaultCollapsed | to set the initial status | boolean | false |
| reverseArrow | reverse direction of arrow, for a sider that expands from the right | boolean | false |
| style | to customize the styles | object\|string | - |
| theme | color theme of the sidebar | string: `light` `dark` | `dark` |
| trigger | specify the customized trigger, set to null to hide the trigger | string\|slot | - |
| width | width of the sidebar | number\|string | 200 |

### Events

| Events Name | Description | Arguments |
| --- | --- | --- |
| collapse | the callback function, executed by clicking the trigger or activating the responsive layout | (collapsed, type) => {} |
| breakpoint | the callback function, executed when [breakpoints](/ant-desing-vue/components/grid#api) changed | (broken) => {} | - |

#### breakpoint width

```js
{
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
}
```
