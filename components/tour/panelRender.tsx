import { computed, defineComponent, toRefs } from 'vue';
import classNames from '../_util/classNames';
import { isFunction } from '../_util/util';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import { tourStepProps } from './interface';
import type { TourBtnProps } from './interface';

import LocaleReceiver from '../locale/LocaleReceiver';
import Button from '../button';
import type { ButtonProps } from '../button';
import defaultLocale from '../locale/en_US';

import type { VueNode } from '../_util/type';

const panelRender = defineComponent({
  name: 'ATourPanel',
  inheritAttrs: false,
  props: tourStepProps(),
  setup(props, { attrs, slots }) {
    const { current, total } = toRefs(props);

    const isLastStep = computed(() => current.value === total.value - 1);

    const prevBtnClick = e => {
      const prevButtonProps = props.prevButtonProps as TourBtnProps;
      props.onPrev?.(e);
      if (typeof prevButtonProps?.onClick === 'function') {
        prevButtonProps?.onClick();
      }
    };

    const nextBtnClick = e => {
      const nextButtonProps = props.nextButtonProps as TourBtnProps;
      if (isLastStep.value) {
        props.onFinish?.(e);
      } else {
        props.onNext?.(e);
      }
      if (typeof nextButtonProps?.onClick === 'function') {
        nextButtonProps?.onClick();
      }
    };

    return () => {
      const { prefixCls, title, onClose, cover, description, type: stepType, arrow } = props;

      const prevButtonProps = props.prevButtonProps as TourBtnProps;
      const nextButtonProps = props.nextButtonProps as TourBtnProps;

      let headerNode: VueNode;
      if (title) {
        headerNode = (
          <div class={`${prefixCls}-header`}>
            <div class={`${prefixCls}-title`}>{title}</div>
          </div>
        );
      }

      let descriptionNode: VueNode;
      if (description) {
        descriptionNode = <div class={`${prefixCls}-description`}>{description}</div>;
      }

      let coverNode: VueNode;
      if (cover) {
        coverNode = <div class={`${prefixCls}-cover`}>{cover}</div>;
      }

      let mergeIndicatorNode: VueNode;

      if (slots.indicatorsRender) {
        mergeIndicatorNode = slots.indicatorsRender({ current: current.value, total });
      } else {
        mergeIndicatorNode = [...Array.from({ length: total.value }).keys()].map(
          (stepItem, index) => (
            <span
              key={stepItem}
              class={classNames(
                index === current.value && `${prefixCls}-indicator-active`,
                `${prefixCls}-indicator`,
              )}
            />
          ),
        );
      }

      const mainBtnType = stepType === 'primary' ? 'default' : 'primary';
      const secondaryBtnProps: ButtonProps = {
        type: 'default',
        ghost: stepType === 'primary',
      };

      return (
        <LocaleReceiver componentName="Tour" defaultLocale={defaultLocale.Tour}>
          {contextLocale => (
            <div
              {...attrs}
              class={classNames(
                stepType === 'primary' ? `${prefixCls}-primary` : '',
                attrs.class,
                `${prefixCls}-content`,
              )}
            >
              {arrow && <div class={`${prefixCls}-arrow`} key="arrow" />}
              <div class={`${prefixCls}-inner`}>
                <CloseOutlined class={`${prefixCls}-close`} onClick={onClose} />
                {coverNode}
                {headerNode}
                {descriptionNode}
                <div class={`${prefixCls}-footer`}>
                  {total.value > 1 && (
                    <div class={`${prefixCls}-indicators`}>{mergeIndicatorNode}</div>
                  )}
                  <div class={`${prefixCls}-buttons`}>
                    {current.value !== 0 ? (
                      <Button
                        {...secondaryBtnProps}
                        {...prevButtonProps}
                        onClick={prevBtnClick}
                        size="small"
                        class={classNames(`${prefixCls}-prev-btn`, prevButtonProps?.className)}
                      >
                        {isFunction(prevButtonProps?.children)
                          ? prevButtonProps.children()
                          : prevButtonProps?.children ?? contextLocale.Previous}
                      </Button>
                    ) : null}
                    <Button
                      type={mainBtnType}
                      {...nextButtonProps}
                      onClick={nextBtnClick}
                      size="small"
                      class={classNames(`${prefixCls}-next-btn`, nextButtonProps?.className)}
                    >
                      {isFunction(nextButtonProps?.children)
                        ? nextButtonProps?.children()
                        : isLastStep.value
                        ? contextLocale.Finish
                        : contextLocale.Next}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </LocaleReceiver>
      );
    };
  },
});

export default panelRender;
