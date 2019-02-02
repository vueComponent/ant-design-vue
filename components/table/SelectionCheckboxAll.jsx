import Checkbox from '../checkbox';
import Dropdown from '../dropdown';
import Menu from '../menu';
import Icon from '../icon';
import classNames from 'classnames';
import { SelectionCheckboxAllProps } from './interface';
import BaseMixin from '../_util/BaseMixin';

export default {
  name: 'SelectionCheckboxAll',
  mixins: [BaseMixin],
  props: SelectionCheckboxAllProps,
  data() {
    const { $props: props } = this;
    this.defaultSelections = props.hideDefaultSelections
      ? []
      : [
          {
            key: 'all',
            text: props.locale.selectAll,
            onSelect: () => {},
          },
          {
            key: 'invert',
            text: props.locale.selectInvert,
            onSelect: () => {},
          },
        ];

    return {
      checked: this.getCheckState(props),
      indeterminate: this.getIndeterminateState(props),
    };
  },

  watch: {
    $props: {
      handler: function() {
        this.setCheckState();
      },
      deep: true,
    },
  },

  mounted() {
    this.subscribe();
  },

  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    subscribe() {
      const { store } = this;
      this.unsubscribe = store.subscribe(() => {
        this.setCheckState(this.$props);
      });
    },

    checkSelection(props, data, type, byDefaultChecked) {
      const { store, getCheckboxPropsByItem, getRecordKey } = props || this.$props;
      // type should be 'every' | 'some'
      if (type === 'every' || type === 'some') {
        return byDefaultChecked
          ? data[type]((item, i) => getCheckboxPropsByItem(item, i).props.defaultChecked)
          : data[type](
              (item, i) => store.getState().selectedRowKeys.indexOf(getRecordKey(item, i)) >= 0,
            );
      }
      return false;
    },

    setCheckState(props) {
      const checked = this.getCheckState(props);
      const indeterminate = this.getIndeterminateState(props);
      this.setState(prevState => {
        const newState = {};
        if (indeterminate !== prevState.indeterminate) {
          newState.indeterminate = indeterminate;
        }
        if (checked !== prevState.checked) {
          newState.checked = checked;
        }
        return newState;
      });
    },

    getCheckState(props) {
      const { store, data } = this;
      let checked;
      if (!data.length) {
        checked = false;
      } else {
        checked = store.getState().selectionDirty
          ? this.checkSelection(props, data, 'every', false)
          : this.checkSelection(props, data, 'every', false) ||
            this.checkSelection(props, data, 'every', true);
      }
      return checked;
    },

    getIndeterminateState(props) {
      const { store, data } = this;
      let indeterminate;
      if (!data.length) {
        indeterminate = false;
      } else {
        indeterminate = store.getState().selectionDirty
          ? this.checkSelection(props, data, 'some', false) &&
            !this.checkSelection(props, data, 'every', false)
          : (this.checkSelection(props, data, 'some', false) &&
              !this.checkSelection(props, data, 'every', false)) ||
            (this.checkSelection(props, data, 'some', true) &&
              !this.checkSelection(props, data, 'every', true));
      }
      return indeterminate;
    },

    handleSelectAllChange(e) {
      const checked = e.target.checked;
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
          <Dropdown getPopupContainer={getPopupContainer}>
            <template slot="overlay">{menu}</template>
            <div class={`${selectionPrefixCls}-down`}>
              <Icon type="down" />
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
};
