import { createCache, extractStyle as extStyle, StyleProvider } from '../cssinjs';
import * as antd from '../../components';
import { renderToString } from 'vue/server-renderer';
import type { CustomRender } from './interface';
const blackList: string[] = [
  'ConfigProvider',
  'Drawer',
  'Grid',
  'Modal',
  'Popconfirm',
  'Popover',
  'Tooltip',
  'Tour',
  'SelectOptGroup',
  'SelectOption',
  'MenuDivider',
  'MenuItem',
  'MenuItemGroup',
  'SubMenu',
  'MentionsOption',
  'TableColumn',
  'TableColumnGroup',
  'TableSummary',
  'TableSummaryRow',
  'TableSummaryCell',
  'TreeNode',
  'TreeSelectNode',
  'TabPane',
  'CheckableTag',
  'TimelineItem',
  'LocaleProvider',
];

const defaultNode = () => (
  <>
    {Object.keys(antd)
      .filter(name => !blackList.includes(name) && name[0] === name[0].toUpperCase())
      .map(compName => {
        const Comp = antd[compName];
        if (compName === 'Dropdown') {
          return (
            <Comp key={compName} menu={{ items: [] }}>
              <div />
            </Comp>
          );
        }
        if (compName === 'QRCode') {
          return (
            <Comp key={compName} value={''}>
              <div />
            </Comp>
          );
        }
        return <Comp key={compName} />;
      })}
  </>
);

export function extractStyle(customTheme?: CustomRender): string {
  const cache = createCache();
  renderToString(
    <StyleProvider cache={cache}>
      {customTheme ? customTheme(defaultNode()) : defaultNode()}
    </StyleProvider>,
  );

  // Grab style from cache
  const styleText = extStyle(cache, true);

  return styleText;
}
