import type { PropType } from 'vue';
import { defineComponent, toRefs, watch, computed, ref } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { Badge, Input, Tree } from 'ant-design-vue';
import classNames from 'ant-design-vue/es/_util/classNames';
import type { FilterMode } from '../FilterPanel';
import makeStyle from '../utils/makeStyle';
import { getRelatedComponents } from '../utils/statistic';

const { DirectoryTree } = Tree;

const useStyle = makeStyle('ComponentTree', token => ({
  '.component-tree-wrapper': {
    minWidth: 200,
    borderInlineEnd: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    paddingBlock: token.paddingXS,

    '.component-tree-search': {
      margin: '0 8px 12px',
      width: 'calc(100% - 16px)',
      backgroundColor: 'rgba(0, 0, 0, 2%)',
      borderRadius: token.borderRadiusLG,
      height: 24,
      input: {
        fontSize: 12,
      },
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 4%)',
      },
    },

    [`${token.rootCls}-tree.component-tree`]: {
      fontSize: token.fontSizeSM,

      '.component-tree-item.component-tree-item-highlight': {
        color: token.colorPrimary,
      },

      [`${token.rootCls}-tree-node-content-wrapper`]: {
        transition: `background-color ${token.motionDurationSlow}`,
        borderRadius: 4,
      },

      [`${token.rootCls}-tree-treenode-selected ${token.rootCls}-tree-node-content-wrapper`]: {
        color: token.colorTextLightSolid,

        '.component-tree-item.component-tree-item-highlight': {
          color: token.colorTextLightSolid,
        },
      },

      '.component-tree-item': {
        transition: `color ${token.motionDurationMid}`,
        lineHeight: `24px`,
        height: 24,
        display: 'inline-block',
      },
    },
  },
}));

export type ComponentTreeProps = {
  onSelect?: (component: string) => void;
  components: Record<string, string[]>;
  selectedTokens?: string[];
  filterMode?: FilterMode;
  activeComponent?: string;
};

const getTreeItemId = (component: string) => `component-tree-item-${component}`;

const ComponentTree = defineComponent({
  name: 'ComponentTree',
  inheritAttrs: false,
  props: {
    onSelect: { type: Function as PropType<(component: string) => void> },
    components: { type: Object as PropType<Record<string, string[]>> },
    selectedTokens: { type: Array as PropType<string[]> },
    filterMode: { type: String as PropType<FilterMode>, default: 'filter' },
    activeComponent: { type: String },
  },
  setup(props, { attrs }) {
    const { components, selectedTokens, filterMode, activeComponent } = toRefs(props);

    const [wrapSSR, hashId] = useStyle();
    const treeRef = ref<HTMLDivElement>(null);
    const search = ref<string>('');

    const relatedComponents = computed(() => {
      return selectedTokens.value ? getRelatedComponents(selectedTokens.value) : [];
    });

    watch(activeComponent, val => {
      treeRef.value?.querySelector<HTMLElement>(`#${getTreeItemId(val || '')}`)?.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    });

    const treeData = computed(() =>
      Object.entries(components.value)
        .filter(
          ([, group]) =>
            (filterMode.value === 'highlight' ||
              !relatedComponents.value.length ||
              group.some(item => relatedComponents.value.includes(item))) &&
            (!search.value ||
              group.some(item => item.toLowerCase().includes(search.value.toLowerCase()))),
        )
        .map(([type, group]) => ({
          title: type,
          key: `type-${type}`,
          children: group
            .filter(
              item =>
                (filterMode.value === 'highlight' ||
                  !relatedComponents.value.length ||
                  relatedComponents.value.includes(item)) &&
                (!search.value || item.toLowerCase().includes(search.value.toLowerCase())),
            )
            .map(item => ({
              title: (
                <span
                  id={getTreeItemId(item)}
                  class={classNames('component-tree-item', {
                    'component-tree-item-highlight':
                      filterMode.value === 'highlight' && relatedComponents.value.includes(item),
                  })}
                >
                  {item}
                </span>
              ),
              switcherIcon: () => (
                <Badge
                  color={
                    filterMode.value === 'highlight' && relatedComponents.value.includes(item)
                      ? activeComponent.value === item
                        ? 'white'
                        : 'blue'
                      : 'transparent'
                  }
                />
              ),
              key: item,
            })),
        })),
    );

    const watcher = filterMode => {
      if (filterMode === 'highlight') {
        setTimeout(() => {
          treeRef.value?.getElementsByClassName('component-tree-item-active')[0]?.scrollIntoView({
            block: 'start',
            inline: 'nearest',
            behavior: 'smooth',
          });
        }, 100);
      }
    };
    watch(selectedTokens, () => {
      watcher(filterMode.value);
    });

    watch(filterMode, val => {
      watcher(val);
    });

    return () => {
      return wrapSSR(
        <div {...attrs} class={classNames('component-tree-wrapper', hashId.value, attrs.class)}>
          <Input
            allowClear
            placeholder="Type to search"
            value={search.value}
            onChange={e => (search.value = e.target.value)}
            prefix={<SearchOutlined />}
            bordered={false}
            class="component-tree-search"
          />
          <div ref={treeRef} style={{ overflow: 'auto', flex: 1 }}>
            <DirectoryTree
              selectedKeys={[activeComponent.value ?? '']}
              showIcon={false}
              defaultExpandAll
              treeData={treeData.value}
              class="component-tree"
              onSelect={node => props.onSelect?.(node[0] as string)}
              expandAction="doubleclick"
            />
          </div>
        </div>,
      );
    };
  },
});

export default ComponentTree;
