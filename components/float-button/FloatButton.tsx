import classNames from '../_util/classNames';
import { defineComponent, computed, CSSProperties, ref } from 'vue';
import Tooltip from '../tooltip';
import Content from './FloatButtonContent';
import type { FloatButtonContentProps } from './interface';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import FloatButtonGroupContext from './context';
import warning from '../_util/warning';
import { initDefaultProps } from '../_util/props-util';
import { floatButtonProps } from './interface';
// import { useCompactItemContext } from '../space/Compact';

// CSSINJS
import useStyle from './style';

export const floatButtonPrefixCls = 'float-btn';

const FloatButton = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AFloatButton',
  inheritAttrs: false,
  props: initDefaultProps(floatButtonProps(), { type: 'default', shape: 'circle' }),
  setup(props, { attrs, slots, expose }) {
    const { prefixCls, direction } = useConfigInject(floatButtonPrefixCls, props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const { shape: groupShape } = FloatButtonGroupContext.useInject();

    const floatButtonRef = ref(null);

    const mergeShape = computed(() => {
      return groupShape?.value || props.shape;
    });

    expose({
      floatButtonEl: floatButtonRef,
    });

    return () => {
      const {
        prefixCls: customPrefixCls,
        type = 'default',
        shape = 'circle',
        description,
        tooltip,
        ...restProps
      } = props;

      const contentProps: FloatButtonContentProps = {
        prefixCls: prefixCls.value,
        description,
      };

      const classString = classNames(
        prefixCls.value,
        `${prefixCls.value}-${props.type}`,
        `${prefixCls.value}-${mergeShape.value}`,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        attrs.class,
        hashId.value,
      );

      const buttonNode = (
        <Tooltip placement="left">
          {{
            title:
              slots.tooltip || tooltip
                ? () => (slots.tooltip && slots.tooltip()) || tooltip
                : undefined,
            default: () => (
              <div class={`${prefixCls.value}-body`}>
                <Content {...contentProps}>
                  {{
                    icon: slots.icon,
                    description: slots.description,
                  }}
                </Content>
              </div>
            ),
          }}
        </Tooltip>
      );

      if (process.env.NODE_ENV !== 'production') {
        warning(
          !(shape === 'circle' && description),
          'FloatButton',
          'supported only when `shape` is `square`. Due to narrow space for text, short sentence is recommended.',
        );
      }

      return wrapSSR(
        props.href ? (
          <a
            ref={floatButtonRef}
            {...attrs}
            {...(restProps as any)}
            class={classString}
            style={attrs.style as CSSProperties}
          >
            {buttonNode}
          </a>
        ) : (
          <button
            ref={floatButtonRef}
            {...attrs}
            {...restProps}
            class={classString}
            style={attrs.style as CSSProperties}
            type="button"
          >
            {buttonNode}
          </button>
        ),
      );
    };
  },
});

export default FloatButton;
