# LocaleProvider 国际化

为组件内建文案提供统一的国际化支持。

## 使用

LocaleProvider 使用 Vue 的 [provide/inject](https://cn.vuejs.org/v2/api/#provide-inject) 特性，只需在应用外围包裹一次即可全局生效。

```html
<template>
  <a-locale-provider :locale="zh_CN">
    <App />
  </a-locale-provider>
</template>
<script>
  import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import moment from 'moment';
  import 'moment/locale/zh-cn';

  moment.locale('zh-cn');
  export default {
    data() {
      return {
        zh_CN,
      };
    },
  };
</script>
```

我们提供了英语，中文，俄语，法语，德语等多种语言支持，所有语言包可以在 [这里](https://github.com/vueComponent/ant-design-vue/tree/master/components/locale-provider) 找到。

注意：如果你需要使用 UMD 版的 dist 文件，应该引入 `antd/dist/antd-with-locales.js`，同时引入 moment 对应的 locale，然后按以下方式使用：

```html
<template>
  <a-locale-provider :locale="locales.en_US">
    <App />
  </a-locale-provider>
</template>
<script>
  const { LocaleProvider, locales } = window.antd;
</script>
```

### 增加语言包

如果你找不到你需要的语言包，欢迎你在 [英文语言包](https://github.com/vueComponent/ant-design-vue/blob/master/components/locale-provider/en_US.js) 的基础上创建一个新的语言包，并给我们 Pull Request。

### 其他国际化需求

本模块仅用于组件的内建文案，若有业务文案的国际化需求，建议使用 [vue-i18n](https://github.com/kazupon/vue-i18n)

## 代码演示
