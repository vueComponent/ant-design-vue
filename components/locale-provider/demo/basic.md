<cn>
#### 国际化
用 `LocaleProvider` 包裹你的应用，并引用对应的语言包。
</cn>

<us>
#### Localization
Wrap your app with `LocaleProvider`, and apply the corresponding language package.
</us>

```html
<template>
  <a-locale-provider :locale="enUS">
    <a-pagination :defaultCurrent="1" :total="50" showSizeChanger />
  </a-locale-provider>
</template>
<script>
// you should use import enUS from 'vue-antd-ui/lib/locale-provider/en_US';
import enUS from 'vue-antd-ui/locale-provider/en_US';
export default {
  data(){
    return {
      enUS,
    }
  }
}
</script>
```
