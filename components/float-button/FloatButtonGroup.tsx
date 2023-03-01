import { defineComponent, ref, computed, watch } from 'vue';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import FileTextOutlined from '@ant-design/icons-vue/FileTextOutlined';
import classNames from '../_util/classNames';
import { getTransitionProps, Transition } from '../_util/transition';
import FloatButton, { floatButtonPrefixCls } from './FloatButton';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import FloatButtonGroupContext from './context';
import { initDefaultProps } from '../_util/props-util';
import { floatButtonGroupProps } from './interface';
import type { FloatButtonGroupProps } from './interface';

// CSSINJS
import useStyle from './style';

const FloatButtonGroup = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'AFloatButtonGroup',
  inheritAttrs: false,
  props: initDefaultProps(floatButtonGroupProps(), {
    type: 'default',
    shape: 'circle',
  } as FloatButtonGroupProps),
  setup(props, { attrs, slots }) {
    const { prefixCls, direction } = useConfigInject(floatButtonPrefixCls, props);

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const open = ref(props.open);

    const floatButtonGroupRef = ref<HTMLDivElement>(null);
    const floatButtonRef = ref<HTMLButtonElement | HTMLAnchorElement>(null);

    FloatButtonGroupContext.useProvide({
      shape: computed(() => props.shape),
    });

    const hoverAction = computed(() => {
      const hoverTypeAction = {
        onMouseenter() {
          open.value = true;
          props.onOpenChange?.(true);
        },
        onMouseleave() {
          open.value = false;
          props.onOpenChange?.(false);
        },
      };
      return props.trigger === 'hover' ? hoverTypeAction : {};
    });

    const handleOpenChange = () => {
      open.value = !open.value;
      props.onOpenChange?.(!open.value);
    };

    const onClick = (e: MouseEvent) => {
      if (floatButtonGroupRef.value?.contains(e.target as Node)) {
        if ((floatButtonRef.value as any)?.floatButtonEl?.contains(e.target as Node)) {
          handleOpenChange();
        }
        return;
      }
      open.value = false;
      props.onOpenChange?.(false);
    };

    watch(
      computed(() => props.trigger),
      value => {
        if (value === 'click') {
          document.addEventListener('click', onClick);
          return () => {
            document.removeEventListener('click', onClick);
          };
        }
      },
      { immediate: true },
    );

    return () => {
      const { shape = 'circle', type = 'default', tooltip, description, trigger } = props;

      const groupPrefixCls = `${prefixCls.value}-group`;

      const groupCls = classNames(groupPrefixCls, hashId.value, attrs.class, {
        [`${groupPrefixCls}-rtl`]: direction.value === 'rtl',
        [`${groupPrefixCls}-${shape}`]: shape,
        [`${groupPrefixCls}-${shape}-shadow`]: !trigger,
      });

      const wrapperCls = classNames(hashId.value, `${groupPrefixCls}-wrap`);

      const transitionProps = getTransitionProps(`${groupPrefixCls}-wrap`);

      return wrapSSR(
        <div ref={floatButtonGroupRef} {...attrs} class={groupCls} {...hoverAction.value}>
          {trigger && ['click', 'hover'].includes(trigger) ? (
            <>
              <Transition {...transitionProps}>
                <div v-show={open.value} class={classNames(wrapperCls)}>
                  {slots.default && slots.default()}
                </div>
              </Transition>
              <FloatButton
                ref={floatButtonRef}
                type={type}
                shape={shape}
                tooltip={tooltip}
                description={description}
              >
                {{
                  icon: () =>
                    open.value
                      ? (slots.closeIcon && slots.closeIcon()) || <CloseOutlined />
                      : (slots.icon && slots.icon()) || <FileTextOutlined />,
                  tooltip: slots.tooltip,
                  description: slots.description,
                }}
              </FloatButton>
            </>
          ) : (
            slots.default && slots.default()
          )}
        </div>,
      );
    };
  },
});

export default FloatButtonGroup;
