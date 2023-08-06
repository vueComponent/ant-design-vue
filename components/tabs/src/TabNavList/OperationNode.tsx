import Menu, { MenuItem } from '../../../menu';
import Dropdown from '../../../vc-dropdown';
import type { Tab, TabsLocale, EditableConfig } from '../interface';
import AddButton from './AddButton';
import type { CustomSlotsType, Key } from '../../../_util/type';
import { functionType } from '../../../_util/type';
import KeyCode from '../../../_util/KeyCode';
import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import classNames from '../../../_util/classNames';
import { defineComponent, watch, computed, onMounted } from 'vue';
import PropTypes from '../../../_util/vue-types';
import useState from '../../../_util/hooks/useState';
import EllipsisOutlined from '@ant-design/icons-vue/EllipsisOutlined';
import { useProvideOverride } from '../../../menu/src/OverrideContext';

export const operationNodeProps = {
  prefixCls: { type: String },
  id: { type: String },
  tabs: { type: Object as PropType<(Tab & { closeIcon?: () => any })[]> },
  rtl: { type: Boolean },
  tabBarGutter: { type: Number },
  activeKey: { type: [String, Number] },
  mobile: { type: Boolean },
  moreIcon: PropTypes.any,
  moreTransitionName: { type: String },
  editable: { type: Object as PropType<EditableConfig> },
  locale: { type: Object as PropType<TabsLocale>, default: undefined as TabsLocale },
  removeAriaLabel: String,
  onTabClick: { type: Function as PropType<(key: Key, e: MouseEvent | KeyboardEvent) => void> },
  popupClassName: String,
  getPopupContainer: functionType<
    ((triggerNode?: HTMLElement | undefined) => HTMLElement) | undefined
  >(),
};

export type OperationNodeProps = Partial<ExtractPropTypes<typeof operationNodeProps>>;

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'OperationNode',
  inheritAttrs: false,
  props: operationNodeProps,
  emits: ['tabClick'],
  slots: Object as CustomSlotsType<{
    moreIcon?: any;
    default?: any;
  }>,
  setup(props, { attrs, slots }) {
    // ======================== Dropdown ========================
    const [open, setOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState<Key>(null);
    const selectOffset = (offset: -1 | 1) => {
      const enabledTabs = props.tabs.filter(tab => !tab.disabled);
      let selectedIndex = enabledTabs.findIndex(tab => tab.key === selectedKey.value) || 0;
      const len = enabledTabs.length;

      for (let i = 0; i < len; i += 1) {
        selectedIndex = (selectedIndex + offset + len) % len;
        const tab = enabledTabs[selectedIndex];
        if (!tab.disabled) {
          setSelectedKey(tab.key);
          return;
        }
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const { which } = e;

      if (!open.value) {
        if ([KeyCode.DOWN, KeyCode.SPACE, KeyCode.ENTER].includes(which)) {
          setOpen(true);
          e.preventDefault();
        }
        return;
      }

      switch (which) {
        case KeyCode.UP:
          selectOffset(-1);
          e.preventDefault();
          break;
        case KeyCode.DOWN:
          selectOffset(1);
          e.preventDefault();
          break;
        case KeyCode.ESC:
          setOpen(false);
          break;
        case KeyCode.SPACE:
        case KeyCode.ENTER:
          if (selectedKey.value !== null) props.onTabClick(selectedKey.value, e);
          break;
      }
    };
    const popupId = computed(() => `${props.id}-more-popup`);

    const selectedItemId = computed(() =>
      selectedKey.value !== null ? `${popupId.value}-${selectedKey.value}` : null,
    );

    const onRemoveTab = (event: MouseEvent | KeyboardEvent, key: Key) => {
      event.preventDefault();
      event.stopPropagation();
      props.editable.onEdit('remove', {
        key,
        event,
      });
    };

    onMounted(() => {
      watch(
        selectedKey,
        () => {
          const ele = document.getElementById(selectedItemId.value);
          if (ele && ele.scrollIntoView) {
            ele.scrollIntoView(false);
          }
        },
        { flush: 'post', immediate: true },
      );
    });

    watch(open, () => {
      if (!open.value) {
        setSelectedKey(null);
      }
    });
    useProvideOverride({});
    return () => {
      const {
        prefixCls,
        id,
        tabs,
        locale,
        mobile,
        moreIcon = slots.moreIcon?.() || <EllipsisOutlined />,
        moreTransitionName,
        editable,
        tabBarGutter,
        rtl,
        onTabClick,
        popupClassName,
      } = props;
      if (!tabs.length) return null;
      const dropdownPrefix = `${prefixCls}-dropdown`;

      const dropdownAriaLabel = locale?.dropdownAriaLabel;

      // ========================= Render =========================
      const moreStyle: CSSProperties = {
        [rtl ? 'marginRight' : 'marginLeft']: tabBarGutter,
      };
      if (!tabs.length) {
        moreStyle.visibility = 'hidden';
        moreStyle.order = 1;
      }

      const overlayClassName = classNames({
        [`${dropdownPrefix}-rtl`]: rtl,
        [`${popupClassName}`]: true,
      });
      const moreNode = mobile ? null : (
        <Dropdown
          prefixCls={dropdownPrefix}
          trigger={['hover']}
          visible={open.value}
          transitionName={moreTransitionName}
          onVisibleChange={setOpen}
          overlayClassName={overlayClassName}
          mouseEnterDelay={0.1}
          mouseLeaveDelay={0.1}
          getPopupContainer={props.getPopupContainer}
          v-slots={{
            overlay: () => (
              <Menu
                onClick={({ key, domEvent }) => {
                  onTabClick(key, domEvent);
                  setOpen(false);
                }}
                id={popupId.value}
                tabindex={-1}
                role="listbox"
                aria-activedescendant={selectedItemId.value}
                selectedKeys={[selectedKey.value]}
                aria-label={
                  dropdownAriaLabel !== undefined ? dropdownAriaLabel : 'expanded dropdown'
                }
              >
                {tabs.map(tab => {
                  const removable = editable && tab.closable !== false && !tab.disabled;
                  return (
                    <MenuItem
                      key={tab.key}
                      id={`${popupId.value}-${tab.key}`}
                      role="option"
                      aria-controls={id && `${id}-panel-${tab.key}`}
                      disabled={tab.disabled}
                    >
                      <span>{typeof tab.tab === 'function' ? tab.tab() : tab.tab}</span>
                      {removable && (
                        <button
                          type="button"
                          aria-label={props.removeAriaLabel || 'remove'}
                          tabindex={0}
                          class={`${dropdownPrefix}-menu-item-remove`}
                          onClick={e => {
                            e.stopPropagation();
                            onRemoveTab(e, tab.key);
                          }}
                        >
                          {tab.closeIcon?.() || editable.removeIcon?.() || '×'}
                        </button>
                      )}
                    </MenuItem>
                  );
                })}
              </Menu>
            ),
            default: () => (
              <button
                type="button"
                class={`${prefixCls}-nav-more`}
                style={moreStyle}
                tabindex={-1}
                aria-hidden="true"
                aria-haspopup="listbox"
                aria-controls={popupId.value}
                id={`${id}-more`}
                aria-expanded={open.value}
                onKeydown={onKeyDown}
              >
                {moreIcon}
              </button>
            ),
          }}
        ></Dropdown>
      );

      return (
        <div
          class={classNames(`${prefixCls}-nav-operations`, attrs.class)}
          style={attrs.style as CSSProperties}
        >
          {moreNode}
          <AddButton prefixCls={prefixCls} locale={locale} editable={editable} />
        </div>
      );
    };
  },
});
