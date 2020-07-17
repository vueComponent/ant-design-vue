<template>
  <input v-model="input" :maxlength="number" />
</template>

<script>
import enUS from 'ant-design-vue/../components/locale/en_US';
import zhCN from 'ant-design-vue/../components/locale/zh_CN';
export default {
  name: 'Demo',
  data() {
    return {
      color: '#ccc',
      color2: '#ccc',
      disabled: false,
      format: '',
      locale: enUS,
      enUS,
      zhCN,
      config1: {
        swatches: [
          'rgba(244, 67, 54, 1)',
          'rgba(233, 30, 99, 0.95)',
          'rgba(156, 39, 176, 0.9)',
          'rgba(103, 58, 183, 0.85)',
          'rgba(63, 81, 181, 0.8)',
          'rgba(33, 150, 243, 0.75)',
          'rgba(3, 169, 244, 0.7)',
          'rgba(0, 188, 212, 0.7)',
          'rgba(0, 150, 136, 0.75)',
          'rgba(76, 175, 80, 0.8)',
          'rgba(139, 195, 74, 0.85)',
          'rgba(205, 220, 57, 0.9)',
          'rgba(255, 235, 59, 0.95)',
          'rgba(255, 193, 7, 1)',
        ],
      },
      config2: {
        components: {
          // Main components
          preview: true,
          opacity: true,
          hue: true,
          interaction: {
            hex: true,
            rgba: true,
            hsla: true,
            hsva: true,
            cmyk: true,
            input: true,
            clear: true,
            save: true,
          },
          strings: {
            save: 'Save',
            clear: 'Clear',
            cancel: 'Cancel',
          },
        },
      },
      input: '',
      number: 10,
    };
  },
  methods: {
    changeHandler(...arg) {
      arg;
      // console.log(arg);
    },
    changeLocale(e) {
      const localeValue = e.target.value;
      this.locale = localeValue;
    },
  },
};
</script>
