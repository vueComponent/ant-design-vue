import { defineComponent, toRefs, computed } from 'vue';
import type { PropType } from 'vue';
import type { TableProps } from 'ant-design-vue';
import { Table } from 'ant-design-vue';
import { getDesignToken } from '../antdv-token-previewer';
import tokenMeta from 'ant-design-vue/es/version/token-meta.json';
import { useLocale } from '../../i18n';
import useSiteToken from '../../hooks/useSiteToken';
import ColorChunk from '../ColorChunk';

type TokenTableProps = {
  type: 'seed' | 'map' | 'alias';
  lang: 'zh' | 'en';
};

type TokenData = {
  name: string;
  desc: string;
  type: string;
  value: any;
};

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

export function useColumns(): Exclude<TableProps<TokenData>['columns'], undefined> {
  const [locale] = useLocale(locales);

  return [
    {
      title: locale.value.token,
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: locale.value.description,
      key: 'desc',
      dataIndex: 'desc',
    },
    {
      title: locale.value.type,
      key: 'type',
      dataIndex: 'type',
    },
    {
      title: locale.value.value,
      key: 'value',
      dataIndex: 'value',
    },
  ];
}

const TokenTable = defineComponent({
  props: {
    type: {
      type: String as PropType<TokenTableProps['type']>,
    },
    lang: {
      type: String as PropType<TokenTableProps['lang']>,
    },
  },
  setup(props, { attrs }) {
    const { type } = toRefs(props);
    const SiteToken = useSiteToken();
    const token = computed(() => SiteToken.value.token);

    const [, lang] = useLocale(locales);
    const columns = useColumns();

    const data = computed<TokenData[]>(() => {
      return Object.entries(tokenMeta)
        .filter(([, meta]: any) => meta.source === type.value)
        .map(([token, meta]: any) => ({
          name: token,
          desc: lang.value === 'cn' ? meta.desc : meta.descEn,
          type: meta.type,
          value: (defaultToken as any)[token],
        }));
    });

    return () => {
      return (
        <Table
          dataSource={data.value}
          columns={columns}
          pagination={false}
          bordered
          {...attrs}
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
                    {typeof record.value !== 'string' ? JSON.stringify(record.value) : record.value}
                  </span>
                );
              }
              return <span>{text} </span>;
            },
          }}
        ></Table>
      );
    };
  },
});
export default TokenTable;
