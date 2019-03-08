import PropTypes from '../_util/vue-types';
import Empty from '../empty';
import emptyImg from './empty.svg';

const renderEmpty = {
  functional: true,
  inject: ['configProvider'],
  props: {
    componentName: PropTypes.string,
  },
  render(createElement, context) {
    const { props, injections } = context;
    function renderHtml(componentName) {
      const prefix = injections.configProvider.getPrefixCls('empty');
      switch (componentName) {
        case 'Table':
        case 'List':
          return <Empty image={emptyImg} className={`${prefix}-normal`} />;

        case 'Select':
        case 'TreeSelect':
        case 'Cascader':
        case 'Transfer':
          return <Empty image={emptyImg} className={`${prefix}-small`} />;

        default:
          return <Empty />;
      }
    }
    return renderHtml(props.componentName);
  },
};

export default renderEmpty;
