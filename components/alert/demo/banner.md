<cn>
#### 顶部公告
页面顶部通告形式，默认有图标且`type` 为 'warning'。
</cn>

<us>
#### Banner
Display Alert as a banner at top of page.
</us>

```tpl
<template>
  <div>
    <a-alert message="Warning text" banner />
    <br />
    <a-alert
      message="Very long warning text warning text text text text text text text"
      banner
      closable
    />
    <br />
    <a-alert :showIcon="false" message="Warning text without icon" banner />
    <br />
    <a-alert type="error" message="Error text" banner />
  </div>
</template>
```
