import { cloneElement } from '../_util/vnode';
import type { AvatarSize } from './Avatar';
import Avatar from './Avatar';
import Popover from '../popover';
import type { PropType, ExtractPropTypes, CSSProperties } from 'vue';
import { defineComponent } from 'vue';
import { flattenChildren, getPropsSlot } from '../_util/props-util';
import useConfigInject from '../_util/hooks/useConfigInject';
import useProvideSize from '../_util/hooks/useSize';

export const groupProps = () => ({
  prefixCls: String,
  maxCount: Number,
  maxStyle: { type: Object as PropType<CSSProperties>, default: undefined as CSSProperties },
  maxPopoverPlacement: { type: String as PropType<'top' | 'bottom'>, default: 'top' },
  maxPopoverTrigger: String as PropType<'hover' | 'focus' | 'click'>,
  /*
   * Size of avatar, options: `large`, `small`, `default`
   * or a custom number size
   * */
  size: {
    type: [Number, String, Object] as PropType<AvatarSize>,
    default: 'default' as AvatarSize,
  },
});

export type AvatarGroupProps = Partial<ExtractPropTypes<ReturnType<typeof groupProps>>>;

const Group = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AAvatarGroup',
  inheritAttrs: false,
  props: groupProps(),
  setup(props, { slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('avatar-group', props);
    useProvideSize<AvatarSize>(props);
    return () => {
      const {
        maxPopoverPlacement = 'top',
        maxCount,
        maxStyle,
        maxPopoverTrigger = 'hover',
      } = props;

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
            trigger={maxPopoverTrigger}
            placement={maxPopoverPlacement}
            overlayClassName={`${prefixCls.value}-popover`}
          >
            <Avatar style={maxStyle}>{`+${numOfChildren - maxCount}`}</Avatar>
          </Popover>,
        );
        return (
          <div {...attrs} class={cls} style={attrs.style as CSSProperties}>
            {childrenShow}
          </div>
        );
      }

      return (
        <div {...attrs} class={cls} style={attrs.style as CSSProperties}>
          {childrenWithProps}
        </div>
      );
    };
  },
});

export default Group;
