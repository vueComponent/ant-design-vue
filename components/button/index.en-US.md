## API

To get a customized button, just set `type`/`shape`/`size`/`loading`/`disabled`.

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| ghost | make background transparent and invert text and border colors, added in 2.7 | boolean | false |
| htmlType | set the original html `type` of `button`, see: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type) | string | `button` |
| icon | set the icon of button, see: Icon component | string | - |
| loading | set the loading status of button | boolean \| { delay: number } | false |
| shape | can be set to `circle` or omitted | string | - |
| size | can be set to `small` `large` or omitted | string | `default` |
| type | can be set to `primary` `ghost` `dashed` `danger`(added in 2.7) or omitted (meaning `default`) | string | `default` |
| onClick | set the handler to handle `click` event | function | - |

### events
| Events Name | Description | Arguments |
| --- | --- | --- |
| click | handle `click` event  | function(e) |

`<Button>Hello world!</Button>` will be rendered into `<button><span>Hello world!</span></button>`, and all the properties which are not listed above will be transferred to the `<button>` tag.

