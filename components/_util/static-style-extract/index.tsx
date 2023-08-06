import { createCache, extractStyle as extStyle, StyleProvider } from '../cssinjs';
import * as antd from '../../components';
import { renderToString } from 'vue/server-renderer';
import type { CustomRender } from './interface';
const blackList: string[] = [
  'ConfigProvider',
  'Grid',
  'Tour',
  'SelectOptGroup',
  'SelectOption',
  'MentionsOption',
  'TreeNode',
  'TreeSelectNode',
  'LocaleProvider',
];

const pickerMap = {
  MonthPicker: 'month',
  WeekPicker: 'week',
  QuarterPicker: 'quarter',
};

const compChildNameMap = {
  MenuDivider: 'Menu',
  MenuItem: 'Menu',
  MenuItemGroup: 'Menu',
  SubMenu: 'Menu',
  TableColumn: 'Table',
  TableColumnGroup: 'Table',
  TableSummary: 'Table',
  TableSummaryRow: 'Table',
  TableSummaryCell: 'Table',
  TabPane: 'Tabs',
  TimelineItem: 'Timeline',
};

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
        if (compName === 'Anchor') {
          return <Comp key={compName} items={[]} />;
        }
        if (compName in pickerMap) {
          const Comp = antd['DatePicker'];
          const type = pickerMap[compName];
          return <Comp key={compName} picker={type} />;
        }
        if (compName in compChildNameMap) {
          const ParentComp = antd[compChildNameMap[compName]];
          return (
            <ParentComp>
              <Comp />
            </ParentComp>
          );
        }
        if (compName === 'QRCode' || compName === 'Segmented') {
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
