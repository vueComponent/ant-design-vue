import Base from '../base';
import Typography from './Typography';

Typography.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Typography.name, Typography);
  Vue.component(Typography.Text.name, Typography.Text);
  Vue.component(Typography.Title.name, Typography.Title);
  Vue.component(Typography.Paragraph.name, Typography.Paragraph);
};

export default Typography;
