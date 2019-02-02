import { antInput } from './antInputDirective';
import { antDecorator } from './FormDecoratorDirective';

export default {
  install: Vue => {
    antInput(Vue);
    antDecorator(Vue);
  },
};
