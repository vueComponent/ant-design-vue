/* @remove-on-es-build-begin */
// this file is not used if use https://github.com/ant-design/babel-plugin-import
const ENV = process.env.NODE_ENV;
if (
  ENV !== 'production' &&
  ENV !== 'test' &&
  typeof console !== 'undefined' &&
  console.warn &&
  typeof window !== 'undefined'
) {
  console.warn(
    'You are using a whole package of antd, ' +
      'please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.',
  );
}
/* @remove-on-es-build-end */
import { App } from 'vue';

import { default as Affix, default as AAffix } from './affix';

import { default as Anchor, default as AAnchor } from './anchor';

import { default as AutoComplete, default as AAutoComplete } from './auto-complete';

import { default as Alert, default as AAlert } from './alert';

import { default as Avatar, default as AAvatar } from './avatar';

import { default as BackTop, default as ABackTop } from './back-top';

import { default as Badge, default as ABadge } from './badge';

import { default as Breadcrumb, default as ABreadcrumb } from './breadcrumb';

import { default as Button, default as AButton } from './button';

import { default as Calendar, default as ACalendar } from './calendar';

import { default as Card, default as ACard } from './card';

import { default as Collapse, default as ACollapse } from './collapse';

import { default as Carousel, default as ACarousel } from './carousel';

import { default as Cascader, default as ACascader } from './cascader';

import { default as Checkbox, default as ACheckbox } from './checkbox';

import { default as Col, default as ACol } from './col';

import { default as DatePicker, default as ADatePicker } from './date-picker';

import { default as Divider, default as ADivider } from './divider';

import { default as Dropdown, default as ADropdown } from './dropdown';

import { default as Form, default as AForm } from './form';

import { default as Icon, default as AIcon } from './icon';

import { default as Input, default as AInput } from './input';

import { default as InputNumber, default as AInputNumber } from './input-number';

import { default as Layout, default as ALayout } from './layout';

import { default as List, default as AList } from './list';

import { default as LocaleProvider, default as ALocaleProvider } from './locale-provider';

import { default as message } from './message';

import { default as Menu, default as AMenu } from './menu';

import { default as Mentions, default as AMentions } from './mentions';

import { default as Modal, default as AModal } from './modal';

import { default as notification } from './notification';

import { default as Pagination, default as APagination } from './pagination';

import { default as Popconfirm, default as APopconfirm } from './popconfirm';

import { default as Popover, default as APopover } from './popover';

import { default as Progress, default as AProgress } from './progress';

import { default as Radio, default as ARadio } from './radio';

import { default as Rate, default as ARate } from './rate';

import { default as Row, default as ARow } from './row';

import { default as Select, default as ASelect } from './select';

import { default as Slider, default as ASlider } from './slider';

import { default as Spin, default as ASpin } from './spin';

import { default as Statistic, default as AStatistic } from './statistic';

import { default as Steps, default as ASteps } from './steps';

import { default as Switch, default as ASwitch } from './switch';

import { default as Table, default as ATable } from './table';

import { default as Transfer, default as ATransfer } from './transfer';

import { default as Tree, default as ATree } from './tree';

import { default as TreeSelect, default as ATreeSelect } from './tree-select';

import { default as Tabs, default as ATabs } from './tabs';

import { default as Tag, default as ATag } from './tag';

import { default as TimePicker, default as ATimePicker } from './time-picker';

import { default as Timeline, default as ATimeline } from './timeline';

import { default as Tooltip, default as ATooltip } from './tooltip';

// import { default as Mention, default as AMention } from './mention'

import { default as Upload, default as AUpload } from './upload';

import { default as version } from './version';

import { default as Drawer, default as ADrawer } from './drawer';

import { default as Skeleton, default as ASkeleton } from './skeleton';

import { default as Comment, default as AComment } from './comment';

// import { default as ColorPicker, default as AColorPicker } from './color-picker';

import { default as ConfigProvider, default as AConfigProvider } from './config-provider';

import { default as Empty, default as AEmpty } from './empty';

import { default as Result, default as AResult } from './result';

import { default as Descriptions, default as ADescriptions } from './descriptions';
import { default as PageHeader, default as APageHeader } from './page-header';
import { default as Space, default as ASpace } from './space';

const components = [
  Affix,
  Anchor,
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
  Carousel,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Layout,
  List,
  LocaleProvider,
  Menu,
  Mentions,
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
  Statistic,
  Steps,
  Switch,
  Table,
  Transfer,
  Tree,
  TreeSelect,
  Tabs,
  Tag,
  TimePicker,
  Timeline,
  Tooltip,
  Upload,
  Drawer,
  Skeleton,
  Comment,
  // ColorPicker,
  ConfigProvider,
  Empty,
  Result,
  Descriptions,
  PageHeader,
  Space,
];

const install = function(app: App) {
  components.forEach(component => {
    app.use(component);
  });

  app.config.globalProperties.$message = message;
  app.config.globalProperties.$notification = notification;
  app.config.globalProperties.$info = Modal.info;
  app.config.globalProperties.$success = Modal.success;
  app.config.globalProperties.$error = Modal.error;
  app.config.globalProperties.$warning = Modal.warning;
  app.config.globalProperties.$confirm = Modal.confirm;
  app.config.globalProperties.$destroyAll = Modal.destroyAll;
  return app;
};

/* istanbul ignore if */

export {
  version,
  install,
  message,
  notification,
  Affix,
  Anchor,
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
  Carousel,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Layout,
  List,
  LocaleProvider,
  Menu,
  Mentions,
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
  Statistic,
  Steps,
  Switch,
  Table,
  Transfer,
  Tree,
  TreeSelect,
  Tabs,
  Tag,
  TimePicker,
  Timeline,
  Tooltip,
  Upload,
  Drawer,
  Skeleton,
  Comment,
  // ColorPicker,
  ConfigProvider,
  Empty,
  Result,
  Descriptions,
  PageHeader,
  Space,
  AAffix,
  AAnchor,
  AAutoComplete,
  AAlert,
  AAvatar,
  ABackTop,
  ABadge,
  ABreadcrumb,
  AButton,
  ACalendar,
  ACard,
  ACollapse,
  ACarousel,
  ACascader,
  ACheckbox,
  ACol,
  ADatePicker,
  ADivider,
  ADropdown,
  AForm,
  AIcon,
  AInput,
  AInputNumber,
  ALayout,
  AList,
  ALocaleProvider,
  AMenu,
  AMentions,
  AModal,
  APagination,
  APopconfirm,
  APopover,
  AProgress,
  ARadio,
  ARate,
  ARow,
  ASelect,
  ASlider,
  ASpin,
  AStatistic,
  ASteps,
  ASwitch,
  ATable,
  ATransfer,
  ATree,
  ATreeSelect,
  ATabs,
  ATag,
  ATimePicker,
  ATimeline,
  ATooltip,
  AUpload,
  ADrawer,
  ASkeleton,
  AComment,
  // AColorPicker,
  AConfigProvider,
  AEmpty,
  AResult,
  ADescriptions,
  APageHeader,
  ASpace,
};

export default {
  version,
  install,
};
