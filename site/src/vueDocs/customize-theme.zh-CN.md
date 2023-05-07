# 定制主题

Ant Design Vue 设计规范和技术上支持灵活的样式定制，以满足业务和品牌上多样化的视觉需求，包括但不限于全局样式（主色、圆角、边框）和指定组件的视觉定制。

在 4.0 版本的 Ant Design Vue 中，我们提供了一套全新的定制主题方案。不同于 3.x 版本的 less 和 CSS 变量，有了 CSS-in-JS 的加持后，动态主题的能力也得到了加强，包括但不限于：

1. 支持动态切换主题；
2. 支持同时存在多个主题；
3. 支持针对某个/某些组件修改主题变量；
4. ...

## 在 ConfigProvider 中配置主题

在 4.0 版本中我们把影响主题的最小元素称为 **Design Token**。通过修改 Design Token，我们可以呈现出各种各样的主题或者组件。

### 修改主题变量

通过在 ConfigProvider 中传入 `theme`，可以配置主题。在升级 v4 后，将默认使用 v4 的主题，以下是将配置主题示例：

```html
<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#00b96b',
      },
    }"
  >
    <a-button />
  </a-config-provider>
</template>
```

这将会得到一个以 <ColorChunk color="#00b96b"></ColorChunk> 为主色的主题，以 Button 组件为例可以看到相应的变化：

![themed button](https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*CbF_RJfKEiwAAAAAAAAAAAAAARQnAQ)

### 使用预设算法

通过修改算法可以快速生成风格迥异的主题，4.0 版本中默认提供三套预设算法，分别是默认算法 `theme.defaultAlgorithm`、暗色算法 `theme.darkAlgorithm` 和紧凑算法 `theme.compactAlgorithm`。你可以通过修改 ConfigProvider 中 `theme` 属性的 `algorithm` 属性来切换算法。

```html
<template>
  <a-config-provider
    :theme="{
      algorithm: theme.darkAlgorithm,
    }"
  >
    <a-button />
  </a-config-provider>
</template>

<script setup>
  import { theme } from 'ant-design-vue';
</script>
```

### 修改组件变量 (Component Token)

除了整体的 Design Token，各个组件也会开放自己的 Component Token 来实现针对组件的样式定制能力，不同的组件之间不会相互影响。同样地，也可以通过这种方式来覆盖组件的其他 Design Token。

```html
<template>
  <a-config-provider
    :theme="{
      components: {
        Radio: {
          colorPrimary: '#00b96b',
        },
      },
    }"
  >
    <a-radio>Radio</a-radio>
    <a-checkbox>Checkbox</a-checkbox>
  </a-config-provider>
</template>
```

通过这种方式，我们可以仅将 Radio 组件的主色改为 <ColorChunk color="#00b96b"></ColorChunk> 而不会影响其他组件。

![component token](https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*EMY0QrHFDjsAAAAAAAAAAAAAARQnAQ)

> 注意：`ConfigProvider` 对 `message.xxx`、`Modal.xxx`、`notification.xxx` ant-design-vue 会通过 `render` 动态创建新的 vue 实体。其 context 与当前代码所在 context 并不相同，因而无法获取 context 信息。当你需要 context 信息（例如 ConfigProvider 配置的内容）时，可以通过 `Modal.useModal` 方法会返回 modal 实体以及 contextHolder 节点。将其插入到你需要获取 context 位置即可。

## 动态主题的其他使用方式

### 动态切换

在 v4 中，动态切换主题对用户来说是非常简单的，你可以在任何时候通过 `ConfigProvider` 的 `theme` 属性来动态切换主题，而不需要任何额外配置。

### 局部主题

可以嵌套使用 `ConfigProvider` 来实现局部主题的更换。在子主题中未被改变的 Design Token 将会继承父主题。

```html
<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#1677ff',
      },
    }"
  >
    <a-button />
    <a-config-provider
      :theme="{
        token: {
          colorPrimary: '#1890ff',
        },
      }"
    >
      <a-button />
    </a-config-provider>
  </a-config-provider>
</template>
```

### 使用 Design Token

如果你希望使用当前主题下的 Design Token，我们提供了 `useToken` 这个 hook 来获取 Design Token。

```html
<template>
  <a-button :style="{ backgroundColor: token.colorPrimary }">Button</a-button>
</template>

<script setup>
  import { theme } from 'ant-design-vue';
  const { useToken } = theme;
  const { token } = useToken();
</script>
```

### 静态消费（如 less）

当你需要非 React 生命周期消费 Token 变量时，可以通过静态方法将其导出：

```jsx
import { theme } from 'ant-design-vue';

const { defaultAlgorithm, defaultSeed } = theme;

const mapToken = defaultAlgorithm(defaultSeed);
```

