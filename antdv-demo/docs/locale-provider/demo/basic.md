<cn>
#### 国际化
用 `LocaleProvider` 包裹你的应用，并引用对应的语言包。
</cn>

<us>
#### Localization
Wrap your app with `LocaleProvider`, and apply the corresponding language package.
</us>

```vue
<template>
  <a-locale-provider :locale="zhCN">
    <a-pagination :default-current="1" :total="50" show-size-changer />
  </a-locale-provider>
</template>
<script>
// you should use import zhCN from 'ant-design-vue/es/locale-provider/zh_CN';
import zhCN from 'ant-design-vue/es/locale-provider/zh_CN';
export default {
  data() {
    return {
      zhCN,
    };
  },
};
</script>
```
