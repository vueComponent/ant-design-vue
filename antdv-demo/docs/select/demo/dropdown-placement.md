<cn>
#### 设置下拉框出现位置
使用 `dropdownPlacement` 控制下拉框出现位置。
</cn>

<us>
#### Location of the dropdown box
Use 'dropdownPlacement' to control where the dropdown box appears.
</us>

```vue
<template>
  <a-select
    style="width: 200px;"
    :dropdown-match-select-width="false"
    :dropdown-style="{ width: '350px' }"
    dropdown-placement="bottomRight"
    placeholder="Dropdown placement"
  >
    <a-select-option label="label1" value="value1" style="height: 60px;">
      <div>
        Long long text1
      </div>
    </a-select-option>
    <a-select-option label="label2" value="vlaue2" style="height: 60px;">
      <div>
        Long long text2
      </div>
    </a-select-option>
  </a-select>
</template>
<script>
export default {};
</script>
```
