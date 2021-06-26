import { cloneElement } from '../_util/vnode';
import type { AvatarSize } from './Avatar';
import Avatar, { avatarProps } from './Avatar';
import Popover from '../popover';
import type { PropType, ExtractPropTypes, CSSProperties } from 'vue';
import { defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import { flattenChildren, getPropsSlot } from '../_util/props-util';
import { tuple } from '../_util/type';
import useConfigInject from '../_util/hooks/useConfigInject';
import useProvideSize from '../_util/hooks/useSize';

const groupProps = {
  prefixCls: PropTypes.string,
  maxCount: PropTypes.number,
  maxStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({} as CSSProperties),
  },
  maxPopoverPlacement: PropTypes.oneOf(tuple('top', 'bottom')).def('top'),
  /*
   * Size of avatar, options: `large`, `small`, `default`
   * or a custom number size
   * */
  size: avatarProps.size,
};

export type AvatarGroupProps = Partial<ExtractPropTypes<typeof groupProps>> & {
  size?: AvatarSize;
};

const Group = defineComponent({
  name: 'AAvatarGroup',
  inheritAttrs: false,
  props: groupProps,
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('avatar-group', props);
    useProvideSize<AvatarSize>(props);
    return () => {
      const { maxPopoverPlacement = 'top', maxCount, maxStyle } = props;

      const cls = {
        [prefixCls.value]: true,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${attrs.class}`]: !!attrs.class,
      };

      const children = getPropsSlot(slots, props);
      const childrenWithProps = flattenChildren(children).map((child, index) =>
        cloneElement(child, {
          key: `avatar-key-${index}`,
        }),
      );

      const numOfChildren = childrenWithProps.length;
      if (maxCount && maxCount < numOfChildren) {
        const childrenShow = childrenWithProps.slice(0, maxCount);
        const childrenHidden = childrenWithProps.slice(maxCount, numOfChildren);

        childrenShow.push(
          <Popover
            key="avatar-popover-key"
            content={childrenHidden}
            trigger="hover"
            placement={maxPopoverPlacement}
            overlayClassName={`${prefixCls.value}-popover`}
          >
            <Avatar style={maxStyle}>{`+${numOfChildren - maxCount}`}</Avatar>
          </Popover>,
        );
        return (
          <div {...attrs} class={cls} style={attrs.style}>
            {childrenShow}
          </div>
        );
      }

      return (
        <div {...attrs} class={cls} style={attrs.style}>
          {childrenWithProps}
        </div>
      );
    };
  },
});

export default Group;
