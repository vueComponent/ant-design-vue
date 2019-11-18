<cn>
#### 图标
可口的图标让信息类型更加醒目。
</cn>

<us>
#### Icon
Decent icon make information more clear and more friendly.
</us>

```tpl
<template>
  <div>
    <a-alert message="Success Tips" type="success" showIcon />
    <a-alert message="Informational Notes" type="info" showIcon />
    <a-alert message="Warning" type="warning" showIcon />
    <a-alert message="Error" type="error" showIcon />
    <a-alert
      message="Success Tips"
      description="Detailed description and advices about successful copywriting."
      type="success"
      showIcon
    />
    <a-alert
      message="Informational Notes"
      description="Additional description and informations about copywriting."
      type="info"
      showIcon
    />
    <a-alert
      message="Warning"
      description="This is a warning notice about copywriting."
      type="warning"
      showIcon
    />
    <a-alert
      message="Error"
      description="This is an error message about copywriting."
      type="error"
      showIcon
    />
  </div>
</template>
```
