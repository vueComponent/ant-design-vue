## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| icon | 设置头像的图标类型，参考 `Icon` 组件 | string | - |
| shape | 指定头像的形状 | Enum{ 'circle', 'square' } | `circle` |
| size | 设置头像的大小 | number \| Enum{ 'large', 'small', 'default' } | `default` |
| src | 图片类头像的资源地址 | string | - |
| srcSet | 设置图片类头像响应式资源地址 | string | - |
| alt | 图像无法显示时的替代文本 | string | - |
| loadError | 图片加载失败的事件，返回 false 会关闭组件默认的 fallback 行为 | () => boolean | - |
