import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import Checkbox from '../checkbox';
import Dropdown from '../dropdown';
import Menu from '../menu';
import classNames from '../_util/classNames';
import { SelectionCheckboxAllProps } from './interface';
import BaseMixin from '../_util/BaseMixin';
import { computed, defineComponent } from 'vue';

function checkSelection({
  store,
  getCheckboxPropsByItem,
  getRecordKey,
  data,
  type,
  byDefaultChecked,
}) {
  return byDefaultChecked
    ? data[type]((item, i) => getCheckboxPropsByItem(item, i).defaultChecked)
    : data[type]((item, i) => store.selectedRowKeys.indexOf(getRecordKey(item, i)) >= 0);
}

function getIndeterminateState(props) {
  const { store, data } = props;
  if (!data.length) {
    return false;
  }

  const someCheckedNotByDefaultChecked =
    checkSelection({
      ...props,
      data,
      type: 'some',
      byDefaultChecked: false,
    }) &&
    !checkSelection({
      ...props,
      data,
      type: 'every',
      byDefaultChecked: false,
    });
  const someCheckedByDefaultChecked =
    checkSelection({
      ...props,
      data,
      type: 'some',
      byDefaultChecked: true,
    }) &&
    !checkSelection({
      ...props,
      data,
      type: 'every',
      byDefaultChecked: true,
    });

  if (store.selectionDirty) {
    return someCheckedNotByDefaultChecked;
  }
  return someCheckedNotByDefaultChecked || someCheckedByDefaultChecked;
}

function getCheckState(props) {
  const { store, data } = props;
  if (!data.length) {
    return false;
  }
  if (store.selectionDirty) {
    return checkSelection({
      ...props,
      data,
      type: 'every',
      byDefaultChecked: false,
    });
  }
  return (
    checkSelection({
      ...props,
      data,
      type: 'every',
      byDefaultChecked: false,
    }) ||
    checkSelection({
      ...props,
      data,
      type: 'every',
      byDefaultChecked: true,
    })
  );
}

export default defineComponent({
  name: 'SelectionCheckboxAll',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: SelectionCheckboxAllProps,

  setup(props) {
    return {
      defaultSelections: [],
      checked: computed(() => {
        return getCheckState(props);
      }),
      indeterminate: computed(() => {
        return getIndeterminateState(props);
      }),
    };
  },

  created() {
    const { $props: props } = this;
    this.defaultSelections = props.hideDefaultSelections
      ? []
      : [
          {
            key: 'all',
            text: props.locale.selectAll,
          },
          {
            key: 'invert',
            text: props.locale.selectInvert,
          },
        ];
  },
  methods: {
    handleSelectAllChange(e) {
      const { checked } = e.target;
      this.$emit('select', checked ? 'all' : 'removeAll', 0, null);
    },

    renderMenus(selections) {
      return selections.map((selection, index) => {
        return (
          <Menu.Item key={selection.key || index}>
            <div
              onClick={() => {
                this.$emit('select', selection.key, index, selection.onSelect);
              }}
            >
              {selection.text}
            </div>
          </Menu.Item>
        );
      });
    },
  },

  render() {
    const { disabled, prefixCls, selections, getPopupContainer, checked, indeterminate } = this;

    const selectionPrefixCls = `${prefixCls}-selection`;

    let customSelections = null;

    if (selections) {
      const newSelections = Array.isArray(selections)
        ? this.defaultSelections.concat(selections)
        : this.defaultSelections;

      const menu = (
        <Menu class={`${selectionPrefixCls}-menu`} selectedKeys={[]}>
          {this.renderMenus(newSelections)}
        </Menu>
      );

      customSelections =
        newSelections.length > 0 ? (
          <Dropdown getPopupContainer={getPopupContainer} overlay={menu}>
            <div class={`${selectionPrefixCls}-down`}>
              <DownOutlined />
            </div>
          </Dropdown>
        ) : null;
    }

    return (
      <div class={selectionPrefixCls}>
        <Checkbox
          class={classNames({ [`${selectionPrefixCls}-select-all-custom`]: customSelections })}
          checked={checked}
          indeterminate={indeterminate}
          disabled={disabled}
          onChange={this.handleSelectAllChange}
        />
        {customSelections}
      </div>
    );
  },
});
