import ref from 'vue-ref';
// import { antInput } from './antInputDirective';
import { antDecorator } from './FormDecoratorDirective';
import { antPortal } from './portalDirective';

export default {
  install: Vue => {
    Vue.use(ref, { name: 'ant-ref' });
    antDecorator(Vue);
    antPortal(Vue);
  },
};
