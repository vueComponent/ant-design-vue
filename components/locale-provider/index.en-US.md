# LocaleProvider

`LocaleProvider` provides a uniform localization support for built-in text of components.

## Usage

`LocaleProvider` takes use of [provide/inject](https://vuejs.org/v2/api/#provide-inject), a feature of Vue, to accomplish global effectiveness by wrapping the app only once.

```html
<template>
  <a-locale-provider :locale="fr_FR">
    <App />
  </a-locale-provider>
</template>
<script>
  import fr_FR from 'ant-design-vue/lib/locale-provider/fr_FR';
  import moment from 'moment';
  import 'moment/locale/fr';

  moment.locale('fr');
  export default {
    data() {
      return {
        fr_FR,
      };
    },
  };
</script>
```

We provide some locale like English, Chinese, Russian, German, French and etc, all locale packages can be found in [here](https://github.com/vueComponent/ant-design-vue/tree/master/components/locale-provider).

Note: if you need to use antd's UMD dist file, please use `antd/dist/antd-with-locales.js` and corresponding moment locale:

```html
<template>
  <a-locale-provider :locale="locales.fr_FR">
    <App />
  </a-locale-provider>
</template>
<script>
  const { LocaleProvider, locales } = window.antd;
</script>
```

### Add a new language

If you can't find your language, you are welcome to create a locale package based on [en_US](https://github.com/vueComponent/ant-design-vue/blob/master/components/locale-provider/en_US.js) and send us a pull request.

### Other localization needs

This component aims for localization of the built-in text, if you want to support other documents, we recommend using [vue-i18n](https://github.com/kazupon/vue-i18n).

## Examples