如果需要将其应用到静态样式编译框架，如 less 可以通过 less-loader 注入：

```jsx
{
  loader: "less-loader",
  options: {
    lessOptions: {
      modifyVars: mapToken,
    },
  },
}
```

兼容包提供了变量转换方法用于转成 v3 的 less 变量，如需使用[点击此处](/docs/vue/migration-v4)查看详情。

## 进阶使用

在 Design Token 中我们提供了一套更加贴合设计的三层结构，将 Design Token 拆解为 Seed Token、Map Token 和 Alias Token 三部分。这三组 Token 并不是简单的分组，而是一个三层的派生关系，由 Seed Token 派生 Map Token，再由 Map Token 派生 Alias Token。在大部分情况下，使用 Seed Token 就可以满足定制主题的需要。但如果您需要更高程度的主题定制，您需要了解 antd 中 Design Token 的生命周期。

### 演变过程

![token](https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*uF3kTrY4InUAAAAAAAAAAAAAARQnAQ)

### 基础变量（Seed Token）

Seed Token 意味着所有设计意图的起源。比如我们可以通过改变 `colorPrimary` 来改变主题色，antd 内部的算法会自动的根据 Seed Token 计算出对应的一系列颜色并应用：

```jsx
const theme = {
  token: {
    colorPrimary: '#1890ff',
  },
};
```

### 梯度变量（Map Token）

Map Token 是基于 Seed 派生的梯度变量。定制 Map Token 推荐通过 `theme.algorithm` 来实现，这样可以保证 Map Token 之间的梯度关系。也可以通过 `theme.token` 覆盖，用于单独修改一些 map token 的值。

```jsx
const theme = {
  token: {
    colorPrimaryBg: '#e6f7ff',
  },
};
```

### 别名变量（Alias Token）

Alias Token 用于批量控制某些共性组件的样式，基本上是 Map Token 别名，或者特殊处理过的 Map Token。

```jsx
const theme = {
  token: {
    colorLink: '#1890ff',
  },
};
```

### 基本算法（algorithm)

基本算法用于将 Seed Token 展开为 Map Token，比如由一个基本色算出一个梯度色板，或者由一个基本的圆角算出各种大小的圆角。算法可以单独使用，也可以任意地组合使用，比如可以将暗色算法和紧凑算法组合使用，得到一个暗色和紧凑相结合的主题。

```jsx
import { theme } from 'ant-design-vue';

const { darkAlgorithm, compactAlgorithm } = theme;

const theme = {
  algorithm: [darkAlgorithm, compactAlgorithm],
};
```

### 兼容旧版浏览器

请参考文档 [样式兼容](/docs/vue/compatible-style-cn)。

### 服务端渲染

服务端渲染样式有两种方案，它们各有优缺点：

- **内联方式**：在渲染时无需额外请求样式文件，好处是减少额外的网络请求，缺点则是会使得 HTML 体积增大，影响首屏渲染速度，相关讨论参考：[#39891](https://github.com/ant-design/ant-design/issues/39891)
- **整体导出**：提前烘焙 antd 组件样式为 css 文件，在页面中时引入。好处是打开任意页面时如传统 css 方案一样都会复用同一套 css 文件以命中缓存，缺点是如果页面中存在多主题，则需要额外进行烘焙

#### 内联方式

使用 `@ant-design/cssinjs` 将所需样式抽离：

```jsx
import { createCache, extractStyle, StyleProvider } from 'ant-design-vue';
import { renderToString } from 'react-dom/server';

export default () => {
  // SSR Render
  const cache = createCache();

  const html = renderToString(
    <StyleProvider cache={cache}>
      <MyApp />
    </StyleProvider>,
  );

  // Grab style from cache
  const styleText = extractStyle(cache);

  // Mix with style
  return `
<!DOCTYPE html>
<html>
  <head>
    ${styleText}
  </head>
  <body>
    <div id="root">${html}</div>
  </body>
</html>
`;
};
```

#### 整体导出

如果你想要将样式文件抽离到 css 文件中，可以尝试使用以下方案：

1. 安装依赖

```bash
npm install ts-node tslib --save-dev
```

2. 新增 `tsconfig.node.json` 文件

```json
{
  "compilerOptions": {
    "strictNullChecks": true,
    "module": "NodeNext",
    "jsx": "react",
    "esModuleInterop": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"]
}
```

3. 新增 `scripts/genAntdCss.tsx` 文件

```jsx
// scripts/genAntdCss.tsx
import { extractStyle } from '@ant-design/static-style-extract';
import fs from 'fs';

const outputPath = './public/antd.min.css';

const css = extractStyle();

fs.writeFileSync(outputPath, css);
```

若你想使用混合主题或自定义主题，可采用以下脚本：

```jsx
import { extractStyle } from '@ant-design/static-style-extract';
import { ConfigProvider } from 'ant-design-vue';
import fs from 'fs';
import React from 'react';

const outputPath = './public/antd.min.css';

const testGreenColor = '#008000';
const testRedColor = '#ff0000';

const css = extractStyle(node => (
  <>
    <ConfigProvider
      theme={{
        token: {
          colorBgBase: testGreenColor,
        },
      }}
    >
      {node}
    </ConfigProvider>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: testGreenColor,
        },
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorBgBase: testRedColor,
          },
        }}
      >
        {node}
      </ConfigProvider>
    </ConfigProvider>
  </>
));

fs.writeFileSync(outputPath, css);
```

你可以选择在启动开发命令或编译前执行这个脚本，运行上述脚本将会在当前项目的指定（如： public 目录）目录下直接生成一个全量的 antd.min.css 文件。

以 Next.js 为例（[参考示例](https://github.com/ant-design/create-next-app-antd)）：

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "predev": "ts-node --project ./tsconfig.node.json ./scripts/genAntdCss.tsx",
    "prebuild": "ts-node --project ./tsconfig.node.json ./scripts/genAntdCss.tsx"
  }
}
```

然后，你只需要在`pages/_app.tsx`文件中引入这个文件即可：

```jsx
import { StyleProvider } from '@ant-design/cssinjs';
import type { AppProps } from 'next/app';
import '../public/antd.min.css';
import '../styles/globals.css'; // 添加这行

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StyleProvider hashPriority="high">
      <Component {...pageProps} />
    </StyleProvider>
  );
}
```

#### 自定义主题

如果你的项目中使用了自定义主题，可以尝试通过以下方式进行烘焙：

```jsx
import { extractStyle } from '@ant-design/static-style-extract';
import { ConfigProvider } from 'ant-design-vue';

