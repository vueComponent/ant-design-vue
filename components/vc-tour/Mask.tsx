import type { CSSProperties } from 'vue';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import type { PosInfo } from './hooks/useTarget';
import useId from '../_util/hooks/useId';
import Portal from '../_util/PortalWrapper';
import { someType, objectType, booleanType } from '../_util/type';

const COVER_PROPS = {
  fill: 'transparent',
  'pointer-events': 'auto',
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
  name: 'TourMask',
  props: {
    prefixCls: { type: String },
    pos: objectType<PosInfo>(), //	获取引导卡片指向的元素
    rootClassName: { type: String },
    showMask: booleanType(),
    fill: { type: String, default: 'rgba(0,0,0,0.5)' },
    open: booleanType(),
    animated: someType<boolean | { placeholder: boolean }>([Boolean, Object]),
    zIndex: { type: Number },
  },
  setup(props, { attrs }) {
    const id = useId();
    return () => {
      const { prefixCls, open, rootClassName, pos, showMask, fill, animated, zIndex } = props;

      const maskId = `${prefixCls}-mask-${id}`;
      const mergedAnimated = typeof animated === 'object' ? animated?.placeholder : animated;
      return (
        <Portal
          visible={open}
          autoLock
          v-slots={{
            default: () =>
              open && (
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
                    attrs.style as CSSProperties,
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
                      <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill={fill}
                        mask={`url(#${maskId})`}
                      />

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
              ),
          }}
        />
      );
    };
  },
});

export default Mask;
