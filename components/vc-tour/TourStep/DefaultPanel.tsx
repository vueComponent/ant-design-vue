import { defineComponent } from 'vue';
import classNames from '../../_util/classNames';
import { tourStepProps } from '../interface';
import type { TourStepProps } from '../interface';

const DefaultPanel = defineComponent({
  name: 'DefaultPanel',
  inheritAttrs: false,
  props: tourStepProps(),
  setup(props, { attrs }) {
    return () => {
      const { prefixCls, current, total, title, description, onClose, onPrev, onNext, onFinish } =
        props as TourStepProps;
      return (
        <div {...attrs} class={classNames(`${prefixCls}-content`, attrs.class)}>
          <div class={`${prefixCls}-inner`}>
            <button type="button" onClick={onClose} aria-label="Close" class={`${prefixCls}-close`}>
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
                  <button class={`${prefixCls}-prev-btn`} onClick={onPrev}>
                    Prev
                  </button>
                ) : null}
                {current === total - 1 ? (
                  <button class={`${prefixCls}-finish-btn`} onClick={onFinish}>
                    Finish
                  </button>
                ) : (
                  <button class={`${prefixCls}-next-btn`} onClick={onNext}>
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };
  },
});

export default DefaultPanel;
