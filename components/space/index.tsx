import { inject, App, CSSProperties, SetupContext } from 'vue';
import { filterEmpty } from '../_util/props-util';
import { defaultConfigProvider, SizeType } from '../config-provider';

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24,
};

export interface SpaceProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  size?: SizeType | number;
  direction?: 'horizontal' | 'vertical';
  // No `stretch` since many components do not support that.
  align?: 'start' | 'end' | 'center' | 'baseline';
}

const Space = (props: SpaceProps, { slots }: SetupContext) => {
  const configProvider = inject('configProvider', defaultConfigProvider);
  const { align, size = 'small', direction = 'horizontal', prefixCls: customizePrefixCls } = props;

  const { getPrefixCls } = configProvider;
  const prefixCls = getPrefixCls('space', customizePrefixCls);
  const items = filterEmpty(slots.default?.());
  const len = items.length;

  if (len === 0) {
    return null;
  }

  const mergedAlign = align === undefined && direction === 'horizontal' ? 'center' : align;

  const someSpaceClass = {
    [prefixCls]: true,
    [`${prefixCls}-${direction}`]: true,
    [`${prefixCls}-align-${mergedAlign}`]: mergedAlign,
  };

  const itemClassName = `${prefixCls}-item`;
  const marginDirection = 'marginRight'; // directionConfig === 'rtl' ? 'marginLeft' : 'marginRight';

  return (
    <div class={someSpaceClass}>
      {items.map((child, i) => (
        <div
          class={itemClassName}
          key={`${itemClassName}-${i}`}
          style={
            i === len - 1
              ? {}
              : {
                  [direction === 'vertical' ? 'marginBottom' : marginDirection]:
                    typeof size === 'string' ? `${spaceSize[size]}px` : `${size}px`,
                }
          }
        >
          {child}
        </div>
      ))}
    </div>
  );
};

Space.displayName = 'ASpace';

/* istanbul ignore next */
Space.install = function(app: App) {
  app.component(Space.displayName, Space);
};

export default Space;
