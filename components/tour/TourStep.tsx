import { defineComponent } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import initDefaultProps from '../_util/props-util/initDefaultProps';

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
      return (
        <div class={`${prefixCls}-content`}>
          {arrow && <div class={`${prefixCls}-arrow`} key="arrow" />}
          <div class={`${prefixCls}-inner`}>
            <button
              type="button"
              onClick={() => emit('close')}
              aria-label="Close"
              class={`${prefixCls}-close`}
            >
              <span class={`${prefixCls}-close-x`}>&times;</span>
            </button>
            <div class={`${prefixCls}-header`}>
              <div class={`${prefixCls}-title`}>{title}</div>
            </div>
            <div class={`${prefixCls}-description`}>{description}</div>
            <div class={`${prefixCls}-footer`}>
              <div class={`${prefixCls}-sliders`}>
                {total > 1
                  ? [...Array.from({ length: total }).keys()].map((item, index) => {
                      return <span key={item} class={index === current ? 'active' : ''} />;
                    })
                  : null}
              </div>
              <div class={`${prefixCls}-buttons`}>
                {current !== 0 ? (
                  <a-button class={`${prefixCls}-prev-btn`} onClick={() => emit('prev')}>
                    Prev
                  </a-button>
                ) : null}
                {current === total - 1 ? (
                  <a-button class={`${prefixCls}-finish-btn`} onClick={() => emit('finish')}>
                    Finish
                  </a-button>
                ) : (
                  <a-button class={`${prefixCls}-next-btn`} onClick={() => emit('next')}>
                    Next
                  </a-button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };
  },
});
