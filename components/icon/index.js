import warning from '../_util/warning';
import Base from '../base';

const Icon = {
  functional: true,
  name: 'AIcon',
  render() {
    warning(false, 'Icon', 'Empty Icon');
    return null;
  },
};

/* istanbul ignore next */
Icon.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Icon.name, Icon);
};

export default Icon;
