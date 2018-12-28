import Vue, { Component } from 'vue';

import { AMessage } from './message';
import { AIcon } from './icon';
import { ASpin } from './spin';
import { AAffix } from './affix';
import { AAlert } from './alert';
import { AAnchor, ALink } from './anchor';
import { AAutoComplete } from './auto-complete';
import { AAvatar } from './avatar';
import { ABackTop } from './back-top';
import { ABadge } from './badge';
import { ABreadcrumb, ABreadcrumbItem } from './breadcrumb';
import { AButton, AButtonGroup } from './button';
import { ACalendar } from './calendar';
import { ACard, ACardMeta, ACardGrid } from './card';
import { ACarousel, ACarouselPanel } from './carousel';
import { ACascader } from './cascader';
import { ACheckbox } from './checkbox';
import { ACheckboxGroup } from './checkbox-group';
import { ACol } from './col';
import { ACollapse } from './collapse';
import { ADatePicker } from './date-picker';
import { AInputNumber } from './input-number';
import { AInput, AInputTextArea, AInputSearch, AInputGroup } from './input';
import { AList, AListGrid, AListItem, AListItemMeta } from './list';
import { ALocaleProvider } from './locale-provider';
import { AMenu, AMenuDivider } from './menu';
import { AMenuItem } from './menu-item';
import { ASubmenu } from './menu-submenu';
import { AMenuItemGroup } from './menu-ItemGroup';
import { AModal } from './modal';
import { AMonthPicker } from './month-picker';
import { ANotification } from './notification';
import { APagination } from './pagination';
import { APopconfirm } from './popconfirm';
import { APopover } from './popover';
import { AProgress } from './progress';
import { ARadio, ARadioGroup, ARadioButton } from './radio';
import { ARangePicker } from './range-picker';
import { ARate } from './rate';
import { ARow } from './row';
import { ASelect, ASelectOption, AOptGroup } from './select';
import { ASlider } from './slider';
import { ASteps } from './steps';
import { AStep } from './step';
import { ASwitch } from './switch';
import { ATable, AColumn, AColumnGroup } from './table';
import { ATabs, ATabPane } from './tabs';
import { ATag } from './tag';
import { ATimeline, ATimelineItem } from './timeline';
import { ATimePicker } from './time-picker';
import { ATooltip } from './tooltip';
import { ATransfer } from './transfer';
import { ATreeSelect, TreeNode } from './tree-select';
import { ATree } from './tree';
import { AUpload } from './upload';
import { AWeekPicker } from './week-picker';
import { ADropdown, ADropdownButton } from './dropdown';
import { AForm } from './form';
import { AFormItem } from './form-item';
import { ALayout, ASider } from './layout';
import { ASKeleton } from './skeleton';

export const message: AMessage;

export class Icon extends AIcon {}

export class Affix extends AAffix {}

export class Alert extends AAlert {}

export class Anchor extends AAnchor {}

export class AutoComplete extends AAutoComplete {}

export class Avatar extends AAvatar {}

export class BackTop extends ABackTop {}

export class Badge extends ABadge {}

export class Breadcrumb extends ABreadcrumb {
  static Item: ABreadcrumbItem & Component
}

export class Button extends AButton {
  static Group: AButtonGroup & Component
}

export class Calendar extends ACalendar {}

export class Card extends ACard {
  static Meta: ACardMeta & Component

  static Grid: ACardGrid & Component
}

export class Carousel extends ACarousel {
  static Panel: ACarouselPanel & Component
}

export class Cascader extends ACascader {}

export class Checkbox extends ACheckbox {
  static Group: ACheckboxGroup & Component
}

export class Col extends ACol {}

export class Collapse extends ACollapse {}

export class DatePicker extends ADatePicker {
  static MonthPicker: AMonthPicker & Component
  static RangePicker: ARangePicker & Component
  static WeekPicker: AWeekPicker & Component
}

export class Dropdown extends ADropdown {
  static Button: ADropdownButton & Component
}

export class Form extends AForm {
  static Item: AFormItem & Component
}

export class InputNumber extends AInputNumber {}

export class Input extends AInput {
  static TextArea: AInputTextArea & Component
  static Search: AInputSearch & Component
  static Group: AInputGroup & Component
}

export class List extends AList {
  static Item: AListItem & Component
}

export class ListGrid extends AListGrid {}

export class Link extends ALink {}

export class LocaleProvider extends ALocaleProvider {}

export class Menu extends AMenu {
  static Divider: AMenuDivider & Component
  static Item: AMenuItem & Component
  static SubMenu: ASubmenu & Component
  static ItemGroup: AMenuItemGroup & Component
}

export class Modal extends AModal {}

export class Notification extends ANotification {}

export class Pagination extends APagination {}

export class Popconfirm extends APopconfirm {}

export class Popover extends APopover {}

export class Progress extends AProgress {}

export class Radio extends ARadio {
  static Group: ARadioGroup & Component
  static Button: ARadioButton & Component
}

export class Rate extends ARate {}

export class Row extends ARow {}

export class Select extends ASelect {
  static Option: ASelectOption & Component
  static OptGroup: AOptGroup & Component
}

export class Slider extends ASlider {}

export class Spin extends ASpin {}

export class Steps extends ASteps {}

export class Step extends AStep {}

export class Switch extends ASwitch {}

export class Table extends ATable {
  static Column: AColumn & Component
  static ColumnGroup: AColumnGroup & Component
}

export class Column extends AColumn {}

export class Tabs extends ATabs {
  static TabPane: ATabPane & Component
}

export class Tag extends ATag {
  static CheckableTag: any & Component
}

export class TimePicker extends ATimePicker {}

export class Timeline extends ATimeline {
  static Item: ATimelineItem & Component
}

export class Tooltip extends ATooltip {}

export class Transfer extends ATransfer {}

export class TreeSelect extends ATreeSelect {
  static TreeNode: TreeNode & Component
}

export class Tree extends ATree {}

export class Upload extends AUpload {
  static Dragger: any & Component
}

export class Layout extends ALayout {
  Sider: ASider
}

export class SKeleton extends ASKeleton {}