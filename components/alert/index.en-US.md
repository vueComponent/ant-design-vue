## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| afterClose | Called when close animation is finished | () => void | - |
| banner | Whether to show as banner | boolean | false |
| closable | Whether Alert can be closed | boolean | - |
| closeText | Close text to show | string\|slot | - |
| description | Additional content of Alert | string\|slot | - |
| icon | Custom icon, effective when `showIcon` is `true` | vnode \| slot | - |
| message | Content of Alert | string\|slot | - |
| showIcon | Whether to show icon | boolean | false, in `banner` mode default is true |
| type | Type of Alert styles, options: `success`, `info`, `warning`, `error` | string | `info`, in `banner` mode default is `warning` |

### events

| Events Name | Description                   | Arguments               |
| ----------- | ----------------------------- | ----------------------- |
| close       | Callback when Alert is closed | (e: MouseEvent) => void |
