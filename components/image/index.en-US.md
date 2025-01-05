---
category: Components
type: Data Display
title: Image
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*FbOCS6aFMeUAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*LVQ3R5JjjJEAAAAAAAAAAAAADrJ8AQ/original
---

Previewable image.

## When To Use

- When you need to display pictures.
- Display when loading a large image or fault tolerant handling when loading fail.

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| alt | Image description | string | - | 2.0.0 |
| fallback | Load failure fault-tolerant src | string | - | 2.0.0 |
| height | Image height | string \| number | - | 2.0.0 |
| placeholder | Load placeholder, use default placeholder when set `true` | boolean \| slot | - | 2.0.0 |
| preview | preview config, disabled when `false` | boolean \| [previewType](#previewtype) | true | 2.0.0 |
| src | Image path | string | - | 2.0.0 |
| toolbarRender | Custom toolbar render | slot \| [toolbarRenderType](#toolbarrendertype) | - | 4.0.8 |
| previewMask | custom mask | false \| function \| slot | - | 3.2.0 |
| width | Image width | string \| number | - | 2.0.0 |

### events

| Events Name | Description          | Arguments              | Version |
| ----------- | -------------------- | ---------------------- | ------- |
| error       | Load failed callback | (event: Event) => void | 3.2.0   |

### previewType

```ts
{
  visible?: boolean;
  onVisibleChange?: (visible, prevVisible) => void;
  getContainer?: string | HTMLElement | (() => HTMLElement);
  src?: string;
  maskClassName?: string;
  current?: number;
}
```

### TransformType

```ts
{
  x: number;
  y: number;
  rotate: number;
  scale: number;
  flipX: boolean;
  flipY: boolean;
}
```

### toolbarRenderType

```ts
{
  actions: {
    onFlipY: () => void;
    onFlipX: () => void;
    onRotateLeft: () => void;
    onRotateRight: () => void;
    onZoomOut: () => void;
    onZoomIn: () => void;
  };
  transform: TransformType,
  current: number;
  total: number;
}
```

Other attributes [&lt;img>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes)
