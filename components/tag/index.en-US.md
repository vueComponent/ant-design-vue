## API

### Tag

| Property         | Description                                         | Type       | Default |
| ---------------- | --------------------------------------------------- | ---------- | ------- |
| afterClose       | Callback executed when close animation is completed | () => void | -       |
| closable         | Whether the Tag can be closed                       | boolean    | `false` |
| color            | Color of the Tag                                    | string     | -       |
| visible(v-model) | Whether the Tag is closed or not                    | boolean    | `true`  |

### Tag Events

| Events Name | Description                          | Arguments   |
| ----------- | ------------------------------------ | ----------- |
| close       | Callback executed when tag is closed | (e) => void |

### Tag.CheckableTag

| Property         | Description           | Type    | Default |
| ---------------- | --------------------- | ------- | ------- |
| checked(v-model) | Checked status of Tag | boolean | `false` |

### Tag.CheckableTag Events

| Events Name | Description                                     | Arguments         |
| ----------- | ----------------------------------------------- | ----------------- |
| change      | Callback executed when Tag is checked/unchecked | (checked) => void |
