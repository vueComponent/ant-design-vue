import PropTypes from '../_util/vue-types';
import { getComponentFromProp, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'ACardMeta',
  props: {
    prefixCls: PropTypes.string,
    title: PropTypes.any,
    description: PropTypes.any,
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  render() {
    const { prefixCls: customizePrefixCls } = this.$props;

    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('card', customizePrefixCls);

    const classString = {
      [`${prefixCls}-meta`]: true,
    };

    const avatar = getComponentFromProp(this, 'avatar');
    const title = getComponentFromProp(this, 'title');
    const description = getComponentFromProp(this, 'description');

    const avatarDom = avatar ? <div class={`${prefixCls}-meta-avatar`}>{avatar}</div> : null;
    const titleDom = title ? <div class={`${prefixCls}-meta-title`}>{title}</div> : null;
    const descriptionDom = description ? (
      <div class={`${prefixCls}-meta-description`}>{description}</div>
    ) : null;
    const MetaDetail =
      titleDom || descriptionDom ? (
        <div class={`${prefixCls}-meta-detail`}>
          {titleDom}
          {descriptionDom}
        </div>
      ) : null;
    return (
      <div {...{ on: getListeners(this) }} class={classString}>
        {avatarDom}
        {MetaDetail}
      </div>
    );
  },
};
