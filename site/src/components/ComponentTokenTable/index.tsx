import { defineComponent, toRefs, computed } from 'vue';
import type { PropType } from 'vue';
import { ConfigProvider, Table } from 'ant-design-vue';
import { getDesignToken } from '../antdv-token-previewer';
import tokenMeta from 'ant-design-vue/es/version/token-meta.json';
import tokenData from 'ant-design-vue/es/version/token.json';
import { useLocale } from '../../i18n';
import useSiteToken from '../../hooks/useSiteToken';
import { useColumns } from '../TokenTable';
import ColorChunk from '../ColorChunk';

const defaultToken = getDesignToken();

const locales = {
  cn: {
    token: 'Token 名称',
    description: '描述',
    type: '类型',
    value: '默认值',
  },
  en: {
    token: 'Token Name',
    description: 'Description',
    type: 'Type',
    value: 'Default Value',
  },
};

interface SubTokenTableProps {
  defaultOpen?: boolean;
  title: string;
  tokens: string[];
}

const SubTokenTable = defineComponent({
  props: {
    defaultOpen: {
      type: Boolean as PropType<SubTokenTableProps['defaultOpen']>,
    },
    title: {
      type: String as PropType<SubTokenTableProps['title']>,
    },
    tokens: {
      type: Array as PropType<SubTokenTableProps['tokens']>,
    },
  },
  setup(props) {
    const { defaultOpen, title, tokens } = toRefs(props);
    const [, lang] = useLocale(locales);
    const siteToken = useSiteToken();
    const token = computed(() => siteToken.value.token);
    const columns = useColumns();

    return () => {
      if (!tokens.value.length) {
        return null;
      }

      const data = tokens.value
        .sort((token1, token2) => {
          const hasColor1 = token1.toLowerCase().includes('color');
          const hasColor2 = token2.toLowerCase().includes('color');

          if (hasColor1 && !hasColor2) {
            return -1;
          }

          if (!hasColor1 && hasColor2) {
            return 1;
          }

          return token1 < token2 ? -1 : 1;
        })
        .map(name => {
          const meta = tokenMeta[name];

          if (!meta) {
            return null;
          }

          return {
            name,
            desc: lang.value === 'cn' ? meta.desc : meta.descEn,
            type: meta.type,
            value: (defaultToken as any)[name],
          };
        })
        .filter(info => info);

      return (
        // Reuse `.markdown` style
        <details class="markdown" open={defaultOpen.value || process.env.NODE_ENV !== 'production'}>
          <summary>
            <h3 style={{ display: 'inline' }}>{title.value}</h3>
          </summary>
          <ConfigProvider
            theme={{
              token: {
                borderRadius: 0,
              },
            }}
          >
            <Table
              size="middle"
              columns={columns}
              bordered
              dataSource={data}
              style={{ marginBottom: token.value.margin }}
              pagination={false}
              rowKey={record => record.name}
              v-slots={{
                bodyCell: ({ text, record, column }) => {
                  if (column.key === 'type') {
                    return (
                      <span
                        style={{
                          margin: '0 1px',
                          padding: '0.2em 0.4em',
                          fontSize: '0.9em',
                          background: `${token.value.siteMarkdownCodeBg}`,
                          border: `1px solid ${token.value.colorSplit}`,
                          borderRadius: '3px',
                          fontFamily: 'monospace',
                        }}
                      >
                        {record.type}
                      </span>
                    );
                  }
                  if (column.key === 'value') {
                    const isColor =
                      typeof record.value === 'string' &&
                      (record.value.startsWith('#') || record.value.startsWith('rgb'));
                    if (isColor) {
                      return <ColorChunk color={record.value}>{record.value}</ColorChunk>;
                    }
                    return (
                      <span>
                        {typeof record.value !== 'string'
                          ? JSON.stringify(record.value)
                          : record.value}
                      </span>
                    );
                  }
                  return <span>{text} </span>;
                },
              }}
            />
          </ConfigProvider>
        </details>
      );
    };
  },
});

export interface ComponentTokenTableProps {
  component: string;
}

const ComponentTokenTable = defineComponent({
  props: {
    component: {
      type: String as PropType<ComponentTokenTableProps['component']>,
    },
  },
  setup(props) {
    const { component } = toRefs(props);

    const mergedTokens = computed(() => {
      const globalTokenSet = new Set<string>();
      let componentTokens: Record<string, string> = {};

      component.value.split(',').forEach(comp => {
        const { global: globalTokens = [], component: singleComponentTokens = [] } =
          tokenData[comp] || {};

        globalTokens.forEach((token: string) => {
          globalTokenSet.add(token);
        });

        componentTokens = {
          ...componentTokens,
          ...singleComponentTokens,
        };
      });

      return {
        mergedGlobalTokens: Array.from(globalTokenSet),
        mergedComponentTokens: componentTokens,
      };
    });

    return () => {
      return (
        <>
          {/* Component Token 先不展示 */}
          {/* <SubTokenTable title="Component Token" tokens={mergedComponentTokens} defaultOpen /> */}
          <SubTokenTable title="Global Token" tokens={mergedTokens.value.mergedGlobalTokens} />
        </>
      );
    };
  },
});

export default ComponentTokenTable;
