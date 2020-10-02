import '@babel/polyfill';
import { createApp, version } from 'vue';
import App from './App.vue';
// import App from './components/BackTop';
// eslint-disable-next-line no-console
console.log('Vue version: ', version);

const app = createApp(App);
app.mount('#app');
