import CalendarOutlined from '@ant-design/icons-vue/CalendarOutlined';
import ClockCircleOutlined from '@ant-design/icons-vue/ClockCircleOutlined';
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled';
import SwapRightOutlined from '@ant-design/icons-vue/SwapRightOutlined';
import { RangePicker as VCRangePicker } from '../../vc-picker';
import { GenerateConfig } from '../../vc-picker/generate/index';
import enUS from '../locale/en_US';
import { useLocaleReceiver } from '../../locale-provider/LocaleReceiver';
import { getRangePlaceholder } from '../util';
import { RangePickerProps, getTimeProps, Components } from '.';
import { defineComponent, ref } from 'vue';
import useConfigInject from '../../_util/hooks/useConfigInject';
import classNames from '../../_util/classNames';

export default function generateRangePicker<DateType>(generateConfig: GenerateConfig<DateType>) {
  const RangePicker = defineComponent<RangePickerProps<DateType>>({
    name: 'RangePicker',
    inheritAttrs: false,
    props: ['size', 'prefixCls', 'direction', 'getPopupContainer', 'locale'] as any,
    slots: ['suffixIcon'],
    setup(props, { expose, slots, attrs }) {
      const { prefixCls, direction, getPopupContainer, size, rootPrefixCls } = useConfigInject(
        'picker',
        props,
      );
      const pickerRef = ref();
      expose({
        focus: () => {
          pickerRef.value?.focus();
        },
        blur: () => {
          pickerRef.value?.blur();
        },
      });
      const [contextLocale] = useLocaleReceiver('DatePicker', enUS);
      return () => {
        const locale = { ...contextLocale.value, ...props.locale };
        const p = { ...props, ...attrs } as RangePickerProps<DateType>;
        const {
          prefixCls: customizePrefixCls,
          bordered = true,
          placeholder,
          suffixIcon = slots.suffixIcon?.(),
          ...restProps
        } = p;
        const { format, showTime, picker } = p as any;

        let additionalOverrideProps: any = {};

        additionalOverrideProps = {
          ...additionalOverrideProps,
          ...(showTime ? getTimeProps({ format, picker, ...showTime }) : {}),
          ...(picker === 'time' ? getTimeProps({ format, ...p, picker }) : {}),
        };
        const pre = prefixCls.value;
        return (
          <VCRangePicker<DateType>
            {...restProps}
            separator={
              <span aria-label="to" class={`${pre}-separator`}>
                <SwapRightOutlined />
              </span>
            }
            ref={pickerRef}
            placeholder={getRangePlaceholder(picker, locale, placeholder)}
            suffixIcon={
              suffixIcon || (picker === 'time' ? <ClockCircleOutlined /> : <CalendarOutlined />)
            }
            clearIcon={<CloseCircleFilled />}
            allowClear
            transitionName={`${rootPrefixCls.value}-slide-up`}
            {...additionalOverrideProps}
            class={classNames(
              {
                [`${pre}-${size.value}`]: size.value,
                [`${pre}-borderless`]: !bordered,
              },
              attrs.class,
            )}
            locale={locale!.lang}
            prefixCls={pre}
            getPopupContainer={getPopupContainer.value}
            generateConfig={generateConfig}
            prevIcon={<span class={`${pre}-prev-icon`} />}
            nextIcon={<span class={`${pre}-next-icon`} />}
            superPrevIcon={<span class={`${pre}-super-prev-icon`} />}
            superNextIcon={<span class={`${pre}-super-next-icon`} />}
            components={Components}
            direction={direction.value}
          />
        );
      };
    },
  });

  return RangePicker;
}
