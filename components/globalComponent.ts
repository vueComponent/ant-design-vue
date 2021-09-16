import type {
  Affix,
  Anchor,
  AnchorLink,
  AutoComplete,
  AutoCompleteOptGroup,
  AutoCompleteOption,
  Alert,
  Avatar,
  AvatarGroup,
  BackTop,
  Badge,
  BadgeRibbon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
  Button,
  ButtonGroup,
  Calendar,
  Card,
  CardGrid,
  CardMeta,
  Collapse,
  CollapsePanel,
  Carousel,
  Cascader,
  Checkbox,
  CheckboxGroup,
  Col,
  Comment,
  ConfigProvider,
  DatePicker,
  RangePicker,
  MonthPicker,
  WeekPicker,
  Descriptions,
  DescriptionsItem,
  Divider,
  Dropdown,
  DropdownButton,
  Drawer,
  Empty,
  Form,
  FormItem,
  Grid,
  Input,
  InputGroup,
  InputPassword,
  InputSearch,
  Textarea,
  Image,
  ImagePreviewGroup,
  InputNumber,
  Layout,
  LayoutHeader,
  LayoutSider,
  LayoutFooter,
  LayoutContent,
  List,
  ListItem,
  ListItemMeta,
  message,
  Menu,
  MenuDivider,
  MenuItem,
  MenuItemGroup,
  SubMenu,
  Mentions,
  MentionsOption,
  Modal,
  Statistic,
  StatisticCountdown,
  notification,
  PageHeader,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  RadioButton,
  RadioGroup,
  Rate,
  Result,
  Row,
  Select,
  SelectOptGroup,
  SelectOption,
  Skeleton,
  SkeletonButton,
  SkeletonAvatar,
  SkeletonInput,
  SkeletonImage,
  Slider,
  Space,
  Spin,
  Steps,
  Step,
  Switch,
  Table,
  TableColumn,
  TableColumnGroup,
  Transfer,
  Tree,
  TreeNode,
  DirectoryTree,
  TreeSelect,
  TreeSelectNode,
  Tabs,
  TabPane,
  TabContent,
  Tag,
  CheckableTag,
  TimePicker,
  Timeline,
  TimelineItem,
  Tooltip,
  Typography,
  TypographyLink,
  TypographyParagraph,
  TypographyText,
  TypographyTitle,
  Upload,
  UploadDragger,
  LocaleProvider,
} from './components';

