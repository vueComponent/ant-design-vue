<cn>
#### 自动调整字符大小
对于字符型的头像，当字符串较长时，字体大小可以根据头像宽度自动调整。
</cn>

<us>
#### Autoset Font Size
For letter type Avatar, when the letters are too long to display, the font size can be automatically adjusted according to the width of the Avatar.
</us>

```tpl
<template>
  <div>
    <a-avatar shape="square" size="large" :style="{backgroundColor: color, verticalAlign: 'middle'}"
      >{{avatarValue}}</a-avatar
    >
    <a-button size="small" :style="{ marginLeft: 16, verticalAlign: 'middle' }" @click="changeValue"
      >改变</a-button
    >
  </div>
</template>
<script>
  const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
  const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
  export default {
    data() {
      return {
        avatarValue: UserList[0],
        color: colorList[0],
      };
    },
    methods: {
      changeValue() {
        const index = UserList.indexOf(this.avatarValue);
        this.avatarValue = index < UserList.length - 1 ? UserList[index + 1] : UserList[0];
        this.color = index < colorList.length - 1 ? colorList[index + 1] : colorList[0];
      },
    },
  };
</script>
```
