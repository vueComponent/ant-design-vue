import Avatar from './Avatar';
import Base from '../base';

/* istanbul ignore next */
Avatar.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Avatar.name, Avatar);
};

export default Avatar;
