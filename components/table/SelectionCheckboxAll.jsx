import Checkbox from '../checkbox'
import Dropdown from '../dropdown'
import Menu from '../menu'
import Icon from '../icon'
import classNames from 'classnames'
import { SelectionCheckboxAllProps } from './interface'
import BaseMixin from '../_util/BaseMixin'

export default {
  props: SelectionCheckboxAllProps,
  name: 'SelectionCheckboxAll',
  mixins: [BaseMixin],
  data () {
    const { $props: props } = this
    this.defaultSelections = props.hideDefaultSelections ? [] : [{
      key: 'all',
      text: props.locale.selectAll,
      onSelect: () => {},
    }, {
      key: 'invert',
      text: props.locale.selectInvert,
      onSelect: () => {},
    }]

    return {
      checked: this.getCheckState(props),
      indeterminate: this.getIndeterminateState(props),
    }
  },

  mounted () {
    this.subscribe()
  },

  watch: {
    '$props': {
      handler: function () {
        this.setCheckState()
      },
      deep: true,
    },
  },

  beforeDestroy () {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  methods: {
    subscribe () {
      const { store } = this
      this.unsubscribe = store.subscribe(() => {
        this.setCheckState()
      })
    },

    checkSelection (data, type, byDefaultChecked) {
      const { store, getCheckboxPropsByItem, getRecordKey } = this
      // type should be 'every' | 'some'
      if (type === 'every' || type === 'some') {
        return (
          byDefaultChecked
            ? data[type]((item, i) => getCheckboxPropsByItem(item, i).props.defaultChecked)
            : data[type]((item, i) =>
              store.getState().selectedRowKeys.indexOf(getRecordKey(item, i)) >= 0)
        )
      }
      return false
    },

    setCheckState () {
      const checked = this.getCheckState()
      const indeterminate = this.getIndeterminateState()
      if (checked !== this.checked) {
        this.setState({ checked })
      }
      if (indeterminate !== this.indeterminate) {
        this.setState({ indeterminate })
      }
    },

    getCheckState () {
      const { store, data } = this
      let checked
      if (!data.length) {
        checked = false
      } else {
        checked = store.getState().selectionDirty
          ? this.checkSelection(data, 'every', false)
          : (
            this.checkSelection(data, 'every', false) ||
            this.checkSelection(data, 'every', true)
          )
      }
      return checked
    },

    getIndeterminateState () {
      const { store, data } = this
      let indeterminate
      if (!data.length) {
        indeterminate = false
      } else {
        indeterminate = store.getState().selectionDirty
          ? (
            this.checkSelection(data, 'some', false) &&
              !this.checkSelection(data, 'every', false)
          )
          : ((this.checkSelection(data, 'some', false) &&
              !this.checkSelection(data, 'every', false)) ||
              (this.checkSelection(data, 'some', true) &&
              !this.checkSelection(data, 'every', true))
          )
      }
      return indeterminate
    },

    handleSelectAllChagne (e) {
      const checked = e.target.checked
      this.$emit('select', checked ? 'all' : 'removeAll', 0, null)
    },

    renderMenus (selections) {
      return selections.map((selection, index) => {
        return (
          <Menu.Item
            key={selection.key || index}
          >
            <div
              onClick={() => { this.$emit('select', selection.key, index, selection.onSelect) }}
            >
              {selection.text}
            </div>
          </Menu.Item>
        )
      })
    },
  },

  render () {
    const { disabled, prefixCls, selections, getPopupContainer, checked, indeterminate } = this

    const selectionPrefixCls = `${prefixCls}-selection`

    let customSelections = null

    if (selections) {
      const newSelections = Array.isArray(selections) ? this.defaultSelections.concat(selections)
        : this.defaultSelections

      const menu = (
        <Menu
          class={`${selectionPrefixCls}-menu`}
          selectedKeys={[]}
        >
          {this.renderMenus(newSelections)}
        </Menu>
      )

      customSelections = newSelections.length > 0 ? (
        <Dropdown
          getPopupContainer={getPopupContainer}
        >
          <template slot='overlay'>
            {menu}
          </template>
          <div class={`${selectionPrefixCls}-down`}>
            <Icon type='down' />
          </div>
        </Dropdown>
      ) : null
    }

    return (
      <div class={selectionPrefixCls}>
        <Checkbox
          class={classNames({ [`${selectionPrefixCls}-select-all-custom`]: customSelections })}
          checked={checked}
          indeterminate={indeterminate}
          disabled={disabled}
          onChange={this.handleSelectAllChagne}
        />
        {customSelections}
      </div>
    )
  },
}
