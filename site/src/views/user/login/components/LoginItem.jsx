import ItemMap from './map';
// eslint-disable-next-line import/no-unresolved
import WrapFormItem from './WrapFormItem';

const LoginItem = {};
Object.keys(ItemMap).forEach(key => {
  const item = ItemMap[key];
  LoginItem[key] = {
    props: {
      defaultValue: String,
      name: String,
      placeholder: String,
      rules: {
        type: Array,
        default: () => item.rules,
      },
      getCaptchaButtonText: String,
      getCaptchaSecondText: String,
      getCaptcha: Function,
      countDown: Number,
      customprops: {
        type: Object,
        default: () => item.props,
      },
      type: {
        type: String,
        default: key,
      },
    },
    inject: {
      loginContext: { default: () => ({ form: {}, updateActive: () => {} }) },
    },
    render() {
      const {
        loginContext: { form, updateActive },
        $props,
        $listeners,
      } = this;
      return <WrapFormItem {...{ props: { ...$props, form, updateActive }, on: $listeners }} />;
    },
  };
});

export default LoginItem;
