import type { CSSProperties, PropType } from 'vue';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import type { PosInfo } from './hooks/useTarget';
import useId from '../_util/hooks/useId';

const COVER_PROPS = {
  fill: 'transparent',
  pointerEvents: 'auto',
};

export interface MaskProps {
  prefixCls?: string;
  pos: PosInfo; //	获取引导卡片指向的元素
  rootClassName?: string;
  showMask?: boolean;
  style?: CSSProperties;
  fill?: string;
  open?: boolean;
  animated?: boolean | { placeholder: boolean };
  zIndex?: number;
}
const Mask = defineComponent({
  name: 'Mask',
  props: {
    prefixCls: { type: String },
    pos: { type: Object as PropType<PosInfo> }, //	获取引导卡片指向的元素
    rootClassName: { type: String },
    showMask: { type: Boolean },
    fill: { type: String, default: 'rgba(0,0,0,0.5)' },
    open: { type: Boolean },
    animated: { type: [Boolean, Object] as PropType<boolean | { placeholder: boolean }> },
    zIndex: { type: Number },
  },
  setup(props, { attrs }) {
    return () => {
      const { prefixCls, rootClassName, pos, showMask, fill, animated, zIndex } = props;

      const id = useId();
      const maskId = `${prefixCls}-mask-${id}`;
      const mergedAnimated = typeof animated === 'object' ? animated?.placeholder : animated;

      return (
        <div
          {...attrs}
          class={classNames(`${prefixCls}-mask`, rootClassName, attrs.class)}
          style={[
            {
              position: 'fixed',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex,
              pointerEvents: 'none',
            },
          ]}
        >
          {showMask ? (
            <svg
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <defs>
                <mask id={maskId}>
                  <rect x="0" y="0" width="100vw" height="100vh" fill="white" />
                  {pos && (
                    <rect
                      x={pos.left}
                      y={pos.top}
                      rx={pos.radius}
                      width={pos.width}
                      height={pos.height}
                      fill="black"
                      class={mergedAnimated ? `${prefixCls}-placeholder-animated` : ''}
                    />
                  )}
                </mask>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill={fill} mask={`url(#${maskId})`} />

              {/* Block click region */}
              {pos && (
                <>
                  <rect {...COVER_PROPS} x="0" y="0" width="100%" height={pos.top} />
                  <rect {...COVER_PROPS} x="0" y="0" width={pos.left} height="100%" />
                  <rect
                    {...COVER_PROPS}
                    x="0"
                    y={pos.top + pos.height}
                    width="100%"
                    height={`calc(100vh - ${pos.top + pos.height}px)`}
                  />
                  <rect
                    {...COVER_PROPS}
                    x={pos.left + pos.width}
                    y="0"
                    width={`calc(100vw - ${pos.left + pos.width}px)`}
                    height="100%"
                  />
                </>
              )}
            </svg>
          ) : null}
        </div>
      );
    };
  },
});

export default Mask;
