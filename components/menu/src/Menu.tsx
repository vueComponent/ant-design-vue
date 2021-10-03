import type { Key } from '../../_util/type';
import type { ExtractPropTypes, PropType, UnwrapRef } from 'vue';
import { computed, defineComponent, ref, inject, watchEffect, watch, onMounted, unref } from 'vue';
import shallowEqual from '../../_util/shallowequal';
import type { StoreMenuInfo } from './hooks/useMenuContext';
import useProvideMenu, { MenuContextProvider, useProvideFirstLevel } from './hooks/useMenuContext';
import useConfigInject from '../../_util/hooks/useConfigInject';
import type {
  MenuTheme,
  MenuMode,
  BuiltinPlacements,
  TriggerSubMenuAction,
  MenuInfo,
  SelectInfo,
} from './interface';
import devWarning from '../../vc-util/devWarning';
import type { CSSMotionProps } from '../../_util/transition';
import { collapseMotion } from '../../_util/transition';
import uniq from 'lodash-es/uniq';
import { SiderCollapsedKey } from '../../layout/injectionKey';
import { flattenChildren } from '../../_util/props-util';
import Overflow from '../../vc-overflow';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
import EllipsisOutlined from '@ant-design/icons-vue/EllipsisOutlined';
import { cloneElement } from '../../_util/vnode';

export const menuProps = {
  id: String,
  prefixCls: String,
  disabled: Boolean,
  inlineCollapsed: Boolean,
  disabledOverflow: Boolean,
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

  expandIcon: Function as PropType<(p?: { isOpen: boolean; [key: string]: any }) => any>,
};

export type MenuProps = Partial<ExtractPropTypes<typeof menuProps>>;

