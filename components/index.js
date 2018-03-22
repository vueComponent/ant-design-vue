/* @remove-on-es-build-begin */
// this file is not used if use https://github.com/ant-design/babel-plugin-import
const ENV = process.env.NODE_ENV
if (ENV !== 'production' &&
    ENV !== 'test' &&
    typeof console !== 'undefined' &&
    console.warn &&
    typeof window !== 'undefined') {
  console.warn(
    'You are using a whole package of antd, ' +
    'please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.',
  )
}
/* @remove-on-es-build-end */

import Button from './button'
const ButtonGroup = Button.Group
export { Button, ButtonGroup }

import Checkbox from './checkbox'
const CheckboxGroup = Checkbox.Group
export { Checkbox, CheckboxGroup }

export { default as Icon } from './icon'

import Radio from './radio'
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
export { Radio, RadioGroup, RadioButton }

import { Row, Col } from './grid'
export {
  Row,
  Col,
}

export { default as Rate } from './rate'

export { default as Tooltip } from './tooltip'

export { default as Pagination } from './pagination'

import Tag from './tag'
const CheckableTag = Tag.CheckableTag

export {
  Tag,
  CheckableTag,
}

export { default as Avatar } from './avatar'

export { default as Badge } from './badge'

import Tabs from './tabs'
const TabPane = Tabs.TabPane
export {
  Tabs,
  TabPane,
}

import Input from './input'

const InputGroup = Input.Group
const InputSearch = Input.Search
const InputTextArea = Input.TextArea
const Textarea = InputTextArea
const TextArea = InputTextArea

export { Input, InputGroup, InputSearch, InputTextArea, Textarea, TextArea }

import Breadcrumb from './breadcrumb'
const BreadcrumbItem = Breadcrumb.Item
export { Breadcrumb, BreadcrumbItem }

export { default as Popover } from './popover'

export { default as Popconfirm } from './popconfirm'

import Menu from './menu'
const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu
const MenuDivider = Menu.Divider
const MenuItemGroup = Menu.ItemGroup
export { Menu, MenuItem, SubMenu, MenuDivider, MenuItemGroup }

export { default as Card } from './card'

import Dropdown from './dropdown'
const DropdownButton = Dropdown.Button
export { Dropdown, DropdownButton }

export { default as Divider } from './divider'

import Collapse from './collapse'
const CollapsePanel = Collapse.Panel
export { Collapse, CollapsePanel }

import notification from './notification'
import message from './message'

export { default as Spin } from './spin'

import Select from './select'
const SelectOption = Select.Option
const SelectOptGroup = Select.OptGroup
export { Select, SelectOption, SelectOptGroup }

export { default as Switch } from './switch'

export { default as LocaleProvider } from './locale-provider'

export { default as AutoComplete } from './auto-complete'

export { default as Affix } from './affix'

export { default as Cascader } from './cascader'
export { default as BackTop } from './back-top'
export { default as Modal } from './modal'
export { default as Alert } from './alert'
export { default as TimePicker } from './time-picker'

export { notification, message }

import Steps from './steps'
const { Step } = Steps
export { Steps, Step }

export { default as Calendar } from './calendar'

import DatePicker from './date-picker'
const { MonthPicker, RangePicker, WeekPicker } = DatePicker
export { DatePicker, MonthPicker, RangePicker, WeekPicker }

export { default as version } from './version'
