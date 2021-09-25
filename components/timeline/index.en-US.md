---
category: Components
type: Data Display
title: Timeline
cover: https://gw.alipayobjects.com/zos/antfincdn/vJmo00mmgR/Timeline.svg
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
| pending | Set the last ghost node's existence or its content | boolean\|string\|slot | `false` |
| pendingDot | Set the dot of the last ghost node when pending is true | string\|slot | `<LoadingOutlined />` |
| reverse | reverse nodes or not | boolean | false |
| mode | By sending `alternate` the timeline will distribute the nodes to the left and right. | `left` \| `alternate` \| `right` | `left` |

### Timeline.Item

Node of timeline

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| color | Set the circle's color to `blue`, `red`, `green` or other custom colors | string | `blue` |  |
| dot | Customize timeline dot | string\|slot | - |  |
| position | Customize node position | `left` \| `right` | - |  |
| label | Set the label | string \| slot | - | 3.0 |
