
import { storeShape } from './PropTypes'
export default {
  name: 'StoreProvider',
  props: {
    store: storeShape.isRequired,
  },
  provide () {
    return {
      _store: this.$props,
    }
  },
  render () {
    return this.$slots.default[0]
  },
}
