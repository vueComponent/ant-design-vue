'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Upload = exports.Tooltip = exports.Timeline = exports.TimePicker = exports.Tag = exports.Tabs = exports.TreeSelect = exports.Tree = exports.Transfer = exports.Table = exports.Switch = exports.Steps = exports.Spin = exports.Slider = exports.Select = exports.Row = exports.Rate = exports.Radio = exports.Progress = exports.Popover = exports.Popconfirm = exports.Pagination = exports.Modal = exports.Menu = exports.LocaleProvider = exports.List = exports.Layout = exports.InputNumber = exports.Input = exports.Icon = exports.Form = exports.Dropdown = exports.Divider = exports.DatePicker = exports.Col = exports.Checkbox = exports.Cascader = exports.Carousel = exports.Collapse = exports.Card = exports.Calendar = exports.Button = exports.Breadcrumb = exports.Badge = exports.BackTop = exports.Avatar = exports.Alert = exports.AutoComplete = exports.Anchor = exports.Affix = exports.notification = exports.message = exports.install = exports.version = undefined;

var _affix = require('./affix');

var _affix2 = _interopRequireDefault(_affix);

var _anchor = require('./anchor');

var _anchor2 = _interopRequireDefault(_anchor);

var _autoComplete = require('./auto-complete');

var _autoComplete2 = _interopRequireDefault(_autoComplete);

var _alert = require('./alert');

var _alert2 = _interopRequireDefault(_alert);

var _avatar = require('./avatar');

var _avatar2 = _interopRequireDefault(_avatar);

var _backTop = require('./back-top');

var _backTop2 = _interopRequireDefault(_backTop);

var _badge = require('./badge');

var _badge2 = _interopRequireDefault(_badge);

var _breadcrumb = require('./breadcrumb');

var _breadcrumb2 = _interopRequireDefault(_breadcrumb);

var _button = require('./button');

var _button2 = _interopRequireDefault(_button);

var _calendar = require('./calendar');

var _calendar2 = _interopRequireDefault(_calendar);

var _card = require('./card');

var _card2 = _interopRequireDefault(_card);

var _collapse = require('./collapse');

var _collapse2 = _interopRequireDefault(_collapse);

var _carousel = require('./carousel');

var _carousel2 = _interopRequireDefault(_carousel);

var _cascader = require('./cascader');

var _cascader2 = _interopRequireDefault(_cascader);

