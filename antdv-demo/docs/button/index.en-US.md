## API

To get a customized button, just set `type`/`shape`/`size`/`loading`/`disabled`.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| disabled | disabled state of button | boolean | `false` |  |
| ghost | make background transparent and invert text and border colors, added in 2.7 | boolean | false |  |
| htmlType | set the original html `type` of `button`, see: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type) | string | `button` |  |
| icon | set the icon of button, see: Icon component | string | - |  |
| loading | set the loading status of button | boolean \| { delay: number } | false |  |
| shape | can be set to `circle`, `round` or omitted | string | - |  |
| size | can be set to `small` `large` or omitted | string | `default` |  |
| type | can be set to `primary` `ghost` `dashed` `danger` `link` or omitted (meaning `default`) | string | `default` |  |
| block | option to fit button width to its parent width | boolean | `false` |  |

### events

| Events Name | Description                             | Arguments       | Version |
| ----------- | --------------------------------------- | --------------- | ------- |
| click       | set the handler to handle `click` event | (event) => void |         |

It accepts all props which native buttons support.

## FAQ

### How to remove space between 2 chinese characters

Use [ConfigProvider](/components/config-provider/#API) to set `autoInsertSpaceInButton` as `false`.
