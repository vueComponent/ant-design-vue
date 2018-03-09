<cn>
#### 不可用
checkbox 不可用
</cn>

<us>
#### Disabled
Disabled checkbox
</us>

```html
<template>
  <div>
    <a-checkbox :defaultChecked="false" disabled />
    <br />
    <a-checkbox defaultChecked disabled />
  </div>
</template>
<script>
import { Checkbox } from 'antd'
export default {
  components: {
    Checkbox,
  },
}
</script>
```
