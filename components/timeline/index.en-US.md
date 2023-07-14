---
category: Components
type: Data Display
title: Timeline
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*FkTySqNt3sYAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*yIl9S4hAIBcAAAAAAAAAAAAADrJ8AQ/original
---

Vertical display timeline.

## When To Use

- When a series of information needs to be ordered by time (ascending or descending).
- When you need a timeline to make a visual connection.

## API

```html
<a-timeline>
  <a-timeline-item>step1 2015-09-01</a-timeline-item>
  <a-timeline-item>step2 2015-09-01</a-timeline-item>
  <a-timeline-item>step3 2015-09-01</a-timeline-item>
  <a-timeline-item>step4 2015-09-01</a-timeline-item>
</a-timeline>
```

### Timeline

Timeline

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| mode | By sending `alternate` the timeline will distribute the nodes to the left and right. | `left` \| `alternate` \| `right` | `left` |
| pending | Set the last ghost node's existence or its content | boolean\|string\|slot | `false` |
| pendingDot | Set the dot of the last ghost node when pending is true | string\|slot | `<LoadingOutlined />` |
| reverse | reverse nodes or not | boolean | false |

### Timeline.Item

Node of timeline

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| color | Set the circle's color to `blue`, `red`, `green` or other custom colors | string | `blue` |  |
| dot | Customize timeline dot | string\|slot | - |  |
| label | Set the label | string \| slot | - | 3.0 |
| position | Customize node position | `left` \| `right` | - |  |
