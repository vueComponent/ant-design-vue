// Project: https://github.com/vueComponent/ant-design-vue
// Definitions by: akki-jat <https://github.com/akki-jat>
// Definitions: https://github.com/vueComponent/ant-design-vue/types

import Vue from 'vue';

import { Affix } from './affix';
import { Anchor } from './anchor/anchor';
import { AutoComplete } from './auto-complete';
import { Alert } from './alert';
import { Avatar } from './avatar';
import { BackTop } from './back-top';
import { Badge } from './badge';
import { Breadcrumb } from './breadcrumb/breadcrumb';
import { Button } from './button/button';
import { Calendar } from './calendar';
import { Card } from './card';
import { Collapse } from './collapse/collapse';
import { Comment } from './comment';
import { Carousel } from './carousel';
import { Cascader } from './cascader';
import { Checkbox } from './checkbox/checkbox';
import { Col } from './grid/col';
import { ConfigProvider } from './config-provider';
import { DatePicker } from './date-picker/date-picker';
import { Divider } from './divider';
import { Drawer } from './drawer';
import { Dropdown } from './dropdown/dropdown';
import { Empty } from './empty';
import { Form } from './form/form';
import { Icon } from './icon';
import { Input } from './input/input';
import { InputNumber } from './input-number';
import { Layout } from './layout/layout';
import { List } from './list/list';
import { LocaleProvider } from './locale-provider';
import { Message } from './message';
import { Mentions } from './mentions/mentions';
import { Menu } from './menu/menu';
import { Modal } from './modal';
import { Notification } from './notification';
import { Pagination } from './pagination';
import { Popconfirm } from './popconfirm';
import { Popover } from './popover';
import { Progress } from './progress';
import { Radio } from './radio/radio';
import { Rate } from './rate';
import { Row } from './grid/row';
import { Select } from './select/select';
import { Skeleton } from './skeleton';
import { Slider } from './slider';
import { Spin } from './spin';
import { Statistic } from './statistic/statistic';
import { Steps } from './steps/steps';
import { Switch } from './switch';
import { Table } from './table/table';
import { Transfer } from './transfer';
import { Tree } from './tree/tree';
import { TreeSelect } from './tree-select';
import { Tabs } from './tabs/tabs';
import { Tag } from './tag/tag';
import { TimePicker } from './time-picker';
import { Timeline } from './timeline/timeline';
import { Tooltip } from './tootip/tooltip';
import { Upload } from './upload';
import { Result } from './result';
import { Descriptions } from './descriptions/descriptions';
import { PageHeader } from './page-header';

/**
 * Install all ant-design-vue components into Vue.
 * Please do not invoke this method directly.
 * Call `Vue.use(Antd)` to install.
 */
export function install(vue: typeof Vue): void;

declare const message: Message;
declare const notification: Notification;

export {
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
  Comment,
  Carousel,
  Cascader,
  Checkbox,
  Col,
  ConfigProvider,
  DatePicker,
  Divider,
  Dropdown,
  Empty,
  Form,
  Icon,
  Input,
  InputNumber,
  Layout,
  List,
  LocaleProvider,
  message,
  Menu,
  Mentions,
  Modal,
  notification,
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
  Result,
  Descriptions,
  PageHeader,
};
