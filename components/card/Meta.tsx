import { defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import { getPropsSlot } from '../_util/props-util';
import useConfigInject from '../_util/hooks/useConfigInject';

export default defineComponent({
  name: 'ACardMeta',
  props: {
    prefixCls: PropTypes.string,
    title: PropTypes.any,
    description: PropTypes.any,
    avatar: PropTypes.any,
  },
  slots: ['title', 'description', 'avatar'],
  setup(props, { slots }) {
    const { prefixCls } = useConfigInject('card', props);
    return () => {
      const classString = {
        [`${prefixCls.value}-meta`]: true,
      };
      const avatar = getPropsSlot(slots, props, 'avatar');
      const title = getPropsSlot(slots, props, 'title');
      const description = getPropsSlot(slots, props, 'description');

      const avatarDom = avatar ? (
        <div class={`${prefixCls.value}-meta-avatar`}>{avatar}</div>
      ) : null;
      const titleDom = title ? <div class={`${prefixCls.value}-meta-title`}>{title}</div> : null;
      const descriptionDom = description ? (
        <div class={`${prefixCls.value}-meta-description`}>{description}</div>
      ) : null;
      const MetaDetail =
        titleDom || descriptionDom ? (
          <div class={`${prefixCls.value}-meta-detail`}>
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
    };
  },
});
