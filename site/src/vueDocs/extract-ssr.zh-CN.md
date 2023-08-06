# SSR 静态样式导出

我们在思考是否可以如 v3 版本一样，预先烘焙组件的样式来使前端消费，所以提出了 [\[RFC\] Static Extract style](https://github.com/ant-design/ant-design/discussions/40985)。它的思路很简单，我们只需要提前将所有的组件进行一次渲染就可以从 cache 中获得完整的样式，然后将其写入到 css 文件中即可。

```tsx
const cache = createCache();

// HTML Content
renderToString(
  <StyleProvider cache={cache}>
    <Button />
    <Switch />
    <Input />
    {/* Rest antd components */}
  </StyleProvider>,
);

// Style Content
const styleText = extractStyle(cache);
```

当然，这对于开发者而言稍微有点麻烦。所以我们提供了一个方法来实现该需求：

```tsx
import { extractStyle } from 'ant-design-vue/lib/_util/static-style-extract';
import fs from 'fs';

// `extractStyle` containers all the antd component
// excludes popup like component which is no need in ssr: Modal, message, notification, etc.
const css = extractStyle();

fs.writeFile(...);
```

如果开发者使用了混合主题，也可以自行实现混合需求：

```tsx
// `node` is the components set we prepared
const css = extractStyle(node => (
  <>
    <ConfigProvider theme={theme1}>{node}</ConfigProvider>
    <ConfigProvider theme={theme2}>{node}</ConfigProvider>
    <ConfigProvider theme={theme3}>{node}</ConfigProvider>
  </>
));
```
