
<cn>
#### 确认对话框
使用 `confirm()` 可以快捷地弹出确认框。
</cn>

<us>
#### Confirmation modal dialog
To use `confirm()` to popup a confirmation modal dialog.
</us>

```html
<template>
  <div>
    <a-button @click="showConfirm">
      Confirm
    </a-button>
    <a-button @click="showDeleteConfirm" type="dashed">
      Delete
    </a-button>
  </div>
</template>
<script>
export default {
  methods: {
    showConfirm() {
      this.$modalConfirm({
        title: 'Do you Want to delete these items?',
        content: 'Some descriptions',
        onOk() {
          console.log('OK');
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },

    showDeleteConfirm() {
      this.$modalConfirm({
        title: 'Are you sure delete this task?',
        content: 'Some descriptions',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          console.log('OK');
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
  }
}
</script>
```

