## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| offsetBottom | Pixels to offset from bottom when calculating position of scroll | number | - |
| offsetTop | Pixels to offset from top when calculating position of scroll | number | 0 |
| target | specifies the scrollable area dom node | () => HTMLElement | () => window |

### events

| Events Name | Description                              | Arguments         |
| ----------- | ---------------------------------------- | ----------------- |
| onChange    | Callback for when affix state is changed | Function(affixed) |

**Note:** Children of `Affix` can not be `position: absolute`, but you can set `Affix` as `position: absolute`:

```html
<a-affix :style="{ position: 'absolute', top: y, left: x}">
  ...
</a-affix>
```
