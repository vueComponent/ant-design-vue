import PropTypes from '../_util/vue-types';
import Empty from '../empty';
import emptyImg from './empty.svg';
import { ConfigConsumerProps } from './';

const RenderEmpty = {
  functional: true,
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  props: {
    componentName: PropTypes.string,
  },
  render(createElement, context) {
    const { props, injections } = context;
    function renderHtml(componentName) {
      const getPrefixCls = injections.configProvider.getPrefixCls;
      const prefix = getPrefixCls('empty');
      switch (componentName) {
        case 'Table':
        case 'List':
          return <Empty image={emptyImg} class={`${prefix}-normal`} />;

        case 'Select':
        case 'TreeSelect':
        case 'Cascader':
        case 'Transfer':
          return <Empty image={emptyImg} class={`${prefix}-small`} />;

        default:
          return <Empty />;
      }
    }
    return renderHtml(props.componentName);
  },
};

function renderEmpty(h, componentName) {
  return <RenderEmpty componentName={componentName} />;
}

export default renderEmpty;
