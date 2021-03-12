## API

### Row

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| align | the vertical alignment of the flex layout: `top` `middle` `bottom` | string | `top` |
| gutter | spacing between grids, could be a number or a object like `{ xs: 8, sm: 16, md: 24}`. or you can use array to make horizontal and vertical spacing work at the same time `[horizontal, vertical]` (supported after `1.5.0`) | number/object/array | 0 |
| justify | horizontal arrangement of the flex layout: `start` `end` `center` `space-around` `space-between` | string | `start` |
| type | layout mode, optional `flex`, [browser support](http://caniuse.com/#search=flex) | string |  |

### Col

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| flex | the layout fill of flex | string\|number | - |
| offset | the number of cells to offset Col from the left | number | 0 |
| order | raster order, used in `flex` layout mode | number | 0 |
| pull | the number of cells that raster is moved to the left | number | 0 |
| push | the number of cells that raster is moved to the right | number | 0 |
| span | raster number of cells to occupy, 0 corresponds to `display: none` | number | none |
| xs | `<576px` and also default setting, could be a `span` value or an object containing above props | number\|object | - |
| sm | `≥576px`, could be a `span` value or an object containing above props | number\|object | - |
| md | `≥768px`, could be a `span` value or an object containing above props | number\|object | - |
| lg | `≥992px`, could be a `span` value or an object containing above props | number\|object | - |
| xl | `≥1200px`, could be a `span` value or an object containing above props | number\|object | - |
| xxl | `≥1600px`, could be a `span` value or an object containing above props | number\|object | - |

The breakpoints of responsive grid follow [BootStrap 4 media queries rules](https://getbootstrap.com/docs/4.0/layout/overview/#responsive-breakpoints)(not including `occasionally part`).

## FAQ

### How to support IE9 when using responsive?

You can use [matchMedia polyfill](https://github.com/paulirish/matchMedia.js/) to handle this.
