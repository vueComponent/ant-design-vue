## API

```vue
<a-badge count=5>
  <a href="#" class="head-example" />
</a-badge>
```

```vue
<a-badge count=5 />
```

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| count | Number to show in badge | number\|ReactNode |  |
| dot | Whether to display a red dot instead of `count` | boolean | `false` |
| offset | set offset of the badge dot, like [x, y] | [number, number] | - |
| overflowCount | Max count to show | number | 99 |
| showZero | Whether to show badge when `count` is zero | boolean | `false` |
| status | Set Badge as a status dot | `success` \| `processing` \| `default` \| `error` \| `warning` | `''` |
| text | If `status` is set, `text` sets the display text of the status `dot` | string | `''` |
