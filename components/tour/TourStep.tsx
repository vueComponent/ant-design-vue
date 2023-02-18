import { defineComponent } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import useStyle from 'ant-design-vue/es/tour/style';

export const TourStepProps = () => ({
  prefixCls: String,
  current: Number,
  total: Number,
  title: String,
  description: String,
  arrow: Boolean,
});

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ATourStep',
  inheritAttrs: false,
  props: initDefaultProps(TourStepProps(), {}),
  setup(props, { emit }) {
    return () => {
      const { current, total, title, description, arrow } = props;
      const { prefixCls } = useConfigInject('tour', props);

      const [wrapSSR] = useStyle(prefixCls);
      return wrapSSR(
        <div class={`${prefixCls.value}-content`}>
          {arrow && <div class={`${prefixCls.value}-arrow`} key="arrow" />}
          <div class={`${prefixCls.value}-inner`}>
            <button
              type="button"
              onClick={() => emit('close')}
              aria-label="Close"
              class={`${prefixCls.value}-close`}
            >
              <span class={`${prefixCls.value}-close-x`}>&times;</span>
            </button>
            <div class={`${prefixCls.value}-header`}>
              <div class={`${prefixCls.value}-title`}>{title}</div>
            </div>
            <div class={`${prefixCls.value}-description`}>{description}</div>
            <div class={`${prefixCls.value}-footer`}>
              <div class={`${prefixCls.value}-sliders`}>
                {total > 1
                  ? [...Array.from({ length: total }).keys()].map((item, index) => {
                      return <span key={item} class={index === current ? 'active' : ''} />;
                    })
                  : null}
              </div>
              <div class={`${prefixCls.value}-buttons`}>
                {current !== 0 ? (
                  <a-button class={`${prefixCls.value}-prev-btn`} onClick={() => emit('prev')}>
                    Prev
                  </a-button>
                ) : null}
                {current === total - 1 ? (
                  <a-button class={`${prefixCls.value}-finish-btn`} onClick={() => emit('finish')}>
                    Finish
                  </a-button>
                ) : (
                  <a-button class={`${prefixCls.value}-next-btn`} onClick={() => emit('next')}>
                    Next
                  </a-button>
                )}
              </div>
            </div>
          </div>
        </div>,
      );
    };
  },
});
