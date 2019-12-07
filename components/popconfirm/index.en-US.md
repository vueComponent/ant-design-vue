## API

| Param | Description | Type | Default value |
| --- | --- | --- | --- |
| cancelText | text of the Cancel button | string\|slot | `Cancel` |
| okText | text of the Confirm button | string\|slot | `Confirm` |
| okType | Button `type` of the Confirm button | string | `primary` |
| title | title of the confirmation box | string\|slot | - |
| icon | customize icon of confirmation | vNode\|slot | &lt;Icon type="exclamation-circle" /&gt; |

### events

| Events Name | Description | Arguments |
| --- | --- | --- |
| cancel | callback of cancel | function(e) | - |
| confirm | callback of confirmation | function(e) | - |
| visibleChange | Callback executed when visibility of the tooltip card is changed | function(visible) | - |

Consult [Tooltip's documentation](/components/tooltip/#API) to find more APIs.

## Note

Please ensure that the child node of `Popconfirm` accepts `mouseenter`, `mouseleave`, `focus`, `click` events.
