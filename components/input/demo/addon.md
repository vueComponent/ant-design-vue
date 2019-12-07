<cn>
#### 前置/后置标签
用于配置一些固定组合。
</cn>

<us>
#### Pre / Post tab
Using pre & post tabs example.
</us>

```tpl
<template>
  <div>
    <div style="margin-bottom: 16px">
      <a-input addonBefore="Http://" addonAfter=".com" defaultValue="mysite" />
    </div>
    <div style="margin-bottom: 16px">
      <a-input defaultValue="mysite">
        <a-select slot="addonBefore" defaultValue="Http://" style="width: 90px">
          <a-select-option value="Http://">Http://</a-select-option>
          <a-select-option value="Https://">Https://</a-select-option>
        </a-select>
        <a-select slot="addonAfter" defaultValue=".com" style="width: 80px">
          <a-select-option value=".com">.com</a-select-option>
          <a-select-option value=".jp">.jp</a-select-option>
          <a-select-option value=".cn">.cn</a-select-option>
          <a-select-option value=".org">.org</a-select-option>
        </a-select>
      </a-input>
    </div>
    <div style="margin-bottom: 16px">
      <a-input defaultValue="mysite">
        <a-icon slot="addonAfter" type="setting" />
      </a-input>
    </div>
  </div>
</template>
```
