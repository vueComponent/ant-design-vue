## API

```html
<Timeline>
  <Timeline.Item>创建服务现场 2015-09-01</Timeline.Item>
  <Timeline.Item>初步排除网络异常 2015-09-01</Timeline.Item>
  <Timeline.Item>技术测试异常 2015-09-01</Timeline.Item>
  <Timeline.Item>网络异常正在修复 2015-09-01</Timeline.Item>
</Timeline>
```

### Timeline

时间轴。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| pending | 指定最后一个幽灵节点是否存在或内容 | boolean\|string\|slot | false |
| pendingDot | 当最后一个幽灵节点存在時，指定其时间图点 | string\|slot | `<Icon type="loading" />` |
| reverse | 节点排序 | boolean | false |
| mode | 通过设置 `mode` 可以改变时间轴和内容的相对位置 | `left` \| `alternate` \| `right` |

### Timeline.Item

时间轴的每一个节点。

| 参数  | 说明                                            | 类型         | 默认值 |
| ----- | ----------------------------------------------- | ------------ | ------ |
| color | 指定圆圈颜色 `blue, red, green`，或自定义的色值 | string       | blue   |
| dot   | 自定义时间轴点                                  | string\|slot | -      |