var _checkbox = require('./checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _col = require('./col');

var _col2 = _interopRequireDefault(_col);

var _datePicker = require('./date-picker');

var _datePicker2 = _interopRequireDefault(_datePicker);

var _divider = require('./divider');

var _divider2 = _interopRequireDefault(_divider);

var _dropdown = require('./dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _form = require('./form');

var _form2 = _interopRequireDefault(_form);

var _icon = require('./icon');

var _icon2 = _interopRequireDefault(_icon);

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _inputNumber = require('./input-number');

var _inputNumber2 = _interopRequireDefault(_inputNumber);

var _layout = require('./layout');

var _layout2 = _interopRequireDefault(_layout);

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

var _localeProvider = require('./locale-provider');

var _localeProvider2 = _interopRequireDefault(_localeProvider);

var _message = require('./message');

var _message2 = _interopRequireDefault(_message);

var _menu = require('./menu');

var _menu2 = _interopRequireDefault(_menu);

var _modal = require('./modal');

var _modal2 = _interopRequireDefault(_modal);

var _notification = require('./notification');

var _notification2 = _interopRequireDefault(_notification);

var _pagination = require('./pagination');

var _pagination2 = _interopRequireDefault(_pagination);

var _popconfirm = require('./popconfirm');

var _popconfirm2 = _interopRequireDefault(_popconfirm);

var _popover = require('./popover');

var _popover2 = _interopRequireDefault(_popover);

var _progress = require('./progress');

var _progress2 = _interopRequireDefault(_progress);

var _radio = require('./radio');

var _radio2 = _interopRequireDefault(_radio);

var _rate = require('./rate');

var _rate2 = _interopRequireDefault(_rate);

var _row = require('./row');

var _row2 = _interopRequireDefault(_row);

var _select = require('./select');

var _select2 = _interopRequireDefault(_select);

var _slider = require('./slider');

var _slider2 = _interopRequireDefault(_slider);

var _spin = require('./spin');

var _spin2 = _interopRequireDefault(_spin);

var _steps = require('./steps');

var _steps2 = _interopRequireDefault(_steps);

var _switch = require('./switch');

var _switch2 = _interopRequireDefault(_switch);

var _table = require('./table');

var _table2 = _interopRequireDefault(_table);

var _transfer = require('./transfer');

var _transfer2 = _interopRequireDefault(_transfer);

var _tree = require('./tree');

var _tree2 = _interopRequireDefault(_tree);

var _treeSelect = require('./tree-select');

var _treeSelect2 = _interopRequireDefault(_treeSelect);

var _tabs = require('./tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _tag = require('./tag');

var _tag2 = _interopRequireDefault(_tag);

var _timePicker = require('./time-picker');

var _timePicker2 = _interopRequireDefault(_timePicker);

var _timeline = require('./timeline');

var _timeline2 = _interopRequireDefault(_timeline);

var _tooltip = require('./tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _upload = require('./upload');

var _upload2 = _interopRequireDefault(_upload);

var _version = require('./version');

var _version2 = _interopRequireDefault(_version);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* @remove-on-es-build-begin */
// this file is not used if use https://github.com/ant-design/babel-plugin-import
var ENV = process.env.NODE_ENV;
if (ENV !== 'production' && ENV !== 'test' && typeof console !== 'undefined' && console.warn && typeof window !== 'undefined') {
  console.warn('You are using a whole package of antd, ' + 'please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.');
}
/* @remove-on-es-build-end */

// import { default as Mention } from './mention'

var components = [_affix2['default'], _anchor2['default'], _anchor2['default'].Link, _autoComplete2['default'], _alert2['default'], _avatar2['default'], _backTop2['default'], _badge2['default'], _breadcrumb2['default'], _breadcrumb2['default'].Item, _button2['default'], _button2['default'].Group, _calendar2['default'], _card2['default'], _card2['default'].Meta, _card2['default'].Grid, _collapse2['default'], _collapse2['default'].Panel, _carousel2['default'], _cascader2['default'], _checkbox2['default'], _checkbox2['default'].Group, _col2['default'], _datePicker2['default'], _datePicker2['default'].MonthPicker, _datePicker2['default'].RangePicker, _datePicker2['default'].WeekPicker, _divider2['default'], _dropdown2['default'], _dropdown2['default'].Button, _form2['default'], _form2['default'].Item, _icon2['default'], _input2['default'], _input2['default'].Group, _input2['default'].Search, _input2['default'].TextArea, _inputNumber2['default'], _layout2['default'], _layout2['default'].Header, _layout2['default'].Footer, _layout2['default'].Sider, _layout2['default'].Content, _list2['default'], _list2['default'].Item, _list2['default'].Item.Meta, _localeProvider2['default'], _menu2['default'], _menu2['default'].Item, _menu2['default'].SubMenu, _menu2['default'].Divider, _menu2['default'].ItemGroup, _modal2['default'], _pagination2['default'], _popconfirm2['default'], _popover2['default'], _progress2['default'], _radio2['default'], _radio2['default'].Group, _radio2['default'].Button, _rate2['default'], _row2['default'], _select2['default'], _select2['default'].Option, _select2['default'].OptGroup, _slider2['default'], _spin2['default'], _steps2['default'], _steps2['default'].Step, _switch2['default'], _table2['default'], _table2['default'].Column, _table2['default'].ColumnGroup, _transfer2['default'], _tree2['default'], _tree2['default'].TreeNode, _treeSelect2['default'], _treeSelect2['default'].TreeNode, _tabs2['default'], _tabs2['default'].TabPane, _tag2['default'], _tag2['default'].CheckableTag, _timePicker2['default'], _timeline2['default'], _timeline2['default'].Item, _tooltip2['default'], _upload2['default'], _upload2['default'].Dragger];

var install = function install(Vue) {
  components.map(function (component) {
    Vue.component(component.name, component);
  });

  Vue.prototype.$message = _message2['default'];
  Vue.prototype.$notification = _notification2['default'];
  Vue.prototype.$info = _modal2['default'].info;
  Vue.prototype.$success = _modal2['default'].success;
  Vue.prototype.$error = _modal2['default'].error;
  Vue.prototype.$warning = _modal2['default'].warning;
  Vue.prototype.$confirm = _modal2['default'].confirm;
};

exports.version = _version2['default'];
exports.install = install;
exports.message = _message2['default'];
exports.notification = _notification2['default'];
exports.Affix = _affix2['default'];
exports.Anchor = _anchor2['default'];
exports.AutoComplete = _autoComplete2['default'];
exports.Alert = _alert2['default'];
exports.Avatar = _avatar2['default'];
exports.BackTop = _backTop2['default'];
exports.Badge = _badge2['default'];
exports.Breadcrumb = _breadcrumb2['default'];
exports.Button = _button2['default'];
exports.Calendar = _calendar2['default'];
exports.Card = _card2['default'];
exports.Collapse = _collapse2['default'];
exports.Carousel = _carousel2['default'];
exports.Cascader = _cascader2['default'];
exports.Checkbox = _checkbox2['default'];
exports.Col = _col2['default'];
exports.DatePicker = _datePicker2['default'];
exports.Divider = _divider2['default'];
exports.Dropdown = _dropdown2['default'];
exports.Form = _form2['default'];
exports.Icon = _icon2['default'];
exports.Input = _input2['default'];
exports.InputNumber = _inputNumber2['default'];
exports.Layout = _layout2['default'];
exports.List = _list2['default'];
exports.LocaleProvider = _localeProvider2['default'];
exports.Menu = _menu2['default'];
exports.Modal = _modal2['default'];
exports.Pagination = _pagination2['default'];
exports.Popconfirm = _popconfirm2['default'];
exports.Popover = _popover2['default'];
exports.Progress = _progress2['default'];
exports.Radio = _radio2['default'];
exports.Rate = _rate2['default'];
exports.Row = _row2['default'];
exports.Select = _select2['default'];
exports.Slider = _slider2['default'];
exports.Spin = _spin2['default'];
exports.Steps = _steps2['default'];
exports.Switch = _switch2['default'];
exports.Table = _table2['default'];
exports.Transfer = _transfer2['default'];
exports.Tree = _tree2['default'];
exports.TreeSelect = _treeSelect2['default'];
exports.Tabs = _tabs2['default'];
exports.Tag = _tag2['default'];
exports.TimePicker = _timePicker2['default'];
exports.Timeline = _timeline2['default'];
exports.Tooltip = _tooltip2['default'];
exports.Upload = _upload2['default'];
exports['default'] = {
  version: _version2['default'],
  install: install
};