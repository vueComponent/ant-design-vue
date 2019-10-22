<cn>
#### 额外的页脚
在浮层中加入额外的页脚，以满足某些定制信息的需求。
</cn>

<us>
#### Extra Footer
Render extra footer in panel for customized requirements.
</us>

```tpl
<template>
  <div>
    <a-date-picker>
      <template slot="renderExtraFooter">
        extra footer
      </template>
    </a-date-picker>
    <a-date-picker showTime>
      <template slot="renderExtraFooter">
        extra footer
      </template>
    </a-date-picker>
    <a-range-picker>
      <template slot="renderExtraFooter">
        extra footer
      </template>
    </a-range-picker>
    <a-range-picker showTime>
      <template slot="renderExtraFooter">
        extra footer
      </template>
    </a-range-picker>
    <a-month-picker placeholder="Select month">
      <template slot="renderExtraFooter">
        extra footer
      </template>
    </a-month-picker>
  </div>
</template>
```
