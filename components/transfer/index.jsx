import PropTypes from '../_util/vue-types'
import { initDefaultProps, getOptionProps, getComponentFromProp } from '../_util/props-util'
import BaseMixin from '../_util/BaseMixin'
import classNames from 'classnames'
import List from './list'
import Operation from './operation'
// import Search from './search'
import LocaleReceiver from '../locale-provider/LocaleReceiver'
import defaultLocale from '../locale-provider/default'

// function noop () {
// }

export const TransferDirection = 'left' | 'right'

export const TransferItem = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  disabled: PropTypes.bool,
}

export const TransferProps = {
  prefixCls: PropTypes.string,
  dataSource: PropTypes.arrayOf(PropTypes.shape(TransferItem).loose),
  targetKeys: PropTypes.arrayOf(PropTypes.string),
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  render: PropTypes.func,
  listStyle: PropTypes.object,
  titles: PropTypes.arrayOf(PropTypes.string),
  operations: PropTypes.arrayOf(PropTypes.string),
  showSearch: PropTypes.bool,
  filterOption: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  notFoundContent: PropTypes.any,
  rowKey: PropTypes.func,
  lazy: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
}

export const TransferLocale = {
  titles: PropTypes.arrayOf(PropTypes.string),
  notFoundContent: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  itemUnit: PropTypes.string,
  itemsUnit: PropTypes.string,
}

