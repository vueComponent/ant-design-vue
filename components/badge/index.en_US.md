## API

```html
<a-badge :count="5">
  <a href="#" class="head-example" />
</a-badge>
```

```html
<a-badge :count="5" />
```

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| count | Number to show in badge | number\|string \| slot |  |
| dot | Whether to display a red dot instead of `count` | boolean | `false` |
| offset | set offset of the badge dot, like [x, y] | [number\|string, number\|string] | - |
| overflowCount | Max count to show | number | 99 |
| showZero | Whether to show badge when `count` is zero | boolean | `false` |
| status | Set Badge as a status dot | `success` \| `processing` \| `default` \| `error` \| `warning` | `''` |
| text | If `status` is set, `text` sets the display text of the status `dot` | string | `''` |
| numberStyle | sets the display style of the status `dot` | object | '' |
| title | Text to show when hovering over the badge | string | `count` |
