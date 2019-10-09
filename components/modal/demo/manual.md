<cn>
#### 手动更新和移除
手动更新和关闭 `Modal.method` 方式创建的对话框。
</cn>

<us>
#### Manual to update destroy
Manually updateing and destroying a modal from `Modal.method`.
</us>

```tpl
<template>
  <a-button @click="countDown">Open modal to close in 5s</a-button>
</template>
<script>
  export default {
    methods: {
      countDown() {
        let secondsToGo = 5;
        const modal = this.$success({
          title: 'This is a notification message',
          content: `This modal will be destroyed after ${secondsToGo} second.`,
        });
        const interval = setInterval(() => {
          secondsToGo -= 1;
          modal.update({
            content: `This modal will be destroyed after ${secondsToGo} second.`,
          });
        }, 1000);
        setTimeout(() => {
          clearInterval(interval);
          modal.destroy();
        }, secondsToGo * 1000);
      },
    },
  };
</script>
```