export default {
  name: 'ATransfer',
  mixins: [BaseMixin],
  props: initDefaultProps(TransferProps, {
    dataSource: [],
    showSearch: false,
  }),
  data () {
    this.splitedDataSource = {
      leftDataSource: [],
      rightDataSource: [],
    } | null
    const { selectedKeys = [], targetKeys = [] } = this
    return {
      leftFilter: '',
      rightFilter: '',
      sourceSelectedKeys: selectedKeys.filter(key => targetKeys.indexOf(key) === -1),
      targetSelectedKeys: selectedKeys.filter(key => targetKeys.indexOf(key) > -1),
    }
  },
  mounted () {
    // this.currentProps = { ...this.$props }
  },
  watch: {
    targetKeys () {
      this.updateState()
      if (this.selectedKeys) {
        const targetKeys = this.targetKeys || []
        this.setState({
          sourceSelectedKeys: this.selectedKeys.filter(key => !targetKeys.includes(key)),
          targetSelectedKeys: this.selectedKeys.filter(key => targetKeys.includes(key)),
        })
      }
    },
    dataSource () {
      this.updateState()
    },
    selectedKeys () {
      if (this.selectedKeys) {
        const targetKeys = this.targetKeys || []
        this.setState({
          sourceSelectedKeys: this.selectedKeys.filter(key => !targetKeys.includes(key)),
          targetSelectedKeys: this.selectedKeys.filter(key => targetKeys.includes(key)),
        })
      }
    },
    // '$props': {
    //   handler: function (nextProps) {
    //     // if (nextProps.targetKeys !== currentProps.targetKeys ||
    //     //   nextProps.dataSource !== currentProps.dataSource) {
    //     //   // clear cached splited dataSource
    //     //   this.splitedDataSource = null

    //     //   if (!nextProps.selectedKeys) {
    //     //     // clear key nolonger existed
    //     //     // clear checkedKeys according to targetKeys
    //     //     const { dataSource, targetKeys = [] } = nextProps

    //     //     const newSourceSelectedKeys = []
    //     //     const newTargetSelectedKeys = []
    //     //     dataSource.forEach(({ key }) => {
    //     //       if (sourceSelectedKeys.includes(key) && !targetKeys.includes(key)) {
    //     //         newSourceSelectedKeys.push(key)
    //     //       }
    //     //       if (targetSelectedKeys.includes(key) && targetKeys.includes(key)) {
    //     //         newTargetSelectedKeys.push(key)
    //     //       }
    //     //     })
    //     //     this.setState({
    //     //       sourceSelectedKeys: newSourceSelectedKeys,
    //     //       targetSelectedKeys: newTargetSelectedKeys,
    //     //     })
    //     //   }
    //     // }

    //     // if (nextProps.selectedKeys) {
    //     //   const targetKeys = nextProps.targetKeys || []
    //     //   this.setState({
    //     //     sourceSelectedKeys: nextProps.selectedKeys.filter(key => !targetKeys.includes(key)),
    //     //     targetSelectedKeys: nextProps.selectedKeys.filter(key => targetKeys.includes(key)),
    //     //   })
    //     // }
    //     // this.currentProps = { ...this.$props }
    //   },
    //   deep: true,
    // },
  },
  methods: {
    updateState () {
      const { sourceSelectedKeys, targetSelectedKeys } = this
      this.splitedDataSource = null
      if (!this.selectedKeys) {
        // clear key nolonger existed
        // clear checkedKeys according to targetKeys
        const { dataSource, targetKeys = [] } = this

        const newSourceSelectedKeys = []
        const newTargetSelectedKeys = []
        dataSource.forEach(({ key }) => {
          if (sourceSelectedKeys.includes(key) && !targetKeys.includes(key)) {
            newSourceSelectedKeys.push(key)
          }
          if (targetSelectedKeys.includes(key) && targetKeys.includes(key)) {
            newTargetSelectedKeys.push(key)
          }
        })
        this.setState({
          sourceSelectedKeys: newSourceSelectedKeys,
          targetSelectedKeys: newTargetSelectedKeys,
        })
      }
    },
    splitDataSource (props) {
      if (this.splitedDataSource) {
        return this.splitedDataSource
      }

      const { dataSource, rowKey, targetKeys = [] } = props

      const leftDataSource = []
      const rightDataSource = new Array(targetKeys.length)
      dataSource.forEach(record => {
        if (rowKey) {
          record.key = rowKey(record)
        }

        // rightDataSource should be ordered by targetKeys
        // leftDataSource should be ordered by dataSource
        const indexOfKey = targetKeys.indexOf(record.key)
        if (indexOfKey !== -1) {
          rightDataSource[indexOfKey] = record
        } else {
          leftDataSource.push(record)
        }
      })

      this.splitedDataSource = {
        leftDataSource,
        rightDataSource,
      }

      return this.splitedDataSource
    },

    moveTo  (direction) {
      const { targetKeys = [], dataSource = [] } = this.$props
      const { sourceSelectedKeys, targetSelectedKeys } = this
      const moveKeys = direction === 'right' ? sourceSelectedKeys : targetSelectedKeys
      // filter the disabled options
      const newMoveKeys = moveKeys.filter((key) =>
        !dataSource.some(data => !!(key === data.key && data.disabled)),
      )
      // move items to target box
      const newTargetKeys = direction === 'right'
        ? newMoveKeys.concat(targetKeys)
        : targetKeys.filter(targetKey => newMoveKeys.indexOf(targetKey) === -1)

      // empty checked keys
      const oppositeDirection = direction === 'right' ? 'left' : 'right'
      this.setState({
        [this.getSelectedKeysName(oppositeDirection)]: [],
      })
      this.handleSelectChange(oppositeDirection, [])

      this.$emit('change', newTargetKeys, direction, newMoveKeys)
    },
    moveToLeft () {
      this.moveTo('left')
    },
    moveToRight () {
      this.moveTo('right')
    },

    handleSelectChange (direction, holder) {
      const { sourceSelectedKeys, targetSelectedKeys } = this

      if (direction === 'left') {
        this.$emit('selectChange', holder, targetSelectedKeys)
      } else {
        this.$emit('selectChange', sourceSelectedKeys, holder)
      }
    },
    handleSelectAll (direction, filteredDataSource, checkAll) {
      const originalSelectedKeys = this[this.getSelectedKeysName(direction)] || []
      const currentKeys = filteredDataSource.map(item => item.key)
      // Only operate current keys from original selected keys
      const newKeys1 = originalSelectedKeys.filter((key) => currentKeys.indexOf(key) === -1)
      const newKeys2 = [...originalSelectedKeys]
      currentKeys.forEach((key) => {
        if (newKeys2.indexOf(key) === -1) {
          newKeys2.push(key)
        }
      })
      const holder = checkAll ? newKeys1 : newKeys2
      this.handleSelectChange(direction, holder)

      if (!this.selectedKeys) {
        this.setState({
          [this.getSelectedKeysName(direction)]: holder,
        })
      }
    },

    handleLeftSelectAll (filteredDataSource, checkAll) {
      this.handleSelectAll('left', filteredDataSource, checkAll)
    },
    handleRightSelectAll (filteredDataSource, checkAll) {
      this.handleSelectAll('right', filteredDataSource, checkAll)
    },

    handleFilter (direction, e) {
      this.setState({
        // add filter
        [`${direction}Filter`]: e.target.value,
      })
      this.$emit('searchChange', direction, e)
    },

    handleLeftFilter (e) {
      this.handleFilter('left', e)
    },
    handleRightFilter (e) {
      this.handleFilter('right', e)
    },

    handleClear (direction) {
      this.setState({
        [`${direction}Filter`]: '',
      })
    },

    handleLeftClear () {
      this.handleClear('left')
    },
    handleRightClear () {
      this.handleClear('right')
    },

    handleSelect (direction, selectedItem, checked) {
      const { sourceSelectedKeys, targetSelectedKeys } = this
      const holder = direction === 'left' ? [...sourceSelectedKeys] : [...targetSelectedKeys]
      const index = holder.indexOf(selectedItem.key)
      if (index > -1) {
        holder.splice(index, 1)
      }
      if (checked) {
        holder.push(selectedItem.key)
      }
      this.handleSelectChange(direction, holder)

      if (!this.selectedKeys) {
        this.setState({
          [this.getSelectedKeysName(direction)]: holder,
        })
      }
    },

    handleLeftSelect  (selectedItem, checked) {
      return this.handleSelect('left', selectedItem, checked)
    },

    handleRightSelect (selectedItem, checked) {
      return this.handleSelect('right', selectedItem, checked)
    },

    handleScroll (direction, e) {
      this.$emit('scroll', direction, e)
    },

    handleLeftScroll (e) {
      this.handleScroll('left', e)
    },
    handleRightScroll (e) {
      this.handleScroll('right', e)
    },

    getTitles (transferLocale) {
      if (this.titles) {
        return this.titles
      }
      return transferLocale.titles || ['', '']
    },

    getSelectedKeysName (direction) {
      return direction === 'left' ? 'sourceSelectedKeys' : 'targetSelectedKeys'
    },

    renderTransfer (locale) {
      const props = getOptionProps(this)
      const {
        prefixCls = 'ant-transfer',
        operations = [],
        showSearch,
        searchPlaceholder,
        listStyle,
        filterOption,
        lazy,
      } = props
      const notFoundContent = getComponentFromProp(this, 'notFoundContent')
      const { leftFilter, rightFilter, sourceSelectedKeys, targetSelectedKeys, $scopedSlots } = this
      const { body, footer } = $scopedSlots
      const renderItem = props.render
      const { leftDataSource, rightDataSource } = this.splitDataSource(this.$props)
      const leftActive = targetSelectedKeys.length > 0
      const rightActive = sourceSelectedKeys.length > 0

      const cls = classNames(prefixCls)

      const titles = this.getTitles(locale)
      return (
        <div class={cls}>
          <List
            prefixCls={`${prefixCls}-list`}
            titleText={titles[0]}
            dataSource={leftDataSource}
            filter={leftFilter}
            filterOption={filterOption}
            style={listStyle}
            checkedKeys={sourceSelectedKeys}
            handleFilter={this.handleLeftFilter}
            handleClear={this.handleLeftClear}
            handleSelect={this.handleLeftSelect}
            handleSelectAll={this.handleLeftSelectAll}
            renderItem={renderItem}
            showSearch={showSearch}
            searchPlaceholder={searchPlaceholder || locale.searchPlaceholder}
            notFoundContent={notFoundContent || locale.notFoundContent}
            itemUnit={locale.itemUnit}
            itemsUnit={locale.itemsUnit}
            body={body}
            footer={footer}
            lazy={lazy}
            onScroll={this.handleLeftScroll}
          />
          <Operation
            class={`${prefixCls}-operation`}
            rightActive={rightActive}
            rightArrowText={operations[0]}
            moveToRight={this.moveToRight}
            leftActive={leftActive}
            leftArrowText={operations[1]}
            moveToLeft={this.moveToLeft}
          />
          <List
            prefixCls={`${prefixCls}-list`}
            titleText={titles[1]}
            dataSource={rightDataSource}
            filter={rightFilter}
            filterOption={filterOption}
            style={listStyle}
            checkedKeys={targetSelectedKeys}
            handleFilter={this.handleRightFilter}
            handleClear={this.handleRightClear}
            handleSelect={this.handleRightSelect}
            handleSelectAll={this.handleRightSelectAll}
            renderItem={renderItem}
            showSearch={showSearch}
            searchPlaceholder={searchPlaceholder || locale.searchPlaceholder}
            notFoundContent={notFoundContent || locale.notFoundContent}
            itemUnit={locale.itemUnit}
            itemsUnit={locale.itemsUnit}
            body={body}
            footer={footer}
            lazy={lazy}
            onScroll={this.handleRightScroll}
          />
        </div>
      )
    },
  },
  render () {
    return (
      <LocaleReceiver
        componentName='Transfer'
        defaultLocale={defaultLocale.Transfer}
        children={this.renderTransfer}
      >
      </LocaleReceiver>
    )
  },
}