declare module 'vue' {
  export interface GlobalComponents {
    AAffix: typeof Affix;
    AAnchor: typeof Anchor;
    AAnchorLink: typeof AnchorLink;
    AAutoComplete: typeof AutoComplete;
    AAutoCompleteOptGroup: typeof AutoCompleteOptGroup;
    AAutoCompleteOption: typeof AutoCompleteOption;
    AAlert: typeof Alert;
    AAvatar: typeof Avatar;
    AAvatarGroup: typeof AvatarGroup;
    ABackTop: typeof BackTop;
    ABadge: typeof Badge;
    ABadgeRibbon: typeof BadgeRibbon;
    ABreadcrumb: typeof Breadcrumb;
    ABreadcrumbItem: typeof BreadcrumbItem;
    ABreadcrumbSeparator: typeof BreadcrumbSeparator;
    AButton: typeof Button;
    AButtonGroup: typeof ButtonGroup;
    ACalendar: typeof Calendar;
    ACard: typeof Card;
    ACardGrid: typeof CardGrid;
    ACardMeta: typeof CardMeta;
    ACollapse: typeof Collapse;
    ACollapsePanel: typeof CollapsePanel;
    ACarousel: typeof Carousel;
    ACascader: typeof Cascader;
    ACheckbox: typeof Checkbox;
    ACheckboxGroup: typeof CheckboxGroup;
    ACol: typeof Col;
    AComment: typeof Comment;
    AConfigProvider: typeof ConfigProvider;
    ADatePicker: typeof DatePicker;
    ARangePicker: typeof RangePicker;
    AMonthPicker: typeof MonthPicker;
    AWeekPicker: typeof WeekPicker;
    ADescriptions: typeof Descriptions;
    ADescriptionsItem: typeof DescriptionsItem;
    ADivider: typeof Divider;
    ADropdown: typeof Dropdown;
    ADropdownButton: typeof DropdownButton;
    ADrawer: typeof Drawer;
    AEmpty: typeof Empty;
    AForm: typeof Form;
    AFormItem: typeof FormItem;
    AGrid: typeof Grid;
    AInput: typeof Input;
    AInputGroup: typeof InputGroup;
    AInputPassword: typeof InputPassword;
    AInputSearch: typeof InputSearch;
    ATextarea: typeof Textarea;
    AImage: typeof Image;
    AImagePreviewGroup: typeof ImagePreviewGroup;
    AInputNumber: typeof InputNumber;
    ALayout: typeof Layout;
    ALayoutHeader: typeof LayoutHeader;
    ALayoutSider: typeof LayoutSider;
    ALayoutFooter: typeof LayoutFooter;
    ALayoutContent: typeof LayoutContent;
    AList: typeof List;
    AListItem: typeof ListItem;
    AListItemMeta: typeof ListItemMeta;
    Amessage: typeof message;
    AMenu: typeof Menu;
    AMenuDivider: typeof MenuDivider;
    AMenuItem: typeof MenuItem;
    AMenuItemGroup: typeof MenuItemGroup;
    ASubMenu: typeof SubMenu;
    AMentions: typeof Mentions;
    AMentionsOption: typeof MentionsOption;
    AModal: typeof Modal;
    AStatistic: typeof Statistic;
    AStatisticCountdown: typeof StatisticCountdown;
    Anotification: typeof notification;
    APageHeader: typeof PageHeader;
    APagination: typeof Pagination;
    APopconfirm: typeof Popconfirm;
    APopover: typeof Popover;
    AProgress: typeof Progress;
    ARadio: typeof Radio;
    ARadioButton: typeof RadioButton;
    ARadioGroup: typeof RadioGroup;
    ARate: typeof Rate;
    AResult: typeof Result;
    ARow: typeof Row;
    ASelect: typeof Select;
    ASelectOptGroup: typeof SelectOptGroup;
    ASelectOption: typeof SelectOption;
    ASkeleton: typeof Skeleton;
    ASkeletonButton: typeof SkeletonButton;
    ASkeletonAvatar: typeof SkeletonAvatar;
    ASkeletonInput: typeof SkeletonInput;
    ASkeletonImage: typeof SkeletonImage;
    ASlider: typeof Slider;
    ASpace: typeof Space;
    ASpin: typeof Spin;
    ASteps: typeof Steps;
    AStep: typeof Step;
    ASwitch: typeof Switch;
    ATable: typeof Table;
    ATableColumn: typeof TableColumn;
    ATableColumnGroup: typeof TableColumnGroup;
    ATransfer: typeof Transfer;
    ATree: typeof Tree;
    ATreeNode: typeof TreeNode;
    ADirectoryTree: typeof DirectoryTree;
    ATreeSelect: typeof TreeSelect;
    ATreeSelectNode: typeof TreeSelectNode;
    ATabs: typeof Tabs;
    ATabPane: typeof TabPane;
    ATabContent: typeof TabContent;
    ATag: typeof Tag;
    ACheckableTag: typeof CheckableTag;
    ATimePicker: typeof TimePicker;
    ATimeline: typeof Timeline;
    ATimelineItem: typeof TimelineItem;
    ATooltip: typeof Tooltip;
    ATypography: typeof Typography;
    ATypographyLink: typeof TypographyLink;
    ATypographyParagraph: typeof TypographyParagraph;
    ATypographyText: typeof TypographyText;
    ATypographyTitle: typeof TypographyTitle;
    AUpload: typeof Upload;
    AUploadDragger: typeof UploadDragger;
    ALocaleProvider: typeof LocaleProvider;
  }
}

export {};
