import Vue from 'vue';
import { mount } from '@vue/test-utils';
import createStore from '../createStore';
import SelectionBox from '../SelectionBox';

const getDefaultStore = selectedRowKeys => {
  return createStore({
    selectedRowKeys: selectedRowKeys || [],
    selectionDirty: false,
  });
};

describe('SelectionBox', () => {
  it('unchecked by selectedRowKeys ', () => {
    const wrapper = mount(SelectionBox, {
      propsData: {
        store: getDefaultStore(),
        rowIndex: '1',
        disabled: false,
        onChange: () => {},
        defaultSelection: [],
      },
      listeners: {
        change: () => {},
      },
      sync: false,
    });

    expect(wrapper.vm.$data).toEqual({ checked: false });
  });

  it('checked by selectedRowKeys ', () => {
    const wrapper = mount(SelectionBox, {
      propsData: {
        store: getDefaultStore(['1']),
        rowIndex: '1',
        disabled: false,
        onChange: () => {},
        defaultSelection: [],
      },
      listeners: {
        change: () => {},
      },
      sync: false,
    });

    expect(wrapper.vm.$data).toEqual({ checked: true });
  });

  it('checked by defaultSelection', () => {
    const wrapper = mount(SelectionBox, {
      propsData: {
        store: getDefaultStore(),
        rowIndex: '1',
        disabled: false,
        onChange: () => {},
        defaultSelection: ['1'],
      },
      listeners: {
        change: () => {},
      },
      sync: false,
    });

    expect(wrapper.vm.$data).toEqual({ checked: true });
  });

  it('checked when store change', () => {
    const store = getDefaultStore();
    const wrapper = mount(SelectionBox, {
      propsData: {
        store: store,
        rowIndex: '1',
        disabled: false,
        defaultSelection: [],
      },
      listeners: {
        change: () => {},
      },
      sync: false,
    });

    store.setState({
      selectedRowKeys: ['1'],
      selectionDirty: true,
    });

    expect(wrapper.vm.$data).toEqual({ checked: true });
  });

  it('passes props to Checkbox', done => {
    const checkboxProps = {
      name: 'testName',
      id: 'testId',
    };
    const wrapper = mount(SelectionBox, {
      propsData: {
        store: getDefaultStore(),
        rowIndex: '1',
        disabled: false,
        defaultSelection: ['1'],
        ...checkboxProps,
      },
      listeners: {
        change: () => {},
      },
      sync: false,
    });
    Vue.nextTick(() => {
      wrapper.findAll({ name: 'ACheckbox' }).wrappers.forEach(box => {
        expect(box.props().name).toEqual(checkboxProps.name);
        expect(box.props().id).toEqual(checkboxProps.id);
      });
      done();
    });
  });

  it('passes props to Radios', done => {
    const radioProps = {
      name: 'testName',
      id: 'testId',
    };
    const wrapper = mount(SelectionBox, {
      propsData: {
        store: getDefaultStore(),
        rowIndex: '1',
        disabled: false,
        defaultSelection: ['1'],
        type: 'radio',
        ...radioProps,
      },
      listeners: {
        change: () => {},
      },
      sync: false,
    });
    Vue.nextTick(() => {
      wrapper.findAll({ name: 'ARadio' }).wrappers.forEach(radio => {
        expect(radio.props().name).toEqual(radioProps.name);
        expect(radio.props().id).toEqual(radioProps.id);
      });
      done();
    });
  });
});
