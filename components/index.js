/* @remove-on-es-build-begin */
// this file is not used if use https://github.com/ant-design/babel-plugin-import
const ENV = process.env.NODE_ENV
if (ENV !== 'production' &&
    typeof console !== 'undefined' &&
    console.warn &&
    typeof window !== 'undefined') {
  console.warn(
    'You are using a whole package of antd, ' +
    'please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.',
  )
}
/* @remove-on-es-build-end */

import { default as Affix } from './affix'

// import { default as Anchor } from './anchor'

import { default as AutoComplete } from './auto-complete'

import { default as Alert } from './alert'

import { default as Avatar } from './avatar'

import { default as BackTop } from './back-top'

import { default as Badge } from './badge'

import { default as Breadcrumb } from './breadcrumb'

import { default as Button } from './button'

import { default as Calendar } from './calendar'

import { default as Card } from './card'

import { default as Collapse } from './collapse'

// import { default as Carousel } from './carousel'

import { default as Cascader } from './cascader'

import { default as Checkbox } from './checkbox'

import { default as Col } from './col'

import { default as DatePicker } from './date-picker'

import { default as Divider } from './divider'

import { default as Dropdown } from './dropdown'

// import { default as Form } from './form'

import { default as Icon } from './icon'

import { default as Input } from './input'

import { default as InputNumber } from './input-number'

// import { default as Layout } from './layout'

// import { default as List } from './list'

import { default as LocaleProvider } from './locale-provider'

import { default as message } from './message'

import { default as Menu } from './menu'

import { default as Modal } from './modal'

import { default as notification } from './notification'

import { default as Pagination } from './pagination'

import { default as Popconfirm } from './popconfirm'

import { default as Popover } from './popover'

import { default as Progress } from './progress'

import { default as Radio } from './radio'

import { default as Rate } from './rate'

import { default as Row } from './row'

import { default as Select } from './select'

import { default as Slider } from './slider'

import { default as Spin } from './spin'

import { default as Steps } from './steps'

import { default as Switch } from './switch'

import { default as Table } from './table'

import { default as Transfer } from './transfer'

import { default as Tree } from './tree'

// import { default as TreeSelect } from './tree-select'

import { default as Tabs } from './tabs'

import { default as Tag } from './tag'

import { default as TimePicker } from './time-picker'

import { default as Timeline } from './timeline'

import { default as Tooltip } from './tooltip'

// import { default as Mention } from './mention'

import { default as Upload } from './upload'

import { default as version } from './version'

const components = {
  Affix,
  AutoComplete,
  Alert,
  Avatar,
  BackTop,
  Badge,
  Breadcrumb,
  BreadcrumbItem: Breadcrumb.Item,
  Button,
  ButtonGroup: Button.Group,
  Calendar,
  Card,
  CardMeta: Card.Meta,
  CardGrid: Card.Grid,
  Collapse,
  CollapsePanel: Collapse.Panel,
  Cascader,
  Checkbox,
  CheckboxGroup: Checkbox.Group,
  Col,
  DatePicker,
  MonthPicker: DatePicker.MonthPicker,
  RangePicker: DatePicker.RangePicker,
  WeekPicker: DatePicker.WeekPicker,
  Divider,
  Dropdown,
  DropdownButton: Dropdown.Button,
  Icon,
  Input,
  InputGroup: Input.Group,
  InputSearch: Input.Search,
  InputTextArea: Input.TextArea,
  InputNumber,
  LocaleProvider,
  Menu,
  MenuItem: Menu.Item,
  SubMenu: Menu.SubMenu,
  MenuDivider: Menu.Divider,
  ItemGroup: Menu.ItemGroup,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  RadioGroup: Radio.Group,
  RadioButton: Radio.Button,
  Rate,
  Row,
  Select,
  SelectOption: Select.Option,
  SelectOptGroup: Select.OptGroup,
  Slider,
  Spin,
  Steps,
  Step: Steps.Step,
  Switch,
  Table,
  Column: Table.Column,
  ColumnGroup: Table.ColumnGroup,
  Transfer,
  Tree,
  TreeNode: Tree.TreeNode,
  Tabs,
  TabPane: Tabs.TabPane,
  Tag,
  CheckableTag: Tag.CheckableTag,
  TimePicker,
  Timeline,
  TimelineItem: Timeline.Item,
  Tooltip,
  Upload,
  UploadDragger: Upload.Dragger,
}

const install = function (Vue) {
  Object.keys(components).forEach(key => {
    Vue.component(components[key].name, components[key])
  })

  Vue.prototype.$message = message
  Vue.prototype.$notification = notification
  Vue.prototype.$info = Modal.info
  Vue.prototype.$success = Modal.success
  Vue.prototype.$error = Modal.error
  Vue.prototype.$warning = Modal.warning
  Vue.prototype.$confirm = Modal.confirm
}

export {
  version,
  install,
  message,
  notification,
  Affix,
  AutoComplete,
  Alert,
  Avatar,
  BackTop,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Collapse,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Icon,
  Input,
  InputNumber,
  LocaleProvider,
  Menu,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Spin,
  Steps,
  Switch,
  Table,
  Transfer,
  Tree,
  Tabs,
  Tag,
  TimePicker,
  Timeline,
  Tooltip,
  Upload,
}
