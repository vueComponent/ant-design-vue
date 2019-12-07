<cn>
#### 单选组合 - 配合 name 使用
可以为 RadioGroup 配置 `name` 参数，为组合内的 input 元素赋予相同的 `name` 属性，使浏览器把 RadioGroup 下的 Radio 真正看作是一组（例如可以通过方向键始终**在同一组内**更改选项）。
</cn>

<us>
#### RadioGroup with name
Passing the `name` property to all `input[type="radio"]` that are in the same RadioGroup. It is usually used to let the browser see your RadioGroup as a real "group" and keep the default behavior. For example, using left/right keyboard arrow to change your selection that in the same RadioGroup.
</us>

```tpl
<template>
  <a-radio-group name="radioGroup" :defaultValue="1">
    <a-radio :value="1">A</a-radio>
    <a-radio :value="2">B</a-radio>
    <a-radio :value="3">C</a-radio>
    <a-radio :value="4">D</a-radio>
  </a-radio-group>
</template>
```