const EMPTY_LIST: string[] = [];
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
  slots: ['expandIcon', 'overflowedIndicator'],
  setup(props, { slots, emit }) {
    const { prefixCls, direction } = useConfigInject('menu', props);
    const store = ref<Record<string, StoreMenuInfo>>({});
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
        for (const menuInfo of Object.values(store.value)) {
          newKeyMapStore[menuInfo.key] = menuInfo;
        }
        keyMapStore.value = newKeyMapStore;
      },
      { flush: 'post' },
    );
    watchEffect(() => {
      if (props.activeKey !== undefined) {
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

      if (props.multiple) {
        if (exist) {
          newSelectedKeys = mergedSelectedKeys.value.filter(key => key !== targetKey);
        } else {
          newSelectedKeys = [...mergedSelectedKeys.value, targetKey];
        }
      } else {
        newSelectedKeys = [targetKey];
      }

      // Trigger event
      const selectInfo: SelectInfo = {
        ...info,
        selectedKeys: newSelectedKeys,
      };
      if (!shallowEqual(newSelectedKeys, mergedSelectedKeys.value)) {
        if (props.selectedKeys === undefined) {
          mergedSelectedKeys.value = newSelectedKeys;
        }
        emit('update:selectedKeys', newSelectedKeys);
        if (exist && props.multiple) {
          emit('deselect', selectInfo);
        } else {
          emit('select', selectInfo);
        }
      }

      if (mergedMode.value !== 'inline' && !props.multiple && mergedOpenKeys.value.length) {
        triggerOpenKeys(EMPTY_LIST);
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

    let timeout: number;
    const changeActiveKeys = (keys: Key[]) => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        if (props.activeKey === undefined) {
          activeKeys.value = keys;
        }
        emit('update:activeKey', keys[keys.length - 1]);
      });
    };

    const disabled = computed(() => !!props.disabled);
    const isRtl = computed(() => direction.value === 'rtl');
    const mergedMode = ref<MenuMode>('vertical');
    const mergedInlineCollapsed = ref(false);

    watchEffect(() => {
      if ((props.mode === 'inline' || props.mode === 'vertical') && inlineCollapsed.value) {
        mergedMode.value = 'vertical';
        mergedInlineCollapsed.value = inlineCollapsed.value;
      } else {
        mergedMode.value = props.mode;
        mergedInlineCollapsed.value = false;
      }
    });

    const isInlineMode = computed(() => mergedMode.value === 'inline');

    const triggerOpenKeys = (keys: string[]) => {
      mergedOpenKeys.value = keys;
      emit('update:openKeys', keys);
      emit('openChange', keys);
    };

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
          // Trigger open event in case its in control
          triggerOpenKeys(EMPTY_LIST);
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
      const storeValue = store.value;
      eventKeys.forEach(eventKey => {
        const { key, childrenEventKeys } = storeValue[eventKey];
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
      const { key, childrenEventKeys } = store.value[eventKey];
      let newOpenKeys = mergedOpenKeys.value.filter(k => k !== key);

      if (open) {
        newOpenKeys.push(key);
      } else if (mergedMode.value !== 'inline') {
        // We need find all related popup to close
        const subPathKeys = getChildrenKeys(childrenEventKeys);
        newOpenKeys = newOpenKeys.filter(k => !subPathKeys.includes(k));
      }

      if (!shallowEqual(mergedOpenKeys, newOpenKeys)) {
        triggerOpenKeys(newOpenKeys);
      }
    };

    const registerMenuInfo = (key: string, info: StoreMenuInfo) => {
      store.value = { ...store.value, [key]: info as any };
    };
    const unRegisterMenuInfo = (key: string) => {
      delete store.value[key];
      store.value = { ...store.value };
    };

    const lastVisibleIndex = ref(0);
    const expandIcon = computed<MenuProps['expandIcon']>(() =>
      props.expandIcon || slots.expandIcon
        ? opt => {
            let icon = props.expandIcon || slots.expandIcon;
            icon = typeof icon === 'function' ? icon(opt) : icon;
            return cloneElement(
              icon,
              {
                class: `${prefixCls.value}-submenu-expand-icon`,
              },
              false,
            );
          }
        : null,
    );
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
      overflowDisabled: ref(undefined),
      onOpenChange: onInternalOpenChange,
      onItemClick: onInternalClick,
      registerMenuInfo,
      unRegisterMenuInfo,
      selectedSubMenuEventKeys,
      isRootMenu: ref(true),
      expandIcon,
    });
    return () => {
      const childList = flattenChildren(slots.default?.());
      const allVisible =
        lastVisibleIndex.value >= childList.length - 1 ||
        mergedMode.value !== 'horizontal' ||
        props.disabledOverflow;
      // >>>>> Children
      const wrappedChildList =
        mergedMode.value !== 'horizontal' || props.disabledOverflow
          ? childList
          : // Need wrap for overflow dropdown that do not response for open
            childList.map((child, index) => (
              // Always wrap provider to avoid sub node re-mount
              <MenuContextProvider
                key={child.key}
                overflowDisabled={index > lastVisibleIndex.value}
              >
                {child}
              </MenuContextProvider>
            ));
      const overflowedIndicator = slots.overflowedIndicator?.() || <EllipsisOutlined />;

      return (
        <Overflow
          prefixCls={`${prefixCls.value}-overflow`}
          component="ul"
          itemComponent={MenuItem}
          class={className.value}
          role="menu"
          id={props.id}
          data={wrappedChildList}
          renderRawItem={node => node}
          renderRawRest={omitItems => {
            // We use origin list since wrapped list use context to prevent open
            const len = omitItems.length;

            const originOmitItems = len ? childList.slice(-len) : null;

            return (
              <SubMenu
                eventKey={Overflow.OVERFLOW_KEY}
                title={overflowedIndicator}
                disabled={allVisible}
                internalPopupClose={len === 0}
              >
                {originOmitItems}
              </SubMenu>
            );
          }}
          maxCount={
            mergedMode.value !== 'horizontal' || props.disabledOverflow
              ? Overflow.INVALIDATE
              : Overflow.RESPONSIVE
          }
          ssr="full"
          data-menu-list
          onVisibleChange={newLastIndex => {
            lastVisibleIndex.value = newLastIndex;
          }}
        />
      );
    };
  },
});
