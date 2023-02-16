import { defineComponent } from 'vue';
import useId from '../vc-select/hooks/useId';
import initDefaultProps from '../_util/props-util/initDefaultProps';

const COVER_PROPS = {
  fill: 'transparent',
  pointerEvents: 'auto',
};
export const TourMask = () => ({
  prefixCls: String,
  pos: Object, //	获取引导卡片指向的元素
  showMask: Boolean,
  style: Object,
  animated: Boolean,
  fill: String,
});

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATourMask',
  inheritAttrs: false,
  props: initDefaultProps(TourMask(), {}),
  setup(props) {
    return () => {
      const { prefixCls, showMask, style = {}, pos, animated, fill = 'rgba(0,0,0,0.5)' } = props;
      const id = useId();
      const maskId = `${prefixCls}-mask-${id}`;
      return () => (
        <div class={'Portal'}>
          <div
            class={`${prefixCls}-mask`}
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: 900,
              pointerEvents: 'none',
              ...style,
            }}
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
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    {pos && (
                      <rect
                        x={pos.left}
                        y={pos.top}
                        rx={pos.radius}
                        width={pos.width}
                        height={pos.height}
                        fill="black"
                        class={animated ? `${prefixCls}-placeholder-animated` : ''}
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
        </div>
      );
    };
  },
});
