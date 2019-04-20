
<cn>
#### 销毁确认对话框
使用 `Modal.destroyAll()` 可以销毁弹出的确认窗。通常用于路由监听当中，处理路由前进、后退不能销毁确认对话框的问题。
</cn>

<us>
#### destroy confirmation modal dialog
`Modal.destroyAll()` could destroy all confirmation modal dialogs. Usually, you can use it in router change event to destroy confirm modal dialog automatically
</us>

```html
<template>
  <a-button @click="showConfirm">
    Confirm
  </a-button>
</template>
<script>
import Button from '../../button'
export default {
  methods: {
    showConfirm() {
      for (let i = 0; i < 3; i += 1) {
        setTimeout(() => {
          this.$confirm({
            content: (
              <Button onClick={this.destroyAll}>
                Click to destroy all
              </Button>
            ),
            onOk() {
              return new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
              }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {},
          });
        }, i * 500);
      }
    },
    destroyAll() {
      this.$destroyAll();
    }
  }
}
</script>
```

