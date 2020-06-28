import warning from '../_util/warning';

const Icon = {
  name: 'AIcon',
  render() {
    warning(false, 'Icon', 'Empty Icon');
    return null;
  },
};

/* istanbul ignore next */
Icon.install = function(app) {
  app.component(Icon.name, Icon);
};

export default Icon;
