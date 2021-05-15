import { computed, defineComponent, getCurrentInstance, ref, watch } from 'vue';
import { useInjectKeyPath } from './hooks/useKeyPath';
import { useInjectMenu } from './hooks/useMenuContext';

let indexGuid = 0;

export default defineComponent({
  name: 'AMenuItem',
  props: {
    role: String,
    disabled: Boolean,
  },
  emits: ['mouseenter', 'mouseleave'],
  setup(props, { slots, emit }) {
    const instance = getCurrentInstance();
    const key = instance.vnode.key;
    const uniKey = `menu_item_${++indexGuid}`;
    const parentKeys = useInjectKeyPath();
    console.log(parentKeys.value);
    const { prefixCls, activeKeys, disabled, changeActiveKeys } = useInjectMenu();
    const isActive = ref(false);
    watch(
      activeKeys,
      () => {
        isActive.value = !!activeKeys.value.find(val => val === key);
      },
      { immediate: true },
    );
    const mergedDisabled = computed(() => disabled.value || props.disabled);
    const selected = computed(() => false);
    const classNames = computed(() => {
      const itemCls = `${prefixCls.value}-item`;
      return {
        [`${itemCls}`]: true,
        [`${itemCls}-active`]: isActive.value,
        [`${itemCls}-selected`]: selected.value,
        [`${itemCls}-disabled`]: mergedDisabled.value,
      };
    });
    const onMouseEnter = (event: MouseEvent) => {
      if (!mergedDisabled.value) {
        changeActiveKeys([...parentKeys.value, key]);
        emit('mouseenter', event);
      }
    };
    const onMouseLeave = (event: MouseEvent) => {
      if (!mergedDisabled.value) {
        changeActiveKeys([]);
        emit('mouseleave', event);
      }
    };

    return () => {
      // ============================ Render ============================
      const optionRoleProps = {};

      if (props.role === 'option') {
        optionRoleProps['aria-selected'] = selected.value;
      }
      return (
        <li
          class={classNames.value}
          role={props.role || 'menuitem'}
          tabindex={props.disabled ? null : -1}
          data-menu-id={key}
          aria-disabled={props.disabled}
          {...optionRoleProps}
          onMouseenter={onMouseEnter}
          onMouseleave={onMouseLeave}
        >
          {slots.default?.()}
        </li>
      );
    };
  },
});
