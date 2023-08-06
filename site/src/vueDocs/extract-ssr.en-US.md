# SSR Static style export

We are thinking about whether we can pre-bake the style of the component for front-end consumption like the v3 version, so we proposed [\[RFC\] Static Extract style](https://github.com/ant-design/ant-design/discussions/40985). Its idea is very simple that only need to render all the components once in advance to get the complete style from the cache, and then write it into the css file.

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

Of course, this is a little cumbersome for developers. so we provide a method to fulfill this requirement:

```tsx
import { extractStyle } from 'ant-design-vue/lib/_util/static-style-extract';
import fs from 'fs';

// `extractStyle` containers all the antd component
// excludes popup like component which is no need in ssr: Modal, message, notification, etc.
const css = extractStyle();

fs.writeFile(...);
```

If developers use a hybrid theme, they can also implement the hybrid requirements by themselves:

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
