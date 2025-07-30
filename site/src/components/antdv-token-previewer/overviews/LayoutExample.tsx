import { defineComponent } from 'vue';
import {
  Layout,
  Menu,
  Card,
  Statistic,
  Row,
  Col,
  Button,
  Avatar,
  Badge,
  theme,
  Table,
  Tag,
  Divider,
  Select,
  Segmented,
  Input,
  DatePicker,
  Modal,
} from 'ant-design-vue';
import './LayoutExample.less';
import {
  PhUser,
  PhSquaresFour,
  PhStorefront,
  PhList,
  PhX,
  PhDownload,
  PhFunnel,
  PhEnvelope,
  PhGear,
  PhCurrencyDollar,
  PhPercent,
  PhTrendUp,
  PhTrendDown,
} from '@phosphor-icons/vue';
import { ref, onMounted, watch } from 'vue';
import { Area } from '@antv/g2plot';
import logo from '../../../assets/logo.svg';

const { Header, Sider, Content } = Layout;

/**
 * 响应式布局示例组件
 * 展示带有响应式侧边栏、导航菜单和内容区域的完整页面布局
 */
const LayoutExample = defineComponent({
  name: 'LayoutExample',
  setup() {
    const { token } = theme.useToken();
    const selectedKeys = ref<string[]>(['1']);
    const collapsed = ref<boolean>(true);
    const tableViewMode = ref<string>('all');
    const tableFilterStatus = ref<string>('all');
    const chartContainer = ref<HTMLDivElement>();
    const contentContainer = ref<HTMLDivElement>();
    let areaChart: Area | null = null;
    const dateRange = ref<[any, any] | null>(null);
    const exportModalVisible = ref<boolean>(false);

    // 根据选中的菜单项计算应该展开的父级菜单
    const getDefaultOpenKeys = () => {
      const currentKey = selectedKeys.value[0];
      if (['1', '2', '3', '4'].includes(currentKey)) {
        return ['sub1'];
      } else if (['5', '6', '7', '8'].includes(currentKey)) {
        return ['sub2', 'sub3'];
      } else if (['9', '10', '11', '12'].includes(currentKey)) {
        return ['sub4'];
      }
      return ['sub1', 'sub2'];
    };

    // 菜单展开状态
    const openKeys = ref<string[]>(getDefaultOpenKeys());

    // 处理菜单展开/折叠
    const handleOpenChange = (keys: string[]) => {
      openKeys.value = keys;
    };

    // 处理菜单选择
    const handleMenuSelect = (info: any) => {
      selectedKeys.value = [String(info.key)];
      // 选择菜单项时，确保其父级菜单展开
      const parentKeys = getDefaultOpenKeys();
      openKeys.value = [...new Set([...openKeys.value, ...parentKeys])];
    };

    /**
     * 切换侧边栏折叠状态
     */
    const toggleCollapsed = () => {
      collapsed.value = !collapsed.value;
    };

    /**
     * 显示导出数据模态框
     */
    const showExportModal = () => {
      exportModalVisible.value = true;
    };

    /**
     * 隐藏导出数据模态框
     */
    const hideExportModal = () => {
      exportModalVisible.value = false;
    };

    /**
     * 处理导出确认
     */
    const handleExportConfirm = () => {
      // 这里可以添加实际的导出逻辑
      hideExportModal();
    };

    /**
     * 初始化G2Plot堆叠面积图
     */
    const initChart = () => {
      if (!chartContainer.value) return;

      // 堆叠面积图数据
      const chartData = [
        { month: '1月', value: 3800, type: '访问量' },
        { month: '2月', value: 5200, type: '访问量' },
        { month: '3月', value: 4100, type: '访问量' },
        { month: '4月', value: 6800, type: '访问量' },
        { month: '5月', value: 5900, type: '访问量' },
        { month: '6月', value: 7200, type: '访问量' },
        { month: '1月', value: 2800, type: '用户数' },
        { month: '2月', value: 3900, type: '用户数' },
        { month: '3月', value: 3200, type: '用户数' },
        { month: '4月', value: 4800, type: '用户数' },
        { month: '5月', value: 4200, type: '用户数' },
        { month: '6月', value: 5100, type: '用户数' },
      ];

      areaChart = new Area(chartContainer.value, {
        data: chartData,
        xField: 'month',
        yField: 'value',
        seriesField: 'type',
        isStack: true,
        color: [token.value.colorPrimary, token.value.colorSuccess],
        smooth: true,
        areaStyle: {
          fillOpacity: 0.6,
        },
        line: {
          size: 2,
        },
        point: {
          size: 4,
          shape: 'circle',
          style: {
            fill: 'white',
            stroke: token.value.colorPrimary,
            lineWidth: 2,
          },
        },
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: false,
          },
        },
        yAxis: {
          label: {
            formatter: (v: string) => `${v}`,
          },
        },
        meta: {
          value: {
            alias: '数量',
          },
          month: {
            alias: '月份',
          },
        },
        legend: {
          position: 'top-left',
        },
        tooltip: {
          shared: true,
          showCrosshairs: true,
          crosshairs: {
            type: 'x',
          },
        },
      });

      areaChart.render();
    };

    onMounted(() => {
      initChart();
    });

    /**
     * 监听主题变化，重新渲染图表以应用新的主题色
     */
    watch(
      () => [token.value.colorPrimary, token.value.colorSuccess],
      () => {
        if (areaChart) {
          areaChart.destroy();
          areaChart = null;
        }
        setTimeout(() => {
          initChart();
        }, 100);
      },
      { deep: true },
    );

    const onCollapse = (collapsedState: boolean) => {
      collapsed.value = collapsedState;
    };

    const onBreakpoint = () => {
      // Handle breakpoint changes
    };

    /**
     * 表格列配置
     */
    const tableColumns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        sorter: (a: any, b: any) => a.age - b.age,
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        filters: [
          { text: '北京', value: '北京' },
          { text: '上海', value: '上海' },
          { text: '广州', value: '广州' },
          { text: '深圳', value: '深圳' },
          { text: '杭州', value: '杭州' },
        ],
        onFilter: (value: any, record: any) => record.address.includes(value),
        filterIcon: ({ filtered }: { filtered: boolean }) => (
          <PhFunnel weight="bold" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
      },
      {
        title: '标签',
        key: 'tags',
        dataIndex: 'tags',
      },
      {
        title: '操作',
        key: 'action',
      },
    ];

    /**
     * 表格数据
     */
    const tableData = [
      {
        key: '1',
        name: '张三',
        age: 32,
        address: '北京市朝阳区建国门外大街1号',
        tags: ['优秀', '开发者'],
      },
      {
        key: '2',
        name: '李四',
        age: 42,
        address: '上海市浦东新区陆家嘴环路1000号',
        tags: ['管理者'],
      },
      {
        key: '3',
        name: '王五',
        age: 32,
        address: '广州市天河区珠江新城花城大道5号',
        tags: ['设计师', '创意'],
      },
      {
        key: '4',
        name: '赵六',
        age: 28,
        address: '深圳市南山区科技园南区深南大道10000号',
        tags: ['前端', 'Vue'],
      },
      {
        key: '5',
        name: '钱七',
        age: 35,
        address: '杭州市西湖区文三路269号',
        tags: ['后端', 'Java'],
      },
    ];

    return () => (
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed.value}
            defaultCollapsed={true}
            breakpoint="lg"
            collapsedWidth={80}
            onCollapse={onCollapse}
            onBreakpoint={onBreakpoint}
            style={{
              minHeight: '100vh',
            }}
          >
            {/* Logo 区域 */}
            <div
              style={{
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed.value ? 'center' : 'flex-start',
                padding: collapsed.value ? '0' : '0 24px',
                background: token.value.colorBgContainer,
                // borderBottom: `1px solid ${token.value.colorBorder}`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={() => (collapsed.value = !collapsed.value)}
            >
              {collapsed.value ? (
                <img
                  src={logo}
                  alt="logo"
                  style={{
                    height: '32px',
                    width: 'auto',
                  }}
                />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '18px',
                    fontWeight: 'normal',
                    color: token.value.colorText,
                  }}
                >
                  <img
                    src={logo}
                    alt="logo"
                    style={{
                      height: '32px',
                      width: 'auto',
                      marginRight: '16px',
                    }}
                  />
                  Ant Design
                </div>
              )}
            </div>

            <Menu
              mode="inline"
              selectedKeys={selectedKeys.value}
              openKeys={openKeys.value}
              onOpenChange={handleOpenChange}
              onSelect={handleMenuSelect}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.SubMenu key="sub1" icon={<PhEnvelope weight="bold" />} title="Navigation One">
                <Menu.ItemGroup title="Item 1">
                  <Menu.Item key="1">Option 1</Menu.Item>
                  <Menu.Item key="2">Option 2</Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup title="Item 2">
                  <Menu.Item key="3">Option 3</Menu.Item>
                  <Menu.Item key="4">Option 4</Menu.Item>
                </Menu.ItemGroup>
              </Menu.SubMenu>
              <Menu.SubMenu
                key="sub2"
                icon={<PhSquaresFour weight="bold" />}
                title="Navigation Two"
              >
                <Menu.Item key="5">Option 5</Menu.Item>
                <Menu.Item key="6">Option 6</Menu.Item>
                <Menu.SubMenu key="sub3" title="Submenu">
                  <Menu.Item key="7">Option 7</Menu.Item>
                  <Menu.Item key="8">Option 8</Menu.Item>
                </Menu.SubMenu>
              </Menu.SubMenu>
              <Menu.SubMenu key="sub4" icon={<PhGear weight="bold" />} title="Navigation Three">
                <Menu.Item key="9">Option 9</Menu.Item>
                <Menu.Item key="10">Option 10</Menu.Item>
                <Menu.Item key="11">Option 11</Menu.Item>
                <Menu.Item key="12">Option 12</Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Sider>
          <Layout>
            <Header
              style={{
                background: token.value.colorBgContainer,
                padding: '0 24px',
                boxShadow: '0 1px 4px rgba(0,21,41,.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '54px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  type="text"
                  icon={collapsed.value ? <PhList weight="bold" /> : <PhX weight="bold" />}
                  onClick={toggleCollapsed}
                  style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Badge count={5} size="small">
                  <Avatar
                    size="small"
                    style={{
                      backgroundColor: '#1890ff',
                      cursor: 'pointer',
                    }}
                  >
                    U
                  </Avatar>
                </Badge>
              </div>
            </Header>
            <Content
              ref={contentContainer}
              style={{
                margin: `${token.value.margin}px ${token.value.marginSM}px`,
                minHeight: 'calc(100vh - 54px)',
              }}
            >
              <div style={{ width: '100%' }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic
                        title={
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <PhUser weight="bold" />
                            活跃用户
                          </div>
                        }
                        value={11280}
                        precision={0}
                        valueStyle={{
                          color: token.value.colorText,
                          fontSize: token.value.fontSizeHeading3,
                        }}
                        suffix="人"
                      />
                      <Tag
                        icon={<PhTrendUp weight="bold" />}
                        color="success"
                        style={{
                          marginTop: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          width: 'fit-content',
                        }}
                      >
                        12.5%
                      </Tag>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic
                        title={
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <PhCurrencyDollar weight="bold" />
                            总收入
                          </div>
                        }
                        value={9.3}
                        precision={2}
                        valueStyle={{
                          color: token.value.colorText,
                          fontSize: token.value.fontSizeHeading3,
                        }}
                        suffix="万元"
                      />
                      <Tag
                        icon={<PhTrendDown weight="bold" />}
                        color="error"
                        style={{
                          marginTop: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          width: 'fit-content',
                        }}
                      >
                        3.2%
                      </Tag>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic
                        title={
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <PhPercent weight="bold" />
                            转化率
                          </div>
                        }
                        value={93.17}
                        precision={2}
                        valueStyle={{
                          color: token.value.colorText,
                          fontSize: token.value.fontSizeHeading3,
                        }}
                        suffix="%"
                      />
                      <Tag
                        icon={<PhTrendUp weight="bold" />}
                        color="success"
                        style={{
                          marginTop: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          width: 'fit-content',
                        }}
                      >
                        8.7%
                      </Tag>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic
                        title={
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <PhStorefront weight="bold" />
                            订单量
                          </div>
                        }
                        value={2847}
                        precision={0}
                        valueStyle={{
                          color: token.value.colorText,
                          fontSize: token.value.fontSizeHeading3,
                        }}
                        suffix="单"
                      />
                      <Tag
                        icon={<PhTrendUp weight="bold" />}
                        color="success"
                        style={{
                          marginTop: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          width: 'fit-content',
                        }}
                      >
                        15.3%
                      </Tag>
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* G2Plot 图表组件 */}
              <Card
                style={{ marginTop: `${token.value.margin}px` }}
                title={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>数据概览</span>
                    <DatePicker.RangePicker
                      value={dateRange.value}
                      onChange={dates => {
                        dateRange.value = dates;
                      }}
                      placeholder={['开始日期', '结束日期']}
                      style={{ width: '240px' }}
                    />
                  </div>
                }
              >
                <div
                  ref={chartContainer}
                  style={{
                    height: '400px',
                    width: '100%',
                  }}
                />
              </Card>

              {/* 数据表格组件 */}
              <Card
                style={{ marginTop: `${token.value.margin}px` }}
                title={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>数据管理</span>
                    <Segmented
                      value={tableViewMode.value}
                      onChange={value => {
                        tableViewMode.value = value as string;
                      }}
                      style={{ fontWeight: 'normal' }}
                      options={[
                        { label: '全部', value: 'all' },
                        { label: '开发者', value: 'developer' },
                        { label: '管理者', value: 'manager' },
                        { label: '设计师', value: 'designer' },
                      ]}
                    />
                  </div>
                }
              >
                {/* 搜索和控制栏 */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: `${token.value.marginSM}px`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Input.Search
                      placeholder="搜索用户"
                      allowClear
                      style={{ width: '200px' }}
                      onSearch={() => {
                        // Handle search
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Select
                      value={tableFilterStatus.value}
                      onChange={_value => {
                        tableFilterStatus.value = _value as string;
                      }}
                      style={{ width: '120px' }}
                      options={[
                        { label: '全部状态', value: 'all' },
                        { label: '活跃', value: 'active' },
                        { label: '待审核', value: 'pending' },
                        { label: '已禁用', value: 'disabled' },
                      ]}
                    />
                    <Button
                      type="primary"
                      icon={<PhDownload weight="bold" />}
                      onClick={showExportModal}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      导出数据
                    </Button>
                  </div>
                </div>
                <Table columns={tableColumns} dataSource={tableData} pagination={{ pageSize: 5 }}>
                  {{
                    headerCell: ({ column }: { column: any }) => {
                      if (column.key === 'name') {
                        return <span>姓名</span>;
                      }
                    },
                    bodyCell: ({ column, record }: { column: any; record: any }) => {
                      if (column.key === 'name') {
                        return <a style={{ color: token.value.colorPrimary }}>{record.name}</a>;
                      } else if (column.key === 'tags') {
                        return (
                          <span>
                            {record.tags.map((tag: string) => (
                              <Tag
                                key={tag}
                                color={
                                  tag === '管理者'
                                    ? 'volcano'
                                    : tag.length > 3
                                      ? 'geekblue'
                                      : 'green'
                                }
                              >
                                {tag.toUpperCase()}
                              </Tag>
                            ))}
                          </span>
                        );
                      } else if (column.key === 'action') {
                        return (
                          <span>
                            <a style={{ color: token.value.colorPrimary }}>编辑</a>
                            <Divider type="vertical" />
                            <a style={{ color: token.value.colorError }}>删除</a>
                          </span>
                        );
                      }
                    },
                  }}
                </Table>
              </Card>
            </Content>
          </Layout>
        </Layout>

        {/* 导出数据模态框 */}
        <Modal
          title="导出数据"
          open={exportModalVisible.value}
          onOk={handleExportConfirm}
          onCancel={hideExportModal}
          okText="确认导出"
          cancelText="取消"
        >
          <p>确定要导出当前数据吗？</p>
          <p>导出的数据将包含当前筛选条件下的所有记录。</p>
        </Modal>
      </div>
    );
  },
});

export default LayoutExample;
