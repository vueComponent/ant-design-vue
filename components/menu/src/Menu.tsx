import { Key } from '../../_util/type';
import {
  computed,
  defineComponent,
  ExtractPropTypes,
  ref,
  PropType,
  inject,
  watchEffect,
  watch,
  reactive,
  onMounted,
} from 'vue';
import shallowEqual from '../../_util/shallowequal';
import useProvideMenu, { StoreMenuInfo, useProvideFirstLevel } from './hooks/useMenuContext';
import useConfigInject from '../../_util/hooks/useConfigInject';
import {
  MenuTheme,
  MenuMode,
  BuiltinPlacements,
  TriggerSubMenuAction,
  MenuInfo,
  SelectInfo,
} from './interface';
import devWarning from 'ant-design-vue/es/vc-util/devWarning';
import { collapseMotion, CSSMotionProps } from 'ant-design-vue/es/_util/transition';

export const menuProps = {
  prefixCls: String,
  disabled: Boolean,
  inlineCollapsed: Boolean,
  overflowDisabled: Boolean,
  openKeys: Array,
  selectedKeys: Array,
  selectable: Boolean,
  multiple: Boolean,

  motion: Object as PropType<CSSMotionProps>,

  theme: { type: String as PropType<MenuTheme>, default: 'light' },
  mode: { type: String as PropType<MenuMode>, default: 'vertical' },

  inlineIndent: { type: Number, default: 24 },
  subMenuOpenDelay: { type: Number, default: 0.1 },
  subMenuCloseDelay: { type: Number, default: 0.1 },

  builtinPlacements: { type: Object as PropType<BuiltinPlacements> },

  triggerSubMenuAction: { type: String as PropType<TriggerSubMenuAction>, default: 'hover' },

  getPopupContainer: Function as PropType<(node: HTMLElement) => HTMLElement>,
};

export type MenuProps = Partial<ExtractPropTypes<typeof menuProps>>;

