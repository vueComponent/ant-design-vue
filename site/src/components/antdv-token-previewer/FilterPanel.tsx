import type { CSSProperties, PropType } from 'vue';
import { defineComponent, toRefs, ref } from 'vue';
import makeStyle from './utils/makeStyle';
import classNames from 'ant-design-vue/es/_util/classNames';
import { Segmented, Tag } from 'ant-design-vue';

const useStyle = makeStyle('FilterPanel', token => ({
  '.previewer-filter-panel': {
    // boxShadow:
    //   '0 2px 4px 0 rgba(0,0,0,0.05), 0 1px 2px 0 rgba(25,15,15,0.07), 0 0 1px 0 rgba(0,0,0,0.08)',
    // backgroundColor: '#fff',
    // borderRadius: 6,
    // padding: '8px 12px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'start',

    '.component-tree-head': {
      display: 'flex',
      alignItems: 'center',
      flex: 'none',
      marginInlineEnd: 20,

      '.component-tree-filter-type': {
        color: token.colorTextSecondary,
        marginInlineEnd: token.marginXS,
        fontSize: token.fontSizeSM,
      },

      '.component-tree-filter-segmented': {
        fontSize: token.fontSizeSM,
      },
    },

    '.preview-panel-subtitle': {
      fontSize: token.fontSizeSM,
      color: token.colorTextSecondary,
    },

    [`${token.rootCls}-tag.previewer-token-filter-tag`]: {
      color: token.colorPrimary,
      backgroundColor: 'rgba(22,119,255,0.10)',
      border: 'none',
      borderRadius: 4,

      '> .anticon': {
        color: token.colorPrimary,
      },
    },
  },
}));

export type FilterMode = 'highlight' | 'filter';

export type FilterPanelProps = {
  filterMode?: FilterMode;
  onFilterModeChange?: (mode: FilterMode) => void;
  selectedTokens: string[];
  onSelectedTokensChange?: (newTokens: string[]) => void;
  onTokenClick?: (token: string) => void;
  className?: string;
  style?: CSSProperties;
};

const FilterPanel = defineComponent({
  name: 'FilterPanel',
  inheritAttrs: false,
  props: {
    filterMode: { type: String as PropType<FilterMode> },
    onFilterModeChange: { type: Function as PropType<(mode: FilterMode) => void> },
    selectedTokens: { type: Array as PropType<string[]> },
    onSelectedTokensChange: { type: Function as PropType<(newTokens: string[]) => void> },
    onTokenClick: { type: Function as PropType<(token: string) => void> },
  },
  setup(props, { attrs }) {
    const { filterMode: customFilterMode, selectedTokens } = toRefs(props);

    const [wrapSSR, hashId] = useStyle();

    const filterMode = ref<FilterMode>(customFilterMode.value || 'filter');

    return () => {
      if (selectedTokens.value.length === 0) {
        return null;
      }
      return wrapSSR(
        <div {...attrs} class={classNames('previewer-filter-panel', hashId.value, attrs.class)}>
          {selectedTokens.value && selectedTokens.value.length > 0 && (
            <>
              <div class="component-tree-head">
                <div class="component-tree-filter-type">筛选方式：</div>
                <Segmented
                  class="component-tree-filter-segmented"
                  size="small"
                  value={filterMode.value}
                  onChange={value => {
                    props.onFilterModeChange?.(value as any);
                    filterMode.value = value as any;
                  }}
                  options={[
                    { label: '过滤', value: 'filter' },
                    { label: '高亮', value: 'highlight' },
                  ]}
                />
              </div>
              <div>
                <span class="preview-panel-subtitle">已选中：</span>
                {selectedTokens.value.map(token => (
                  <Tag
                    key={token}
                    closable
                    onClose={() =>
                      props.onSelectedTokensChange?.(
                        selectedTokens.value?.filter(item => item !== token),
                      )
                    }
                    style={{ marginBlock: '2px', cursor: 'pointer' }}
                    class="previewer-token-filter-tag"
                    onClick={() => props.onTokenClick?.(token)}
                  >
                    {token}
                  </Tag>
                ))}
              </div>
            </>
          )}
        </div>,
      );
    };
  },
});

export default FilterPanel;
