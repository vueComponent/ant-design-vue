### Steps

The whole of the step bar.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| current | to set the current step, counting from 0. You can overwrite this state by using `status` of `Step` | number | 0 |
| direction | to specify the direction of the step bar, `horizontal` and `vertical` are currently supported | string | `horizontal` |
| labelPlacement | support vertial title and description | string | `horizontal` |
| progressDot | Steps with progress dot style, customize the progress dot by setting a scoped slot. labelPlacement will be `vertical` | Boolean or slot="progressDot" slot-scope="{index, status, title, description, prefixCls})" | false |
| size | to specify the size of the step bar, `default` and `small` are currently supported | string | `default` |
| status | to specify the status of current step, can be set to one of the following values: `wait` `process` `finish` `error` | string | `process` |
| initial | set the initial step, counting from 0 | number | 0 |

### Steps.Step

A single step in the step bar.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| description | description of the step, optional property | string\|slot | - |
| icon | icon of the step, optional property | string\|slot | - |
| status | to specify the status. It will be automatically set by `current` of `Steps` if not configured. Optional values are: `wait` `process` `finish` `error` | string | `wait` |
| title | title of the step | string\|slot | - |