const cssText = extractStyle(node => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: 'red',
      },
    }}
  >
    {node}
  </ConfigProvider>
));
```

#### 混合主题

如果你的项目中使用了混合主题，可以尝试通过以下方式进行烘焙：

```jsx
import { extractStyle } from '@ant-design/static-style-extract';
import { ConfigProvider } from 'ant-design-vue';

const cssText = extractStyle(node => (
  <>
    <ConfigProvider
      theme={{
        token: {
          colorBgBase: 'green ',
        },
      }}
    >
      {node}
    </ConfigProvider>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'blue',
        },
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorBgBase: 'red ',
          },
        }}
      >
        {node}
      </ConfigProvider>
    </ConfigProvider>
  </>
));
```

更多`static-style-extract`的实现细节请看：[static-style-extract](https://github.com/ant-design/static-style-extract)。

### Shadow DOM 场景

在 Shadow DOM 场景中，由于其添加 `<style />` 标签的方式与普通 DOM 不同，所以需要使用 `@ant-design/cssinjs` 的 `StyleProvider` 配置 `container` 属性用于设置插入位置：

```jsx
import { StyleProvider } from '@ant-design/cssinjs';
import { createRoot } from 'react-dom/client';

const shadowRoot = someEle.attachShadow({ mode: 'open' });
const container = document.createElement('div');
shadowRoot.appendChild(container);
const root = createRoot(container);

root.render(
  <StyleProvider container={shadowRoot}>
    <MyApp />
  </StyleProvider>,
);
```

## API

### Theme

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| token | 用于修改 Design Token | `AliasToken` | - |
| inherit | 继承上层 ConfigProvider 中配置的主题。 | boolean | true |
| algorithm | 用于修改 Seed Token 到 Map Token 的算法 | `(token: SeedToken) => MapToken` \| `((token: SeedToken) => MapToken)[]` | `defaultAlgorithm` |
| components | 用于修改各个组件的 Component Token 以及覆盖该组件消费的 Alias Token | OverrideToken | - |

### OverrideToken

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `Component` (可以是任意 antd 组件名，如 `Button`) | 用于修改 Component Token 以及覆盖该组件消费的 Alias Token | `ComponentToken & AliasToken` | - |

### SeedToken

<TokenTable type="seed"></TokenTable>

### MapToken

> 继承所有 SeedToken 的属性

<TokenTable type="map"></TokenTable>

### AliasToken

> 继承所有 SeedToken 和 MapToken 的属性

<TokenTable type="alias"></TokenTable>

### StyleProvider

请参考 [`@ant-design/cssinjs`](https://github.com/ant-design/cssinjs#styleprovider)。

## 调试主题

我们提供了帮助用户调试主题的工具：[主题编辑器](/theme-editor-cn)

你可以使用此工具自由地修改 Design Token，以达到您对主题的期望。
