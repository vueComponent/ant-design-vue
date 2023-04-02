import type { MenuProps } from 'ant-design-vue';

import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons-vue';

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
  label: any,
  key: string,
  icon?: any,
  children?: MenuItem[],
  type?: 'group',
): MenuItem =>
  ({
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem);

const items: MenuProps['items'] = [
  getItem('Navigation One', 'sub1', <MailOutlined />, [
    getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
    getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
  ]),

  getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
  ]),

  getItem('Navigation Three', 'sub4', <SettingOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Option 11', '11'),
    getItem('Option 12', '12'),
  ]),
];

export default items;
