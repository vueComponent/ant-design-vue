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
  unref,
  UnwrapRef,
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
import devWarning from '../../vc-util/devWarning';
import { collapseMotion, CSSMotionProps } from '../../_util/transition';
import uniq from 'lodash-es/uniq';
import { SiderCollapsedKey } from '../../layout/injectionKey';

export const menuProps = {
  prefixCls: String,
  disabled: Boolean,
  inlineCollapsed: Boolean,
  overflowDisabled: Boolean,
  openKeys: Array,
  selectedKeys: Array,
  activeKey: String, // 内部组件使用
  selectable: { type: Boolean, default: true },
  multiple: { type: Boolean, default: false },

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
  emits: [
    'update:openKeys',
    'openChange',
    'select',
    'deselect',
    'update:selectedKeys',
    'click',
    'update:activeKey',
  ],
  setup(props, { slots, emit }) {
    const { prefixCls, direction } = useConfigInject('menu', props);
    const store = reactive<Record<string, StoreMenuInfo>>({});
    const siderCollapsed = inject(SiderCollapsedKey, ref(undefined));
    const inlineCollapsed = computed(() => {
      if (siderCollapsed.value !== undefined) {
        return siderCollapsed.value;
      }
      return props.inlineCollapsed;
    });

    const isMounted = ref(false);
    onMounted(() => {
      isMounted.value = true;
    });
    watchEffect(() => {
      devWarning(
        !(props.inlineCollapsed === true && props.mode !== 'inline'),
        'Menu',
        '`inlineCollapsed` should only be used when `mode` is inline.',
      );

      devWarning(
        !(siderCollapsed.value !== undefined && props.inlineCollapsed === true),
        'Menu',
        '`inlineCollapsed` not control Menu under Sider. Should set `collapsed` on Sider instead.',
      );
    });

    const activeKeys = ref([]);
    const mergedSelectedKeys = ref([]);
    const keyMapStore = ref({});
    watch(
      store,
      () => {
        const newKeyMapStore = {};
        for (const [, menuInfo] of Object.entries(store)) {
          newKeyMapStore[menuInfo.key] = menuInfo;
        }
        keyMapStore.value = newKeyMapStore;
      },
      { immediate: true },
    );
    watchEffect(() => {
      if ('activeKey' in props) {
        let keys = [];
        const menuInfo = props.activeKey
          ? (keyMapStore.value[props.activeKey] as UnwrapRef<StoreMenuInfo>)
          : undefined;
        if (menuInfo && props.activeKey !== undefined) {
          keys = [...menuInfo.parentKeys, props.activeKey];
        } else {
          keys = [];
        }
        if (!shallowEqual(activeKeys.value, keys)) {
          activeKeys.value = keys;
        }
      }
    });

    watch(
      () => props.selectedKeys,
      selectedKeys => {
        mergedSelectedKeys.value = selectedKeys || mergedSelectedKeys.value;
      },
      { immediate: true },
    );

    const selectedSubMenuEventKeys = ref([]);

    watch(
      [keyMapStore, mergedSelectedKeys],
      () => {
        let subMenuParentEventKeys = [];
        mergedSelectedKeys.value.forEach(key => {
          const menuInfo = keyMapStore.value[key];
          if (menuInfo) {
            subMenuParentEventKeys.push(...unref(menuInfo.parentEventKeys));
          }
        });

        subMenuParentEventKeys = uniq(subMenuParentEventKeys);
        if (!shallowEqual(selectedSubMenuEventKeys.value, subMenuParentEventKeys)) {
          selectedSubMenuEventKeys.value = subMenuParentEventKeys;
        }
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

      if (exist && props.multiple) {
        newSelectedKeys = mergedSelectedKeys.value.filter(key => key !== targetKey);
      } else if (props.multiple) {
        newSelectedKeys = [...mergedSelectedKeys.value, targetKey];
      } else {
        newSelectedKeys = [targetKey];
      }

      // Trigger event
      const selectInfo: SelectInfo = {
        ...info,
        selectedKeys: newSelectedKeys,
      };
      if (!shallowEqual(newSelectedKeys, mergedSelectedKeys.value)) {
        if (!('selectedKeys' in props)) {
          mergedSelectedKeys.value = newSelectedKeys;
        }
        emit('update:selectedKeys', newSelectedKeys);
        if (exist && props.multiple) {
          emit('deselect', selectInfo);
        } else {
          emit('select', selectInfo);
        }
      }
    };

    const mergedOpenKeys = ref([]);

    watch(
      () => props.openKeys,
      (openKeys = mergedOpenKeys.value) => {
        if (!shallowEqual(mergedOpenKeys.value, openKeys)) {
          mergedOpenKeys.value = openKeys;
        }
      },
      { immediate: true },
    );

    const changeActiveKeys = (keys: Key[]) => {
      if ('activeKey' in props) {
        emit('update:activeKey', keys[keys.length - 1]);
      } else {
        activeKeys.value = keys;
      }
    };
    const disabled = computed(() => !!props.disabled);
    const isRtl = computed(() => direction.value === 'rtl');
    const mergedMode = ref<MenuMode>('vertical');
    const mergedInlineCollapsed = ref(false);

    watchEffect(() => {
      if (props.mode === 'inline' && inlineCollapsed.value) {
        mergedMode.value = 'vertical';
        mergedInlineCollapsed.value = inlineCollapsed.value;
      } else {
        mergedMode.value = props.mode;
        mergedInlineCollapsed.value = false;
      }
    });

    const isInlineMode = computed(() => mergedMode.value === 'inline');

    // >>>>> Cache & Reset open keys when inlineCollapsed changed
    const inlineCacheOpenKeys = ref(mergedOpenKeys.value);

    const mountRef = ref(false);

    // Cache
    watch(
      mergedOpenKeys,
      () => {
        if (isInlineMode.value) {
          inlineCacheOpenKeys.value = mergedOpenKeys.value;
        }
      },
      { immediate: true },
    );

    // Restore
    watch(
      isInlineMode,
      () => {
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
      },
      { immediate: true },
    );

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

    const getChildrenKeys = (eventKeys: string[] = []): Key[] => {
      const keys = [];
      eventKeys.forEach(eventKey => {
        const { key, childrenEventKeys } = store[eventKey];
        keys.push(key, ...getChildrenKeys(childrenEventKeys));
      });
      return keys;
    };

    // ========================= Open =========================
    /**
     * Click for item. SubMenu do not have selection status
     */
    const onInternalClick = (info: MenuInfo) => {
      emit('click', info);
      triggerSelection(info);
    };

    const onInternalOpenChange = (eventKey: Key, open: boolean) => {
      const { key, childrenEventKeys } = store[eventKey];
      let newOpenKeys = mergedOpenKeys.value.filter(k => k !== key);

      if (open) {
        newOpenKeys.push(key);
      } else if (mergedMode.value !== 'inline') {
        // We need find all related popup to close
        const subPathKeys = getChildrenKeys(childrenEventKeys);
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
      onItemClick: onInternalClick,
      registerMenuInfo,
      unRegisterMenuInfo,
      selectedSubMenuEventKeys,
      isRootMenu: true,
    });
    return () => {
      return (
        <ul class={className.value} tabindex="0">
          {slots.default?.()}
        </ul>
      );
    };
  },
});
