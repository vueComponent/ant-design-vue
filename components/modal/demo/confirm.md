<cn>
#### 确认对话框
使用 `confirm()` 可以快捷地弹出确认框。
</cn>

<us>
#### Confirmation modal dialog
To use `confirm()` to popup a confirmation modal dialog.
</us>

```tpl
<template>
  <div>
    <a-button @click="showConfirm">
      Confirm
    </a-button>
    <a-button @click="showDeleteConfirm" type="dashed">
      Delete
    </a-button>
    <a-button @click="showPropsConfirm" type="dashed">
      With extra props
    </a-button>
  </div>
</template>
<script>
  export default {
    methods: {
      showConfirm() {
        this.$confirm({
          title: 'Do you Want to delete these items?',
          content: h => <div style="color:red;">Some descriptions</div>,
          onOk() {
            console.log('OK');
          },
          onCancel() {
            console.log('Cancel');
          },
          class: 'test',
        });
      },

      showDeleteConfirm() {
        this.$confirm({
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
      showPropsConfirm() {
        this.$confirm({
          title: 'Are you sure delete this task?',
          content: 'Some descriptions',
          okText: 'Yes',
          okType: 'danger',
          okButtonProps: {
            props: { disabled: true },
          },
          cancelText: 'No',
          onOk() {
            console.log('OK');
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      },
    },
  };
</script>
```
