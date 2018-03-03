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

export { default as Grid } from './grid'

export { default as Rate } from './rate'

export { default as Tooltip } from './tooltip'

export { default as Pagination } from './pagination'

export { default as Row } from './grid/Row'

export { default as Col } from './grid/Col'

export { default as Tag } from './tag'

export { default as Avatar } from './avatar'

export { default as Badge } from './badge'

export { default as Tabs } from './tabs'

import Input from './input'

const InputGroup = Input.Group
const InputSearch = Input.Search
const InputTextArea = Input.TextArea
const Textarea = InputTextArea

export { Input, InputGroup, InputSearch, InputTextArea, Textarea }

export { default as Breadcrumb } from './breadcrumb'

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

const api = {
  notification,
  message,
}
export { api }

import Select from './select'
const SelectOption = Select.Option
const SelectOptGroup = Select.OptGroup
export { Select, SelectOption, SelectOptGroup }

export { default as Switch } from './switch'

export { default as LocaleProvider } from './locale-provider'

export { default as AutoComplete } from './auto-complete'

export { default as Affix } from './affix'

export { default as Cascader } from './cascader'

