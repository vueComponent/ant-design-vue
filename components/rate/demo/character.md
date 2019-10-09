<cn>
#### 其他字符
可以将星星替换为其他字符，比如字母，数字，字体图标甚至中文。
</cn>

<us>
#### Other Character
Replace the default star to other character like alphabet, digit, iconfont or even Chinese word.
</us>

```tpl
<template>
  <div>
    <a-rate allowHalf>
      <a-icon slot="character" type="heart" />
    </a-rate>
    <br />
    <a-rate character="A" allowHalf style="fontSize: 36px" />
    <br />
    <a-rate character="好" allowHalf />
    <br />
  </div>
</template>
```
