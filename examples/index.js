import 'babel-polyfill';
import { createApp } from 'vue';
import App from './App.vue';
import 'ant-design-vue/style.js';

const app = createApp({
  setup() {
    return App;
  },
  render() {
    return <App></App>;
  },
});
app.mount('#app');
