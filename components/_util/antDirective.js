import { antInput } from './antInputDirective';
import { antDecorator } from './FormDecoratorDirective';

export default {
  install: (Vue, options) => {
    antInput(Vue);
    antDecorator(Vue);
  },
};
