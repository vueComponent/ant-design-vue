import { mount } from '@vue/test-utils';
import Transfer from '..';
import * as Vue from 'vue';
import { sleep, asyncExpect } from '../../../tests/utils';
import mountTest from '../../../tests/shared/mountTest';

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
  mountTest(Transfer);
  it('should render correctly', () => {
    const wrapper = mount({
      setup() {
        return () => <Transfer {...{ ...listCommonProps }} />;
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should move selected keys to corresponding list', done => {
    const handleChange = jest.fn();

    const wrapper = mount(
      {
        setup() {
          return () => <Transfer {...{ ...listCommonProps, onChange: handleChange }} />;
        },
      },
      {
        sync: false,
      },
    );
    Vue.nextTick(() => {
      wrapper.findAll('.ant-btn')[0].trigger('click'); // move selected keys to right list
      expect(handleChange).toHaveBeenCalledWith(['a', 'b'], 'right', ['a']);
      done();
    });
  });
  it('should move selected keys expect disabled to corresponding list', done => {
    const handleChange = jest.fn();
    const wrapper = mount(
      {
        setup() {
          return () => <Transfer {...{ ...listDisabledProps, onChange: handleChange }} />;
        },
      },
      {
        sync: false,
      },
    );
    Vue.nextTick(() => {
      wrapper.findAll('.ant-btn')[0].trigger('click');
      expect(handleChange).toHaveBeenCalledWith(['b'], 'right', ['b']);
      done();
    });
  });

  it('should uncheck checkbox when click on checked item', async () => {
    const handleSelectChange = jest.fn();

    const wrapper = mount(
      {
        setup() {
          return () => <Transfer {...{ ...listCommonProps, onSelectChange: handleSelectChange }} />;
        },
      },
      {
        sync: false,
      },
    );

    await sleep();
    wrapper.findAll('.ant-transfer-list-content-item')[0].trigger('click');
    expect(handleSelectChange).toHaveBeenLastCalledWith([], []);
  });

  it('should check checkbox when click on unchecked item', async () => {
    const handleSelectChange = jest.fn();

    const wrapper = mount(
      {
        setup() {
          return () => <Transfer {...{ ...listCommonProps, onSelectChange: handleSelectChange }} />;
        },
      },
      {
        sync: false,
      },
    );

    await sleep();
    wrapper.findAll('.ant-transfer-list-content-item')[2].trigger('click');
    await sleep();
    expect(handleSelectChange).toHaveBeenLastCalledWith(['a'], ['b']);
  });

  it('should not check checkbox when click on disabled item', async () => {
    const handleSelectChange = jest.fn();

    const wrapper = mount(
      {
        setup() {
          return () => <Transfer {...{ ...listCommonProps, onSelectChange: handleSelectChange }} />;
        },
      },
      {
        sync: false,
      },
    );

    await sleep();
    wrapper.findAll('.ant-transfer-list-content-item')[1].trigger('click');
    expect(handleSelectChange).not.toHaveBeenCalled();
  });

  xit('should check all item when click on check all', done => {
    const handleSelectChange = jest.fn();
    const wrapper = mount(Transfer, {
      props: listCommonProps,
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

  xit('should uncheck all item when click on uncheck all', done => {
    const handleSelectChange = jest.fn();
    const wrapper = mount(Transfer, {
      props: listCommonProps,
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

    const wrapper = mount(
      {
        setup() {
          return () => (
            <Transfer
              {...{
                ...listCommonProps,
                showSearch: true,
                filterOption,
              }}
            />
          );
        },
      },
      {
        sync: false,
      },
    );

    Vue.nextTick(() => {
      const input = wrapper.findAll('.ant-transfer-list-body-search-wrapper input')[0];
      input.element.value = 'a';
      input.trigger('input');
      Vue.nextTick(() => {
        expect(
          wrapper
            .findAll('.ant-transfer-list-content')[0]
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
    const wrapper = mount(
      {
        setup() {
          return () => (
            <Transfer
              {...{
                ...searchTransferProps,
                showSearch: true,
                filterOption,
                render: renderFunc,
              }}
            />
          );
        },
      },
      {
        sync: false,
      },
    );

    Vue.nextTick(() => {
      const input = wrapper.findAll('.ant-transfer-list-body-search-wrapper input')[0];
      input.element.value = 'content2';
      input.trigger('input');
      Vue.nextTick(() => {
        expect(
          wrapper
            .findAll('.ant-transfer-list')[0]
            .findAll('.ant-transfer-list-header-selected > span')[0]
            .text()
            .trim(),
        ).toEqual('1 item');
        done();
      });
    });
  });

  xit('should just check the filtered item when click on check all after search by input', done => {
    const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
    const renderFunc = item => item.title;
    const handleSelectChange = jest.fn();
    const wrapper = mount(Transfer, {
      props: {
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
      const input = wrapper.findAll('.ant-transfer-list-body-search-wrapper input')[0];
      input.element.value = 'content2';
      input.trigger('input');
      Vue.nextTick(() => {
        wrapper
          .findAll('.ant-transfer-list')[0]
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

  xit('should transfer just the filtered item after search by input', done => {
    const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
    const renderFunc = item => item.title;
    const handleChange = jest.fn();
    const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
      wrapper.setProps({
        selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys],
      });
    };
    const wrapper = mount(Transfer, {
      props: {
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
      const input = wrapper.findAll('.ant-transfer-list-body-search-wrapper input')[0];
      input.element.value = 'content2';
      input.trigger('input');
      Vue.nextTick(() => {
        wrapper
          .findAll('.ant-transfer-list')[0]
          .findAll('.ant-transfer-list-header input[type="checkbox"]')
          .filter(n => {
            return !n.element.checked;
          })
          .trigger('change');
        Vue.nextTick(() => {
          wrapper.findAll('.ant-btn')[0].trigger('click');
          expect(handleChange).toHaveBeenCalledWith(['1', '3', '4'], 'right', ['1']);
          done();
        });
      });
    });
  });

  xit('should check correctly when there is a search text', done => {
    const newProps = { ...listCommonProps };
    delete newProps.targetKeys;
    delete newProps.selectedKeys;
    const handleSelectChange = jest.fn();
    const wrapper = mount(Transfer, {
      props: {
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

      const input = wrapper.findAll('.ant-transfer-list-body-search-wrapper input')[0];
      input.element.value = 'a';
      input.trigger('input');
      Vue.nextTick(() => {
        wrapper
          .findAll('.ant-transfer-list')[0]
          .findAll('.ant-transfer-list-header input[type="checkbox"]')
          .trigger('change');
        Vue.nextTick(() => {
          expect(handleSelectChange).toHaveBeenLastCalledWith(['b', 'a'], []);
          wrapper
            .findAll('.ant-transfer-list')[0]
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
    const wrapper = mount({
      setup() {
        return () => <Transfer {...sortedTargetKeyProps} render={item => item.title} />;
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
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
      // const list = component.findAll('.ant-transfer-list');
      // const listSource = list[0];
      // const listTarget = list[list.length - 1];
      // const operation = component.findAll('.ant-transfer-operation')[0];
      expect(wrapper.element.style).toHaveProperty('backgroundColor', 'red');
      // expect(listSource.element.style).toHaveProperty('backgroundColor', 'blue');
      // expect(listTarget.element.style).toHaveProperty('backgroundColor', 'blue');
      // expect(operation.element.style).toHaveProperty('backgroundColor', 'yellow');
    });
  });
});
