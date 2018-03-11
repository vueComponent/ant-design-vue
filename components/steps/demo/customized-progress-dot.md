<cn>
#### 自定义点状步骤条
为点状步骤条增加自定义展示。
</cn>

<us>
#### Customized Dot Style
You can customize the display for Steps with progress dot style.
</us>

```html
<template>
  <a-steps :current="1" :progressDot="customDot">
    <a-step title="Finished" description="You can hover on the dot." />
    <a-step title="In Progress" description="You can hover on the dot." />
    <a-step title="Waiting" description="You can hover on the dot." />
    <a-step title="Waiting" description="You can hover on the dot." />
  </a-steps>
</template>
<script>
  export default {
    data() {
      return {}
    },
    methods: {
      customDot(dot, {index, status}) {
        return (
          <a-popover>
            <template slot="content">
              <span>step {index} status: {status}</span>
            </template>
            {dot}
          </a-popover>
        )
      }
    },
  }
</script>
```
