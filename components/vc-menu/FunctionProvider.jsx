export const injectExtraPropsKey = 'ANT_MENU_PROVIDER_PROPS_KEY';
const FunctionProvider = {
  inheritAttrs: false,
  provide() {
    return {
      [injectExtraPropsKey]: this,
    };
  },
  render() {
    const { $slots: slots } = this;
    return slots.default[0];
  },
};

export default FunctionProvider;
