<cn>
#### 类型
支持三种类型：图片、Icon 以及字符，其中 Icon 和字符型可以自定义图标颜色及背景色。
</cn>

<us>
#### Type
Image, Icon and letter are supported, and the latter two kinds avatar can have custom colors and background colors.
</us>

```tpl
<template>
  <div>
    <a-avatar icon="user" />
    <a-avatar>U</a-avatar>
    <a-avatar>USER</a-avatar>
    <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
    <a-avatar style="color: #f56a00; backgroundColor: #fde3cf">U</a-avatar>
    <a-avatar style="backgroundColor:#87d068" icon="user" />
  </div>
</template>
```
