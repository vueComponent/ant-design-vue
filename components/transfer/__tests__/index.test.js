import { mount } from '@vue/test-utils';
import { renderToString } from '@vue/server-test-utils';
import Transfer from '..';
import Vue from 'vue';
import { asyncExpect } from '@/tests/utils';

const listCommonProps = {
  dataSource: [
    {
      key: 'a',
      title: 'a',
    },
    {
      key: 'b',
      title: 'b',
    },
    {
      key: 'c',
      title: 'c',
      disabled: true,
    },
  ],
  selectedKeys: ['a'],
  targetKeys: ['b'],
  lazy: false,
};

const listDisabledProps = {
  dataSource: [
    {
      key: 'a',
      title: 'a',
      disabled: true,
    },
    {
      key: 'b',
      title: 'b',
    },
  ],
  selectedKeys: ['a', 'b'],
  targetKeys: [],
  lazy: false,
};

const searchTransferProps = {
  dataSource: [
    {
      key: '0',
      title: 'content1',
      description: 'description of content1',
      chosen: false,
    },
    {
      key: '1',
      title: 'content2',
      description: 'description of content2',
      chosen: false,
    },
    {
      key: '2',
      title: 'content3',
      description: 'description of content3',
      chosen: false,
    },
    {
      key: '3',
      title: 'content4',
      description: 'description of content4',
      chosen: false,
    },
    {
      key: '4',
      title: 'content5',
      description: 'description of content5',
      chosen: false,
    },
    {
      key: '5',
      title: 'content6',
      description: 'description of content6',
      chosen: false,
    },
  ],
  selectedKeys: [],
  targetKeys: ['3', '4'],
  lazy: false,
};

