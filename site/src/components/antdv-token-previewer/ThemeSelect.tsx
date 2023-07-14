import type { PropType } from 'vue';
import { defineComponent, toRefs, computed } from 'vue';
import makeStyle from './utils/makeStyle';
import classNames from 'ant-design-vue/es/_util/classNames';
import { Button, Dropdown, Menu } from 'ant-design-vue';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { Theme } from './interface';

interface ThemeItem extends Theme {
  icon?: any;
  closable?: boolean;
  fixed?: boolean;
}

export type ThemeSelectProps = {
  onEnabledThemeChange: (themes: string[]) => void;
  onShownThemeChange: (
    themes: string[],
    selectTheme: string,
    info: { type: 'select' | 'deselect' },
  ) => void;
  enabledThemes: string[];
  shownThemes: string[];
  themes: ThemeItem[];
  showAddTheme?: boolean;
};

const useStyle = makeStyle('ThemeSelect', token => ({
  '.previewer-theme-select': {
    padding: `${token.paddingXXS}px ${token.paddingXS}px`,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    height: token.controlHeight,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',

    [`${token.rootCls}-btn.previewer-theme-select-add-btn`]: {
      minWidth: 0,
      width: 16,
      height: 16,
      fontSize: 8,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginInlineStart: token.marginSM,
      boxShadow: 'none',
    },

    '.previewer-theme-select-tag': {
      height: 22,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      borderRadius: 4,
      backgroundColor: token.colorBgContainer,
      border: `${token.lineWidth}px ${token.lineType} ${token.colorBorder}`,
      paddingInline: 10,
      fontSize: token.fontSizeSM,
      position: 'relative',
      cursor: 'pointer',
      // transition: `all ${token.motionDurationMid}`,

      '&:not(:last-child)': {
        marginInlineEnd: token.marginXS,
      },

      '&.previewer-theme-select-tag-active': {
        border: `${token.lineWidth}px ${token.lineType} ${token['blue-1']}`,
        backgroundColor: 'rgba(22,119,255,0.10)',
        color: token.colorPrimary,

        '&::after': {
          content: '""',
          borderStartEndRadius: 2,
          position: 'absolute',
          insetInlineEnd: 2,
          top: 2,
          width: 6,
          height: 6,
          background: `linear-gradient(to right top, transparent, transparent 50%, ${token.colorPrimary} 50%, ${token.colorPrimary} 100%)`,
        },
      },

      '.previewer-theme-select-tag-close-btn': {
        position: 'absolute',
        top: -2,
        insetInlineEnd: -2,
        width: 12,
        height: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: token.colorBgContainer,
        boxShadow:
          '0 2px 8px -2px rgba(0,0,0,0.05), 0 1px 4px -1px rgba(25,15,15,0.07), 0 0 1px 0 rgba(0,0,0,0.08)',
        borderRadius: '50%',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 2,
        color: token.colorIcon,

        '> .anticon': {
          fontSize: 6,
        },
      },

      '&:hover': {
        '.previewer-theme-select-tag-close-btn': {
          opacity: 1,
          pointerEvents: 'initial',
        },
      },
    },
  },

  '.previewer-theme-select-dropdown': {
    '.previewer-theme-select-dropdown-title': {
      [`${token.rootCls}-dropdown-menu-item-group-title`]: {
        fontSize: token.fontSizeSM,
        paddingBottom: token.padding,
        paddingTop: 10,
      },
    },
  },
}));

const ThemeSelect = defineComponent({
  name: 'ThemeSelect',
  inheritAttrs: false,
  props: {
    onEnabledThemeChange: { type: Function as PropType<(themes: string[]) => void> },
    onShownThemeChange: {
      type: Function as PropType<
        (themes: string[], selectTheme: string, info: { type: 'select' | 'deselect' }) => void
      >,
    },
    enabledThemes: { type: Array as PropType<string[]> },
    shownThemes: { type: Array as PropType<string[]> },
    themes: { type: Array as PropType<ThemeItem[]> },
    showAddTheme: { type: Boolean },
  },
  setup(props, { attrs }) {
    const { enabledThemes, shownThemes, themes, showAddTheme } = toRefs(props);

    const [wrapSSR, hashId] = useStyle();

    const dropdownItems = computed(() => [
      {
        disabled: true,
        label: '添加主题即可预览',
        className: 'previewer-theme-select-dropdown-title',
        type: 'group',
        key: 'add-theme-to-preview',
      },
      ...themes.value
        .filter(theme => !shownThemes.value.includes(theme.key))
        .map(theme => ({
          icon: theme.icon,
          value: theme.key,
          label: theme.name,
          key: theme.key,
          onClick: () => {
            props.onShownThemeChange([...shownThemes.value, theme.key], theme.key, {
              type: 'select',
            });
          },
        })),
    ]);

    const shownThemeEntities = computed(() =>
      themes.value.filter(theme => shownThemes.value.includes(theme.key)),
    );

    return () => {
      return wrapSSR(
        <div {...attrs} class={classNames('previewer-theme-select', hashId.value, attrs.class)}>
          {shownThemeEntities.value.map(theme => (
            <span
              onClick={() => {
                if (theme.fixed) {
                  return;
                }
                props.onEnabledThemeChange(
                  enabledThemes.value.includes(theme.key)
                    ? enabledThemes.value.filter(item => item !== theme.key)
                    : [...enabledThemes.value, theme.key],
                );
              }}
              key={theme.key}
              class={classNames('previewer-theme-select-tag', {
                'previewer-theme-select-tag-active': enabledThemes.value.includes(theme.key),
              })}
            >
              {theme.name}
              {theme.closable && (
                <span
                  class="previewer-theme-select-tag-close-btn"
                  onClick={e => {
                    e.stopPropagation();
                    props.onEnabledThemeChange(
                      enabledThemes.value.filter(item => item !== theme.key),
                    );
                    props.onShownThemeChange(
                      shownThemes.value.filter(item => item !== theme.key),
                      theme.key,
                      { type: 'deselect' },
                    );
                  }}
                >
                  <CloseOutlined />
                </span>
              )}
            </span>
          ))}
          {showAddTheme.value && (
            <Dropdown
              placement="bottomRight"
              trigger={['click']}
              overlayClassName={classNames('previewer-theme-select-dropdown', hashId.value)}
              v-slots={{
                overlay: () => <Menu items={dropdownItems.value} />,
              }}
            >
              <Button
                type="primary"
                shape="circle"
                class="previewer-theme-select-add-btn"
                icon={<PlusOutlined />}
              />
            </Dropdown>
          )}
        </div>,
      );
    };
  },
});

export default ThemeSelect;
