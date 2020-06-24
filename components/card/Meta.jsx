import { inject } from 'vue';
import PropTypes from '../_util/vue-types';
import { getComponent } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider';

export default {
  name: 'ACardMeta',
  props: {
    prefixCls: PropTypes.string,
    title: PropTypes.any,
    description: PropTypes.any,
    avatar: PropTypes.any,
  },
  setup() {
    return {
      configProvider: inject('configProvider', ConfigConsumerProps),
    };
  },
  render() {
    const { prefixCls: customizePrefixCls } = this.$props;

    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('card', customizePrefixCls);

    const classString = {
      [`${prefixCls}-meta`]: true,
    };

    const avatar = getComponent(this, 'avatar');
    const title = getComponent(this, 'title');
    const description = getComponent(this, 'description');

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
      <div class={classString}>
        {avatarDom}
        {MetaDetail}
      </div>
    );
  },
};