describe('Transfer', () => {
  it('should render correctly', () => {
    const props = {
      propsData: listCommonProps,
    };
    const wrapper = renderToString(Transfer, props);
    expect(wrapper).toMatchSnapshot();
  });

  it('should move selected keys to corresponding list', done => {
    const handleChange = jest.fn();
    const wrapper = mount(Transfer, {
      propsData: listCommonProps,
      listeners: {
        change: handleChange,
      },
      sync: false,
    });
    Vue.nextTick(() => {
      wrapper
        .findAll('.ant-btn')
        .at(0)
        .trigger('click'); // move selected keys to right list
      expect(handleChange).toHaveBeenCalledWith(['a', 'b'], 'right', ['a']);
      done();
    });
  });
  it('should move selected keys expect disabled to corresponding list', done => {
    const handleChange = jest.fn();
    const wrapper = mount(Transfer, {
      propsData: listDisabledProps,
      listeners: {
        change: handleChange,
      },
      sync: false,
    });
    Vue.nextTick(() => {
      wrapper
        .findAll('.ant-btn')
        .at(0)
        .trigger('click');
      expect(handleChange).toHaveBeenCalledWith(['b'], 'right', ['b']);
      done();
    });
  });

  it('should uncheck checkbox when click on checked item', done => {
    const handleSelectChange = jest.fn();
    const wrapper = mount(Transfer, {
      propsData: listCommonProps,
      listeners: {
        selectChange: handleSelectChange,
      },
      sync: false,
    });
    Vue.nextTick(() => {
      wrapper
        .findAll('.ant-transfer-list-content-item')
        .filter(n => {
          return n.vnode.data.key === 'a';
        })
        .trigger('click');
      expect(handleSelectChange).toHaveBeenLastCalledWith([], []);
      done();
    });
  });

  it('should check checkbox when click on unchecked item', done => {
    const handleSelectChange = jest.fn();
    const wrapper = mount(Transfer, {
      propsData: listCommonProps,
      listeners: {
        selectChange: handleSelectChange,
      },
      sync: false,
    });
    Vue.nextTick(() => {
      wrapper
        .findAll('.ant-transfer-list-content-item')
        .filter(n => {
          return n.vnode.data.key === 'b';
        })
        .trigger('click');
      expect(handleSelectChange).toHaveBeenLastCalledWith(['a'], ['b']);
      done();
    });
  });

  it('should not check checkbox when click on disabled item', done => {
    const handleSelectChange = jest.fn();
    const wrapper = mount(Transfer, {
      propsData: listCommonProps,
      listeners: {
        selectChange: handleSelectChange,
      },
      sync: false,
    });
    Vue.nextTick(() => {
      wrapper
        .findAll('.ant-transfer-list-content-item')
        .filter(n => {
          return n.vnode.data.key === 'c';
        })
        .trigger('click');
      expect(handleSelectChange).not.toHaveBeenCalled();
      done();
    });
  });

  it('should check all item when click on check all', done => {
    const handleSelectChange = jest.fn();
    const wrapper = mount(Transfer, {
      propsData: listCommonProps,
      listeners: {
        selectChange: handleSelectChange,
      },
      sync: false,
    });
    Vue.nextTick(() => {
      wrapper
        .findAll('.ant-transfer-list-header input[type="checkbox"]')
        .filter(n => {
          return !n.vnode.data.domProps.checked;
        })
        .trigger('change');
      expect(handleSelectChange).toHaveBeenCalledWith(['a'], ['b']);
      done();
    });
  });

  it('should uncheck all item when click on uncheck all', done => {
    const handleSelectChange = jest.fn();
    const wrapper = mount(Transfer, {
      propsData: listCommonProps,
      listeners: {
        selectChange: handleSelectChange,
      },
      sync: false,
    });
    Vue.nextTick(() => {
      wrapper
        .findAll('.ant-transfer-list-header input[type="checkbox"]')
        .filter(n => {
          return n.vnode.data.domProps.checked;
        })
        .trigger('change');
      expect(handleSelectChange).toHaveBeenCalledWith([], []);
      done();
    });
  });

  it('should call `filterOption` when use input in search box', done => {
    const filterOption = (inputValue, option) => inputValue === option.title;
    const wrapper = mount(Transfer, {
      propsData: {
        ...listCommonProps,
        showSearch: true,
        filterOption,
      },
      sync: false,
    });
    Vue.nextTick(() => {
      const input = wrapper.findAll('.ant-transfer-list-body-search-wrapper input').at(0);
      input.element.value = 'a';
      input.trigger('input');
      Vue.nextTick(() => {
        expect(
          wrapper
            .findAll('.ant-transfer-list-content')
            .at(0)
            .find('.ant-transfer-list-content-item')
            .findAll('input[type="checkbox"]'),
        ).toHaveLength(1);
        done();
      });
    });
  });

  it('should display the correct count of items when filter by input', done => {
    const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
    const renderFunc = item => item.title;
    const wrapper = mount(Transfer, {
      propsData: {
        ...searchTransferProps,
        showSearch: true,
        filterOption,
        render: renderFunc,
      },
      sync: false,
    });
    Vue.nextTick(() => {
      const input = wrapper.findAll('.ant-transfer-list-body-search-wrapper input').at(0);
      input.element.value = 'content2';
      input.trigger('input');
      Vue.nextTick(() => {
        expect(
          wrapper
            .findAll('.ant-transfer-list')
            .at(0)
            .findAll('.ant-transfer-list-header-selected > span')
            .at(0)
            .text()
            .trim(),
        ).toEqual('1 items');
        done();
      });
    });
  });

  it('should just check the filtered item when click on check all after search by input', done => {
    const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
    const renderFunc = item => item.title;
    const handleSelectChange = jest.fn();
    const wrapper = mount(Transfer, {
      propsData: {
        ...searchTransferProps,
        showSearch: true,
        filterOption,
        render: renderFunc,
      },
      listeners: {
        selectChange: handleSelectChange,
      },
      sync: false,
    });
    Vue.nextTick(() => {
      const input = wrapper.findAll('.ant-transfer-list-body-search-wrapper input').at(0);
      input.element.value = 'content2';
      input.trigger('input');
      Vue.nextTick(() => {
        wrapper
          .findAll('.ant-transfer-list')
          .at(0)
          .findAll('.ant-transfer-list-header input[type="checkbox"]')
          .filter(n => {
            return !n.vnode.data.domProps.checked;
          })
          .trigger('change');
        expect(handleSelectChange).toHaveBeenCalledWith(['1'], []);
        done();
      });
    });
  });

  it('should transfer just the filtered item after search by input', done => {
    const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
    const renderFunc = item => item.title;
    const handleChange = jest.fn();
    const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
      wrapper.setProps({
        selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys],
      });
    };
    const wrapper = mount(Transfer, {
      propsData: {
        ...searchTransferProps,
        showSearch: true,
        filterOption,
        render: renderFunc,
      },
      listeners: {
        selectChange: handleSelectChange,
        change: handleChange,
      },
      sync: false,
    });
    Vue.nextTick(() => {
      const input = wrapper.findAll('.ant-transfer-list-body-search-wrapper input').at(0);
      input.element.value = 'content2';
      input.trigger('input');
      Vue.nextTick(() => {
        wrapper
          .findAll('.ant-transfer-list')
          .at(0)
          .findAll('.ant-transfer-list-header input[type="checkbox"]')
          .filter(n => {
            return !n.vnode.data.domProps.checked;
          })
          .trigger('change');
        Vue.nextTick(() => {
          wrapper
            .findAll('.ant-btn')
            .at(0)
            .trigger('click');
          expect(handleChange).toHaveBeenCalledWith(['1', '3', '4'], 'right', ['1']);
          done();
        });
      });
    });
  });

  it('should check correctly when there is a search text', done => {
    const newProps = { ...listCommonProps };
    delete newProps.targetKeys;
    delete newProps.selectedKeys;
    const handleSelectChange = jest.fn();
    const wrapper = mount(Transfer, {
      propsData: {
        ...newProps,
        showSearch: true,
        render: item => item.title,
      },
      listeners: {
        selectChange: handleSelectChange,
      },
      sync: false,
    });
    Vue.nextTick(() => {
      wrapper
        .findAll('.ant-transfer-list-content-item')
        .filter(n => {
          return n.vnode.data.key === 'b';
        })
        .trigger('click');
      expect(handleSelectChange).toHaveBeenLastCalledWith(['b'], []);

      const input = wrapper.findAll('.ant-transfer-list-body-search-wrapper input').at(0);
      input.element.value = 'a';
      input.trigger('input');
      Vue.nextTick(() => {
        wrapper
          .findAll('.ant-transfer-list')
          .at(0)
          .findAll('.ant-transfer-list-header input[type="checkbox"]')
          .trigger('change');
        Vue.nextTick(() => {
          expect(handleSelectChange).toHaveBeenLastCalledWith(['b', 'a'], []);
          wrapper
            .findAll('.ant-transfer-list')
            .at(0)
            .findAll('.ant-transfer-list-header input[type="checkbox"]')
            .trigger('change');
          expect(handleSelectChange).toHaveBeenLastCalledWith(['b'], []);
          done();
        });
      });
    });
  });

  it('should show sorted targetkey', () => {
    const sortedTargetKeyProps = {
      dataSource: [
        {
          key: 'a',
          title: 'a',
        },
        {
          key: 'b',
          title: 'b',
        },
        {
          key: 'c',
          title: 'c',
        },
      ],
      targetKeys: ['c', 'b'],
      lazy: false,
    };

    const props = {
      propsData: {
        ...sortedTargetKeyProps,
        render: item => item.title,
      },
    };
    const wrapper = renderToString(Transfer, props);
    expect(wrapper).toMatchSnapshot();
  });
  it('should add custom styles when their props are provided', async () => {
    const style = {
      backgroundColor: 'red',
    };
    const listStyle = {
      backgroundColor: 'blue',
    };
    const operationStyle = {
      backgroundColor: 'yellow',
    };
    const transferProps = {
      props: {
        ...listCommonProps,
        listStyle,
        operationStyle,
      },
      style,
    };
    const component = mount(
      {
        render() {
          return <Transfer {...transferProps} />;
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      const wrapper = component.find('.ant-transfer');
      const list = component.findAll('.ant-transfer-list');
      const listSource = list.at(0);
      const listTarget = list.at(list.length - 1);
      const operation = component.findAll('.ant-transfer-operation').at(0);
      expect(wrapper.element.style).toHaveProperty('backgroundColor', 'red');
      expect(listSource.element.style).toHaveProperty('backgroundColor', 'blue');
      expect(listTarget.element.style).toHaveProperty('backgroundColor', 'blue');
      expect(operation.element.style).toHaveProperty('backgroundColor', 'yellow');
    });
  });
});
