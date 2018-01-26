<cn>
#### 自动调整字符大小
对于字符型的头像，当字符串较长时，字体大小可以根据头像宽度自动调整。
</cn>

<us>
#### Autoset Font Size
For letter type Avatar, when the letters are too long to display, the font size can be automatically adjusted according to the width of the Avatar.
</us>

```html
<template>
  <div>
    <a-avatar shape="square" size="large" :style="{'backgroundColor': color}">{{avatarValue}}</a-avatar>
    <a-button @click="changeValue">改变</a-button>
  </div>
</template>
```
