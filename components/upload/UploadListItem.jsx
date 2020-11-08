import PropTypes from '../_util/vue-types';
import { getOptionProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'AUploadListItem',
  props: {
    prefixCls: PropTypes.string,
    href: PropTypes.string,
    overlay: PropTypes.any,
    data: PropTypes.any,
    children: PropTypes.any,
    file: PropTypes.any,
    infoUploadingClass: PropTypes.any,
    iconAndPreview: PropTypes.any,
    transitionProps: PropTypes.any,
    progress: PropTypes.any,
    actions: PropTypes.any,
    on: PropTypes.any,
    itemStyle: PropTypes.any,
    children: PropTypes.any,
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  methods: {
    actionsRender(actions, children) {
      if (!actions) throw new Error('you need use listType api with picture-card moudle');
      return actions(children);
    },
  },
  render() {
    const {
      prefixCls,
      file,
      infoUploadingClass,
      iconAndPreview,
      transitionProps,
      progress,
      actions,
      children,
      on,
      itemStyle,
    } = getOptionProps(this);
    const itemProps = {
      class: infoUploadingClass,
      key: file.uid,
      on,
      style: itemStyle,
    };
    return (
      <div {...itemProps}>
        <div class={`${prefixCls}-list-item-info`}>{iconAndPreview}</div>
        {children !== undefined ? this.actionsRender(actions, children) : actions(children)}
        <transition {...transitionProps}>{progress}</transition>
      </div>
    );
  },
};
