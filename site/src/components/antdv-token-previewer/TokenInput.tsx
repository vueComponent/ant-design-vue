import { Button, Dropdown, Input, InputNumber } from 'ant-design-vue';
import classNames from 'ant-design-vue/es/_util/classNames';
import type { PropType } from 'vue';
import { defineComponent, toRefs, computed, ref, watch } from 'vue';
import { debounce } from 'lodash';
import ColorPanel from './ColorPanel';
import ColorPreview from './ColorPreview';
import type { MutableTheme } from './interface';
import { useInjectLocaleContext } from './locale';
import isColor from './utils/isColor';
import makeStyle from './utils/makeStyle';

const useStyle = makeStyle('TokenInput', token => ({
  '.previewer-token-input': {
    [`${token.rootCls}-input-group-addon, ${token.rootCls}-input-number-group-addon`]: {
      border: '0 !important',
      color: `rgba(0, 0, 0, 0.25) !important`,
      fontSize: `${token.fontSizeSM}px !important`,
      padding: '0 !important',
      backgroundColor: 'transparent !important',

      '&:first-child': {
        paddingInlineStart: 0,
      },

      '&:last-child': {
        paddingInlineEnd: 0,
      },
    },

    [`${token.rootCls}-input-group-wrapper, ${token.rootCls}-input-number-group-wrapper`]: {
      padding: 0,
      height: 24,
      width: '100%',

      input: {
        fontSize: token.fontSizeSM,
        lineHeight: token.lineHeightSM,
        padding: `2px ${token.paddingXS}px`,
        height: 24,
      },
    },

    [`${token.rootCls}-input-group-wrapper ${token.rootCls}-input, ${token.rootCls}-input-number-group-wrapper ${token.rootCls}-input-number`]:
      {
        background: 'white',
        borderRadius: `${token.borderRadiusLG}px !important`,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      },

    '&&-light': {
      [`${token.rootCls}-input-group-addon, ${token.rootCls}-input-number-group-addon`]: {
        backgroundColor: token.colorBgContainer,
      },

      [`${token.rootCls}-input-group-wrapper ${token.rootCls}-input,
        ${token.rootCls}-input-number-group-wrapper ${token.rootCls}-input-number-input`]: {
        background: token.colorFillAlter,
      },
    },

    '&&-readonly': {
      input: {
        cursor: 'text',
        color: token.colorText,
      },
    },
  },
}));

export type TokenInputProps = {
  theme?: MutableTheme;
  value?: string | number;
  onChange?: (value: string | number) => void;
  light?: boolean;
  readonly?: boolean;
  onReset?: () => void;
  canReset?: boolean;
  hideTheme?: boolean;
};

const TokenInput = defineComponent({
  name: 'TokenInput',
  inheritAttrs: false,
  props: {
    theme: { type: Object as PropType<MutableTheme> },
    value: { type: [String, Number] },
    onChange: { type: Function as PropType<(value: string | number) => void> },
    light: { type: Boolean },
    readonly: { type: Boolean },
    onReset: { type: Function as PropType<() => void> },
    canReset: { type: Boolean },
    hideTheme: { type: Boolean },
  },
  setup(props, { attrs }) {
    const { value, theme, light, readonly, canReset: customCanReset, hideTheme } = toRefs(props);

    const valueRef = ref<number | string>(value.value || '');

    const tokenValue = ref<string | number>(value.value || '');

    const canReset = computed(() => customCanReset.value ?? valueRef.value !== tokenValue.value);

    const locale = useInjectLocaleContext();

    const [wrapSSR, hashId] = useStyle();

    watch(
      value,
      val => {
        if (val !== undefined) {
          tokenValue.value = val;
        }
      },
      { immediate: true },
    );

    const debouncedOnChange = debounce((newValue: number | string) => {
      props.onChange?.(newValue);
    }, 500);

    const handleTokenChange = (newValue: number | string) => {
      if (!readonly.value) {
        tokenValue.value = newValue;
        debouncedOnChange(newValue);
      }
    };

    const handleReset = () => {
      if (props.onReset) {
        props.onReset();
      } else {
        handleTokenChange(valueRef.value);
      }
    };

    return () => {
      const addonAfter = !readonly.value && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            minWidth: hideTheme.value ? '' : '80px',
          }}
        >
          {canReset.value || hideTheme.value ? (
            <Button
              style={{
                fontSize: '12px',
              }}
              onClick={handleReset}
              type="link"
              size="small"
              disabled={!canReset.value}
            >
              {locale.value.reset}
            </Button>
          ) : (
            <span style={{ padding: '0 8px' }}>{theme.value?.name}</span>
          )}
        </span>
      );

      let inputNode;
      if (typeof valueRef.value === 'string' && isColor(valueRef.value)) {
        inputNode = (
          <Input
            bordered={false}
            addonAfter={addonAfter}
            value={String(tokenValue.value)}
            disabled={readonly.value}
            addonBefore={
              <Dropdown
                trigger={['click']}
                overlay={
                  <ColorPanel
                    alpha
                    color={String(tokenValue.value)}
                    onChange={(v: string) => {
                      handleTokenChange(v);
                    }}
                  />
                }
              >
                <ColorPreview
                  color={String(tokenValue.value)}
                  dark={theme.value?.key === 'dark'}
                  style={{
                    cursor: 'pointer',
                    marginInlineEnd: '8px',
                    verticalAlign: 'top',
                  }}
                />
              </Dropdown>
            }
            onChange={e => {
              handleTokenChange(e.target.value);
            }}
          />
        );
      } else if (typeof valueRef.value === 'number') {
        inputNode = (
          <InputNumber
            addonAfter={addonAfter}
            bordered={false}
            value={tokenValue.value}
            disabled={readonly.value}
            onChange={newValue => {
              handleTokenChange(Number(newValue));
            }}
          />
        );
      } else {
        inputNode = (
          <Input
            addonAfter={addonAfter}
            bordered={false}
            value={String(tokenValue.value)}
            disabled={readonly.value}
            onChange={e => {
              handleTokenChange(
                typeof value.value === 'number' ? Number(e.target.value) : e.target.value,
              );
            }}
          />
        );
      }
      return wrapSSR(
        <div
          {...attrs}
          class={classNames('previewer-token-input', hashId.value, attrs.class, {
            'previewer-token-input-light': light.value,
            'previewer-token-input-readonly': readonly.value,
          })}
        >
          {inputNode}
        </div>,
      );
    };
  },
});

export default TokenInput;
