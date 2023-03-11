import { Tabs } from 'ant-design-vue';
import type { Theme } from '../interface';
import classNames from 'ant-design-vue/es/_util/classNames';
import { PropType, toRefs } from 'vue';
import { defineComponent, watchEffect, computed, ref } from 'vue';
import type { SelectedToken } from '../interface';
import { useInjectLocaleContext } from '../locale';
import { tokenCategory } from '../meta';
import type { TokenGroup } from '../meta/interface';
import makeStyle from '../utils/makeStyle';
import AliasPanel from './AliasPanel';
import TokenContent from './TokenContent';

const { TabPane } = Tabs;

const useStyle = makeStyle('TokenPanelPro', token => ({
  '.token-panel-pro': {
    height: '100%',
    display: 'flex',
    borderInlineEnd: `1px solid ${token.colorBorderSecondary}`,
    [`.token-panel-pro-tabs${token.rootCls}-tabs`]: {
      height: '100%',
      overflow: 'auto',
      [`${token.rootCls}-tabs-content`]: {
        height: '100%',
        [`${token.rootCls}-tabs-tabpane`]: {
          height: '100%',
        },
      },
    },
  },
}));

export type TokenPanelProProps = {
  theme: Theme;
  selectedTokens?: SelectedToken;
  infoFollowPrimary?: boolean;
  aliasOpen?: boolean;
  activeTheme?: string;
  onTokenSelect?: (token: string | string[], type: keyof SelectedToken) => void;
  onInfoFollowPrimaryChange?: (value: boolean) => void;
  onAliasOpenChange?: (value: boolean) => void;
};

const TokenPanelPro = defineComponent({
  name: 'TokenPanelPro',
  inheritAttrs: false,
  props: {
    theme: { type: Object as PropType<Theme> },
    selectedTokens: { type: Object as PropType<SelectedToken> },
    infoFollowPrimary: { type: Boolean },
    aliasOpen: { type: Boolean },
    activeTheme: { type: String },
    onTokenSelect: {
      type: Function as PropType<(token: string | string[], type: keyof SelectedToken) => void>,
    },
    onInfoFollowPrimaryChange: { type: Function as PropType<(value: boolean) => void> },
    onAliasOpenChange: { type: Function as PropType<(value: boolean) => void> },
  },
  setup(props, { attrs }) {
    const { theme, selectedTokens, infoFollowPrimary, aliasOpen } = toRefs(props);

    const [wrapSSR, hashId] = useStyle();

    const activeGroup = ref<string>('brandColor');
    const locale = useInjectLocaleContext();

    const activeCategory = computed(() => {
      return tokenCategory.reduce<TokenGroup<string> | undefined>((result, category) => {
        return result ?? category.groups.find(group => group.key === activeGroup.value);
      }, undefined);
    });

    watchEffect(() => {
      props.onTokenSelect(activeCategory.value?.seedToken ?? [], 'seed');
    });

    return () => {
      return wrapSSR(
        <div {...attrs} class={classNames(hashId.value, attrs.class, 'token-panel-pro')}>
          <Tabs
            defaultActiveKey="color"
            tabBarGutter={32}
            tabBarStyle={{ padding: '0 16px', margin: 0 }}
            style={{ height: '100%', flex: '0 0 540px' }}
            class="token-panel-pro-tabs"
            onChange={key => {
              activeGroup.value =
                tokenCategory.find(category => category.nameEn === key)?.groups[0].key ?? '';
            }}
          >
            {tokenCategory.map(category => (
              <TabPane
                key={category.nameEn}
                tab={locale.value._lang === 'zh-CN' ? category.name : category.nameEn}
              >
                <TokenContent
                  category={category}
                  theme={theme.value}
                  selectedTokens={selectedTokens.value}
                  onTokenSelect={props.onTokenSelect}
                  infoFollowPrimary={infoFollowPrimary.value}
                  onInfoFollowPrimaryChange={props.onInfoFollowPrimaryChange}
                  v-model={[activeGroup.value, 'activeGroup']}
                />
              </TabPane>
            ))}
          </Tabs>
          <AliasPanel
            open={aliasOpen.value}
            description={activeCategory.value?.aliasTokenDescription}
            onOpenChange={props.onAliasOpenChange}
            activeSeeds={activeCategory.value?.seedToken}
            theme={theme.value}
            style={{ flex: aliasOpen.value ? '0 0 320px' : 'none', width: 0 }}
            selectedTokens={selectedTokens.value}
            onTokenSelect={props.onTokenSelect}
          />
        </div>,
      );
    };
  },
});

export default TokenPanelPro;
