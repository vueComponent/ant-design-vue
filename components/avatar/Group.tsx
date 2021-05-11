import toArray from 'lodash/toArray';
import { cloneElement } from '../_util/vnode';
import { defaultConfigProvider } from '../config-provider';
import Avatar, { avatarProps } from './Avatar';
import Popover from '../popover';
import {
  computed,
  defineComponent,
  inject,
  provide,
  PropType,
  ExtractPropTypes,
  CSSProperties,
} from 'vue';
import PropTypes from '../_util/vue-types';
import { getPropsSlot } from '../_util/props-util';

const groupProps = {
  children: PropTypes.VNodeChild,
  style: {
    type: Object as PropType<CSSProperties>,
    default: () => ({} as CSSProperties),
  },
  prefixCls: String,
  maxCount: Number,
  maxStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({} as CSSProperties),
  },
  maxPopoverPlacement: {
    type: String as PropType<'top' | 'bottom'>,
    default: 'top',
  },
  /*
   * Size of avatar, options: `large`, `small`, `default`
   * or a custom number size
   * */
  size: avatarProps.size,
};

export type AvatarGroupProps = Partial<ExtractPropTypes<typeof groupProps>>;

const Group = defineComponent({
  name: 'AAvatarGroup',
  props: groupProps,
  inheritAttrs: false,
  setup(props, { slots, attrs }) {
    const configProvider = inject('configProvider', defaultConfigProvider);

    provide(
      'SizeProvider',
      computed(() => props.size),
    );

    return () => {
      const getPrefixCls = configProvider.getPrefixCls;

      const {
        prefixCls: customizePrefixCls,
        maxPopoverPlacement = 'top',
        maxCount,
        maxStyle,
      } = props;
      const className = attrs.class as string;

      const prefixCls = getPrefixCls('avatar-group', customizePrefixCls);

      const cls = {
        [prefixCls]: true,
        [className]: className !== undefined,
      };

      const children = getPropsSlot(slots, props);
      const childrenWithProps = toArray(children).map((child, index) =>
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
            overlayClassName={`${prefixCls}-popover`}
          >
            <Avatar style={maxStyle}>{`+${numOfChildren - maxCount}`}</Avatar>
          </Popover>,
        );
        return (
          <div class={cls} style={props.style}>
            {childrenShow}
          </div>
        );
      }

      return (
        <div class={cls} style={props.style}>
          {childrenWithProps}
        </div>
      );
    };
  },
});

export default Group;