export default defineComponent({
  name: 'AMenu',
  props: menuProps,
  emits: ['update:openKeys', 'openChange', 'select', 'deselect', 'update:selectedKeys'],
  setup(props, { slots, emit }) {
    const { prefixCls, direction } = useConfigInject('menu', props);
    const store = reactive<Record<string, StoreMenuInfo>>({});
    const siderCollapsed = inject(
      'layoutSiderCollapsed',
      computed(() => undefined),
    );
    const inlineCollapsed = computed(() => {
      const { inlineCollapsed } = props;
      if (siderCollapsed.value !== undefined) {
        return siderCollapsed.value;
      }
      return inlineCollapsed;
    });

    const isMounted = ref(false);
    onMounted(() => {
      isMounted.value = true;
    });
    watchEffect(() => {
      devWarning(
        !('inlineCollapsed' in props && props.mode !== 'inline'),
        'Menu',
        '`inlineCollapsed` should only be used when `mode` is inline.',
      );

      devWarning(
        !(siderCollapsed.value !== undefined && 'inlineCollapsed' in props),
        'Menu',
        '`inlineCollapsed` not control Menu under Sider. Should set `collapsed` on Sider instead.',
      );
    });

    const activeKeys = ref([]);
    const mergedSelectedKeys = ref([]);

    watch(
      () => props.selectedKeys,
      (selectedKeys = mergedSelectedKeys.value) => {
        mergedSelectedKeys.value = selectedKeys;
      },
      { immediate: true },
    );

    // >>>>> Trigger select
    const triggerSelection = (info: MenuInfo) => {
      if (!props.selectable) {
        return;
      }

      // Insert or Remove
      const { key: targetKey } = info;
      const exist = mergedSelectedKeys.value.includes(targetKey);
      let newSelectedKeys: Key[];

      if (exist) {
        newSelectedKeys = mergedSelectedKeys.value.filter(key => key !== targetKey);
      } else if (props.multiple) {
        newSelectedKeys = [...mergedSelectedKeys.value, targetKey];
      } else {
        newSelectedKeys = [targetKey];
      }

      mergedSelectedKeys.value = newSelectedKeys;
      // Trigger event
      const selectInfo: SelectInfo = {
        ...info,
        selectedKeys: newSelectedKeys,
      };

      if (exist) {
        emit('deselect', selectInfo);
      } else {
        emit('select', selectInfo);
      }
    };

    const mergedOpenKeys = ref([]);

    watch(
      () => props.openKeys,
      (openKeys = mergedOpenKeys.value) => {
        mergedOpenKeys.value = openKeys;
      },
      { immediate: true },
    );

    const changeActiveKeys = (keys: Key[]) => {
      activeKeys.value = keys;
    };
    const disabled = computed(() => !!props.disabled);
    const isRtl = computed(() => direction.value === 'rtl');
    const mergedMode = ref<MenuMode>('vertical');
    const mergedInlineCollapsed = ref(false);

    const isInlineMode = computed(() => mergedMode.value === 'inline');

    // >>>>> Cache & Reset open keys when inlineCollapsed changed
    const inlineCacheOpenKeys = ref([]);

    // Cache
    watchEffect(() => {
      if (isInlineMode.value) {
        inlineCacheOpenKeys.value = mergedOpenKeys.value;
      }
    });

    const mountRef = ref(false);

    // Restore
    watch(isInlineMode, () => {
      if (!mountRef.value) {
        mountRef.value = true;
        return;
      }

      if (isInlineMode.value) {
        mergedOpenKeys.value = inlineCacheOpenKeys.value;
      } else {
        const empty = [];
        mergedOpenKeys.value = empty;
        // Trigger open event in case its in control
        emit('update:openKeys', empty);
        emit('openChange', empty);
      }
    });

    watchEffect(() => {
      if (props.mode === 'inline' && inlineCollapsed.value) {
        mergedMode.value = 'vertical';
        mergedInlineCollapsed.value = inlineCollapsed.value;
      }
      mergedMode.value = props.mode;
      mergedInlineCollapsed.value = false;
    });

    const className = computed(() => {
      return {
        [`${prefixCls.value}`]: true,
        [`${prefixCls.value}-root`]: true,
        [`${prefixCls.value}-${mergedMode.value}`]: true,
        [`${prefixCls.value}-inline-collapsed`]: mergedInlineCollapsed.value,
        [`${prefixCls.value}-rtl`]: isRtl.value,
        [`${prefixCls.value}-${props.theme}`]: true,
      };
    });

    const defaultMotions = {
      horizontal: { name: `ant-slide-up` },
      inline: collapseMotion,
      other: { name: `ant-zoom-big` },
    };

    useProvideFirstLevel(true);

    const getChildrenKeys = (eventKeys: string[]): Key[] => {
      const keys = [];
      eventKeys.forEach(eventKey => {
        const { key, childrenEventKeys } = store[eventKey] as any;
        keys.push(key, ...getChildrenKeys(childrenEventKeys.value));
      });
      return keys;
    };

    const onInternalOpenChange = (eventKey: Key, open: boolean) => {
      const { key, childrenEventKeys } = store[eventKey] as any;
      let newOpenKeys = mergedOpenKeys.value.filter(k => k !== key);

      if (open) {
        newOpenKeys.push(key);
      } else if (mergedMode.value !== 'inline') {
        // We need find all related popup to close
        const subPathKeys = getChildrenKeys(childrenEventKeys.value);
        newOpenKeys = newOpenKeys.filter(k => !subPathKeys.includes(k));
      }

      if (!shallowEqual(mergedOpenKeys, newOpenKeys)) {
        mergedOpenKeys.value = newOpenKeys;
        emit('update:openKeys', newOpenKeys);
        emit('openChange', newOpenKeys);
      }
    };

    const registerMenuInfo = (key: string, info: StoreMenuInfo) => {
      store[key] = info as any;
    };
    const unRegisterMenuInfo = (key: string) => {
      delete store[key];
    };

    useProvideMenu({
      store,
      prefixCls,
      activeKeys,
      openKeys: mergedOpenKeys,
      selectedKeys: mergedSelectedKeys,
      changeActiveKeys,
      disabled,
      rtl: isRtl,
      mode: mergedMode,
      inlineIndent: computed(() => props.inlineIndent),
      subMenuCloseDelay: computed(() => props.subMenuCloseDelay),
      subMenuOpenDelay: computed(() => props.subMenuOpenDelay),
      builtinPlacements: computed(() => props.builtinPlacements),
      triggerSubMenuAction: computed(() => props.triggerSubMenuAction),
      getPopupContainer: computed(() => props.getPopupContainer),
      inlineCollapsed: mergedInlineCollapsed,
      antdMenuTheme: computed(() => props.theme),
      siderCollapsed,
      defaultMotions: computed(() => (isMounted.value ? defaultMotions : null)),
      motion: computed(() => (isMounted.value ? props.motion : null)),
      overflowDisabled: computed(() => props.overflowDisabled),
      onOpenChange: onInternalOpenChange,
      onItemClick: triggerSelection,
      registerMenuInfo,
      unRegisterMenuInfo,
    });
    return () => {
      return <ul class={className.value}>{slots.default?.()}</ul>;
    };
  },
});
