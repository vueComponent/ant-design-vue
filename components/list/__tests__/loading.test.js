import { mount } from '@vue/test-utils';
import List from '..';
import { LoadingOutlined } from '@ant-design/icons-vue';

describe('List', () => {
  it('renders empty loading', () => {
    const loading = {
      spinning: true,
    };
    const wrapper = mount({
      render() {
        return <List loading={loading} dataSource={[]} renderItem={() => <List.Item />} />;
      },
    });
    expect(wrapper.findAll('.ant-list-empty-text')).toHaveLength(0);
  });

  it('renders object loading', () => {
    const loading = {
      spinning: true,
    };
    const wrapper = mount({
      render() {
        return <List loading={loading} dataSource={[1]} renderItem={() => <List.Item />} />;
      },
    });
    expect(wrapper.findAll('.ant-spin-spinning')).toHaveLength(1);
  });

  it('renders object loading with indicator', () => {
    const wrapper = mount({
      render() {
        return (
          <List
            loading={{
              spinning: true,
              indicator: <LoadingOutlined style={{ fontSize: '24px' }} />,
            }}
            dataSource={[1]}
            renderItem={() => <List.Item />}
          />
        );
      },
    });
    expect(wrapper.findAll('.anticon-loading')).toHaveLength(1);
  });
});
