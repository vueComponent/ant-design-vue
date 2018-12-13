import { antInput } from './antInputDirective'
import { antRef } from './antRefDirective'
import { antDecorator } from './FormDecoratorDirective'

export default {
  install: (Vue, options) => {
    antInput(Vue)
    antRef(Vue)
    antDecorator(Vue)
  },
}
