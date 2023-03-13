import type { PropType } from 'vue';
import { defineComponent, toRefs, ref } from 'vue';
import {
  AlignLeftOutlined,
  BgColorsOutlined,
  BorderHorizontalOutlined,
  BulbOutlined,
  CaretRightOutlined,
  ControlOutlined,
  FileUnknownOutlined,
  FontColorsOutlined,
  FontSizeOutlined,
  FormatPainterOutlined,
  HighlightOutlined,
  RadiusSettingOutlined,
  TabletOutlined,
} from '@ant-design/icons-vue';
import { Collapse, Space } from 'ant-design-vue';
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context';
import classNames from 'ant-design-vue/es/_util/classNames';
import PropTypes from 'ant-design-vue/es/_util/vue-types';
import { Motion, ShapeLine } from '../../icons';
import type { MutableTheme, TokenValue } from '../../interface';
import type { TokenType } from '../../utils/classifyToken';
import makeStyle from '../../utils/makeStyle';
import { getRelatedComponents } from '../../utils/statistic';
import TokenItem from '../token-item';

const { Panel } = Collapse;

export interface TokenCardProps {
  title: string;
  icon?: any;
  tokenArr: string[];
  tokenPath: string[];
  keyword?: string;
  hideUseless?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  activeToken?: string;
  onActiveTokenChange?: (token: string | undefined) => void;
  onTokenChange?: (theme: MutableTheme, tokenName: string, value: TokenValue) => void;
  themes: MutableTheme[];
  selectedTokens?: string[];
  onTokenSelect?: (token: string) => void;
  enableTokenSelect?: boolean;
  hideUsageCount?: boolean;
  placeholder?: any;
  fallback?: (config: ThemeConfig) => Record<string, TokenValue>;
}

export const IconMap: Record<TokenType, any> = {
  seed: <BulbOutlined />,
  colorText: <FontColorsOutlined />,
  colorBg: <BgColorsOutlined />,
  colorSplit: <BorderHorizontalOutlined />,
  colorFill: <HighlightOutlined />,
  colorCommon: <FormatPainterOutlined />,
  space: <ShapeLine />,
  font: <FontSizeOutlined />,
  line: <AlignLeftOutlined />,
  screen: <TabletOutlined />,
  motion: <Motion />,
  radius: <RadiusSettingOutlined />,
  control: <ControlOutlined />,
  others: <FileUnknownOutlined />,
};
export const TextMap: Record<TokenType, string> = {
  seed: 'Seed Token',
  colorCommon: 'Common Color 通用颜色',
  colorText: 'Text Color 文本颜色',
  colorBg: 'Background Color 背景颜色',
  colorFill: 'Fill Color 填充颜色',
  colorSplit: 'Split Color 分割线颜色',
  space: 'Space 间距',
  font: 'Font 文本',
  line: 'Line 线',
  screen: 'Screen 屏幕',
  motion: 'Motion 动画',
  radius: 'Radius 圆角',
  control: 'Control 控件',
  others: 'Others 未分类',
};

const useStyle = makeStyle('TokenCard', token => ({
  '.token-card': {
    width: '100%',
    height: 'auto',
    borderRadius: token.borderRadiusLG,
    border: `1px solid rgba(0,0,0,0.09)`,
    marginBottom: token.marginSM,

    [`${token.rootCls}-collapse.token-card-collapse`]: {
      [`> ${token.rootCls}-collapse-item > ${token.rootCls}-collapse-content > ${token.rootCls}-collapse-content-box`]:
        {
          padding: {
            _skip_check_: true,
            value: `0 ${token.paddingXS}px 12px !important`,
          },
        },
    },
  },
  [`.token-card ${token.rootCls}-input-group >${token.rootCls}-input:not(:first-child):not(:last-child)`]:
    {
      background: 'white',
      borderRadius: token.borderRadiusLG,
    },
}));

export default defineComponent({
  name: 'TokenCard',
  props: {
    title: { type: String as PropType<string> },
    icon: PropTypes.any,
    tokenArr: { type: Array as PropType<string[]> },
    tokenPath: { type: Array as PropType<string[]> },
    keyword: { type: String as PropType<string> },
    hideUseless: { type: Boolean },
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    activeToken: { type: String as PropType<string> },
    themes: { type: Array as PropType<MutableTheme[]> },
    selectedTokens: { type: Array as PropType<string[]> },
    enableTokenSelect: { type: Boolean },
    hideUsageCount: { type: Boolean },
    placeholder: PropTypes.any,
    onOpenChange: { type: Function as PropType<(open: boolean) => void> },
    onActiveTokenChange: { type: Function as PropType<(token: string | undefined) => void> },
    onTokenChange: {
      type: Function as PropType<
        (theme: MutableTheme, tokenName: string, value: TokenValue) => void
      >,
    },
    onTokenSelect: { type: Function as PropType<(token: string) => void> },
    fallback: { type: Function as PropType<(config: ThemeConfig) => Record<string, TokenValue>> },
  },
  setup(props, { attrs, slots }) {
    const {
      title,
      tokenArr,
      keyword,
      hideUseless,
      defaultOpen,
      activeToken,
      tokenPath,
      selectedTokens,
      themes,
      enableTokenSelect,
      hideUsageCount,
    } = toRefs(props);

    const [wrapSSR, hashId] = useStyle();

    const activeKeys = ref(!!defaultOpen.value ? ['1'] : []);

    return () => {
      const icon = slots.icon ? slots.icon() : props.icon;

      const placeholder = slots.placeholder ? slots.placeholder() : props.placeholder;

      return wrapSSR(
        <div {...attrs} class={classNames('token-card', hashId.value)}>
          <Collapse
            ghost
            v-slots={{
              expandIcon: ({ isActive }) => (
                <CaretRightOutlined
                  rotate={isActive ? 450 : 360}
                  style={{ fontSize: '12px', color: 'rgba(0,0,0,0.45)' }}
                />
              ),
            }}
            expandIconPosition="end"
            class="token-card-collapse"
            v-model={[activeKeys.value, 'activeKey']}
            onChange={() => {
              // onOpenChange?.(keys.length > 0);
              props.onOpenChange(activeKeys.value.length > 0);
            }}
          >
            <Panel
              v-slots={{
                header: () => (
                  <Space size="small">
                    <span>{title.value}</span>
                    <span>{icon}</span>
                  </Space>
                ),
              }}
              key="1"
            >
              {tokenArr.value
                .filter(
                  tokenName =>
                    (!keyword.value ||
                      tokenName.toLowerCase().includes(keyword.value.toLowerCase())) &&
                    (!hideUseless.value || getRelatedComponents(tokenName).length > 0),
                )
                .map(tokenName => {
                  return (
                    <TokenItem
                      tokenPath={tokenPath.value}
                      onActiveChange={active =>
                        props.onActiveTokenChange?.(active ? tokenName : undefined)
                      }
                      active={activeToken.value === tokenName}
                      tokenName={tokenName}
                      key={tokenName}
                      onTokenChange={props.onTokenChange}
                      themes={themes.value}
                      selectedTokens={selectedTokens.value}
                      onTokenSelect={props.onTokenSelect}
                      enableTokenSelect={enableTokenSelect.value}
                      hideUsageCount={hideUsageCount.value}
                      fallback={props.fallback}
                    />
                  );
                })}
              {tokenArr.value.length === 0 && placeholder}
            </Panel>
          </Collapse>
        </div>,
      );
    };
  },
});
