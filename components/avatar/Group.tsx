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
import { tuple } from '../_util/type';

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

export type AvatarGroupProps = Partial<ExtractPropTypes<typeof groupProps>>;

const Group = defineComponent({
  name: 'AAvatarGroup',
  props: groupProps,
  inheritAttrs: false,
  setup(props, { slots, attrs }) {
    const configProvider = inject('configProvider', defaultConfigProvider);

    provide(
      'SizeProvider',
      computed(() => props.size || configProvider.componentSize),
    );

    return () => {
      const {
        prefixCls: customizePrefixCls,
        maxPopoverPlacement = 'top',
        maxCount,
        maxStyle,
      } = props;

      const { getPrefixCls } = configProvider;
      const prefixCls = getPrefixCls('avatar-group', customizePrefixCls);
      const className = attrs.class as string;

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
          <div class={cls} style={attrs.style}>
            {childrenShow}
          </div>
        );
      }

      return (
        <div class={cls} style={attrs.style}>
          {childrenWithProps}
        </div>
      );
    };
  },
});

export default Group;
