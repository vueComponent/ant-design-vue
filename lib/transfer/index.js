'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransferLocale = exports.TransferProps = exports.TransferItem = exports.TransferDirection = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

var _operation = require('./operation');

var _operation2 = _interopRequireDefault(_operation);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _default = require('../locale-provider/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// function noop () {
// }

// import Search from './search'
var TransferDirection = exports.TransferDirection = 'left' | 'right';

var TransferItem = exports.TransferItem = {
  key: _vueTypes2['default'].string.isRequired,
  title: _vueTypes2['default'].string.isRequired,
  description: _vueTypes2['default'].string,
  disabled: _vueTypes2['default'].bool
};

var TransferProps = exports.TransferProps = {
  prefixCls: _vueTypes2['default'].string,
  dataSource: _vueTypes2['default'].arrayOf(_vueTypes2['default'].shape(TransferItem).loose),
  targetKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
  selectedKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
  render: _vueTypes2['default'].func,
  listStyle: _vueTypes2['default'].object,
  titles: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
  operations: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
  showSearch: _vueTypes2['default'].bool,
  filterOption: _vueTypes2['default'].func,
  searchPlaceholder: _vueTypes2['default'].string,
  notFoundContent: _vueTypes2['default'].any,
  rowKey: _vueTypes2['default'].func,
  lazy: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].bool])
};

var TransferLocale = exports.TransferLocale = {
  titles: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
  notFoundContent: _vueTypes2['default'].string,
  searchPlaceholder: _vueTypes2['default'].string,
  itemUnit: _vueTypes2['default'].string,
  itemsUnit: _vueTypes2['default'].string
};

exports['default'] = {
  name: 'ATransfer',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(TransferProps, {
    dataSource: [],
    showSearch: false
  }),
  data: function data() {
    this.splitedDataSource = {
      leftDataSource: [],
      rightDataSource: []
    } | null;
    var _selectedKeys = this.selectedKeys,
        selectedKeys = _selectedKeys === undefined ? [] : _selectedKeys,
        _targetKeys = this.targetKeys,
        targetKeys = _targetKeys === undefined ? [] : _targetKeys;

    return {
      leftFilter: '',
      rightFilter: '',
      sourceSelectedKeys: selectedKeys.filter(function (key) {
        return targetKeys.indexOf(key) === -1;
      }),
      targetSelectedKeys: selectedKeys.filter(function (key) {
        return targetKeys.indexOf(key) > -1;
      })
    };
  },
  mounted: function mounted() {
    // this.currentProps = { ...this.$props }
  },

  watch: {
    targetKeys: function targetKeys() {
      this.updateState();
      if (this.selectedKeys) {
        var targetKeys = this.targetKeys || [];
        this.setState({
          sourceSelectedKeys: this.selectedKeys.filter(function (key) {
            return !targetKeys.includes(key);
          }),
          targetSelectedKeys: this.selectedKeys.filter(function (key) {
            return targetKeys.includes(key);
          })
        });
      }
    },
    dataSource: function dataSource() {
      this.updateState();
    },
    selectedKeys: function selectedKeys() {
      if (this.selectedKeys) {
        var targetKeys = this.targetKeys || [];
        this.setState({
          sourceSelectedKeys: this.selectedKeys.filter(function (key) {
            return !targetKeys.includes(key);
          }),
          targetSelectedKeys: this.selectedKeys.filter(function (key) {
            return targetKeys.includes(key);
          })
        });
      }
    }
  },
  methods: {
    updateState: function updateState() {
      var sourceSelectedKeys = this.sourceSelectedKeys,
          targetSelectedKeys = this.targetSelectedKeys;

      this.splitedDataSource = null;
      if (!this.selectedKeys) {
        // clear key nolonger existed
        // clear checkedKeys according to targetKeys
        var dataSource = this.dataSource,
            _targetKeys2 = this.targetKeys,
            targetKeys = _targetKeys2 === undefined ? [] : _targetKeys2;


        var newSourceSelectedKeys = [];
        var newTargetSelectedKeys = [];
        dataSource.forEach(function (_ref) {
          var key = _ref.key;

          if (sourceSelectedKeys.includes(key) && !targetKeys.includes(key)) {
            newSourceSelectedKeys.push(key);
          }
          if (targetSelectedKeys.includes(key) && targetKeys.includes(key)) {
            newTargetSelectedKeys.push(key);
          }
        });
        this.setState({
          sourceSelectedKeys: newSourceSelectedKeys,
          targetSelectedKeys: newTargetSelectedKeys
        });
      }
    },
    splitDataSource: function splitDataSource(props) {
      if (this.splitedDataSource) {
        return this.splitedDataSource;
      }

      var dataSource = props.dataSource,
          rowKey = props.rowKey,
          _props$targetKeys = props.targetKeys,
          targetKeys = _props$targetKeys === undefined ? [] : _props$targetKeys;


      var leftDataSource = [];
      var rightDataSource = new Array(targetKeys.length);
      dataSource.forEach(function (record) {
        if (rowKey) {
          record.key = rowKey(record);
        }

        // rightDataSource should be ordered by targetKeys
        // leftDataSource should be ordered by dataSource
        var indexOfKey = targetKeys.indexOf(record.key);
        if (indexOfKey !== -1) {
          rightDataSource[indexOfKey] = record;
        } else {
          leftDataSource.push(record);
        }
      });

      this.splitedDataSource = {
        leftDataSource: leftDataSource,
        rightDataSource: rightDataSource
      };

      return this.splitedDataSource;
    },
    moveTo: function moveTo(direction) {
      var _$props = this.$props,
          _$props$targetKeys = _$props.targetKeys,
          targetKeys = _$props$targetKeys === undefined ? [] : _$props$targetKeys,
          _$props$dataSource = _$props.dataSource,
          dataSource = _$props$dataSource === undefined ? [] : _$props$dataSource;
      var sourceSelectedKeys = this.sourceSelectedKeys,
          targetSelectedKeys = this.targetSelectedKeys;

      var moveKeys = direction === 'right' ? sourceSelectedKeys : targetSelectedKeys;
      // filter the disabled options
      var newMoveKeys = moveKeys.filter(function (key) {
        return !dataSource.some(function (data) {
          return !!(key === data.key && data.disabled);
        });
      });
      // move items to target box
      var newTargetKeys = direction === 'right' ? newMoveKeys.concat(targetKeys) : targetKeys.filter(function (targetKey) {
        return newMoveKeys.indexOf(targetKey) === -1;
      });

      // empty checked keys
      var oppositeDirection = direction === 'right' ? 'left' : 'right';
      this.setState((0, _defineProperty3['default'])({}, this.getSelectedKeysName(oppositeDirection), []));
      this.handleSelectChange(oppositeDirection, []);

      this.$emit('change', newTargetKeys, direction, newMoveKeys);
    },
    moveToLeft: function moveToLeft() {
      this.moveTo('left');
    },
    moveToRight: function moveToRight() {
      this.moveTo('right');
    },
    handleSelectChange: function handleSelectChange(direction, holder) {
      var sourceSelectedKeys = this.sourceSelectedKeys,
          targetSelectedKeys = this.targetSelectedKeys;


      if (direction === 'left') {
        this.$emit('selectChange', holder, targetSelectedKeys);
      } else {
        this.$emit('selectChange', sourceSelectedKeys, holder);
      }
    },
    handleSelectAll: function handleSelectAll(direction, filteredDataSource, checkAll) {
      var originalSelectedKeys = this[this.getSelectedKeysName(direction)] || [];
      var currentKeys = filteredDataSource.map(function (item) {
        return item.key;
      });
      // Only operate current keys from original selected keys
      var newKeys1 = originalSelectedKeys.filter(function (key) {
        return currentKeys.indexOf(key) === -1;
      });
      var newKeys2 = [].concat((0, _toConsumableArray3['default'])(originalSelectedKeys));
      currentKeys.forEach(function (key) {
        if (newKeys2.indexOf(key) === -1) {
          newKeys2.push(key);
        }
      });
      var holder = checkAll ? newKeys1 : newKeys2;
      this.handleSelectChange(direction, holder);

      if (!this.selectedKeys) {
        this.setState((0, _defineProperty3['default'])({}, this.getSelectedKeysName(direction), holder));
      }
    },
    handleLeftSelectAll: function handleLeftSelectAll(filteredDataSource, checkAll) {
      this.handleSelectAll('left', filteredDataSource, checkAll);
    },
    handleRightSelectAll: function handleRightSelectAll(filteredDataSource, checkAll) {
      this.handleSelectAll('right', filteredDataSource, checkAll);
    },
    handleFilter: function handleFilter(direction, e) {
      this.setState((0, _defineProperty3['default'])({}, direction + 'Filter', e.target.value));
      this.$emit('searchChange', direction, e);
    },
    handleLeftFilter: function handleLeftFilter(e) {
      this.handleFilter('left', e);
    },
    handleRightFilter: function handleRightFilter(e) {
      this.handleFilter('right', e);
    },
    handleClear: function handleClear(direction) {
      this.setState((0, _defineProperty3['default'])({}, direction + 'Filter', ''));
    },
    handleLeftClear: function handleLeftClear() {
      this.handleClear('left');
    },
    handleRightClear: function handleRightClear() {
      this.handleClear('right');
    },
    handleSelect: function handleSelect(direction, selectedItem, checked) {
      var sourceSelectedKeys = this.sourceSelectedKeys,
          targetSelectedKeys = this.targetSelectedKeys;

      var holder = direction === 'left' ? [].concat((0, _toConsumableArray3['default'])(sourceSelectedKeys)) : [].concat((0, _toConsumableArray3['default'])(targetSelectedKeys));
      var index = holder.indexOf(selectedItem.key);
      if (index > -1) {
        holder.splice(index, 1);
      }
      if (checked) {
        holder.push(selectedItem.key);
      }
      this.handleSelectChange(direction, holder);

      if (!this.selectedKeys) {
        this.setState((0, _defineProperty3['default'])({}, this.getSelectedKeysName(direction), holder));
      }
    },
    handleLeftSelect: function handleLeftSelect(selectedItem, checked) {
      return this.handleSelect('left', selectedItem, checked);
    },
    handleRightSelect: function handleRightSelect(selectedItem, checked) {
      return this.handleSelect('right', selectedItem, checked);
    },
    handleScroll: function handleScroll(direction, e) {
      this.$emit('scroll', direction, e);
    },
    handleLeftScroll: function handleLeftScroll(e) {
      this.handleScroll('left', e);
    },
    handleRightScroll: function handleRightScroll(e) {
      this.handleScroll('right', e);
    },
    getTitles: function getTitles(transferLocale) {
      if (this.titles) {
        return this.titles;
      }
      return transferLocale.titles || ['', ''];
    },
    getSelectedKeysName: function getSelectedKeysName(direction) {
      return direction === 'left' ? 'sourceSelectedKeys' : 'targetSelectedKeys';
    },
    renderTransfer: function renderTransfer(locale) {
      var h = this.$createElement;

      var props = (0, _propsUtil.getOptionProps)(this);
      var _props$prefixCls = props.prefixCls,
          prefixCls = _props$prefixCls === undefined ? 'ant-transfer' : _props$prefixCls,
          _props$operations = props.operations,
          operations = _props$operations === undefined ? [] : _props$operations,
          showSearch = props.showSearch,
          searchPlaceholder = props.searchPlaceholder,
          listStyle = props.listStyle,
          filterOption = props.filterOption,
          lazy = props.lazy;

      var notFoundContent = (0, _propsUtil.getComponentFromProp)(this, 'notFoundContent');
      var leftFilter = this.leftFilter,
          rightFilter = this.rightFilter,
          sourceSelectedKeys = this.sourceSelectedKeys,
          targetSelectedKeys = this.targetSelectedKeys,
          $scopedSlots = this.$scopedSlots;
      var body = $scopedSlots.body,
          footer = $scopedSlots.footer;

      var renderItem = props.render;

      var _splitDataSource = this.splitDataSource(this.$props),
          leftDataSource = _splitDataSource.leftDataSource,
          rightDataSource = _splitDataSource.rightDataSource;

      var leftActive = targetSelectedKeys.length > 0;
      var rightActive = sourceSelectedKeys.length > 0;

      var cls = (0, _classnames2['default'])(prefixCls);

      var titles = this.getTitles(locale);
      return h(
        'div',
        { 'class': cls },
        [h(_list2['default'], {
          attrs: {
            prefixCls: prefixCls + '-list',
            titleText: titles[0],
            dataSource: leftDataSource,
            filter: leftFilter,
            filterOption: filterOption,

            checkedKeys: sourceSelectedKeys,
            handleFilter: this.handleLeftFilter,
            handleClear: this.handleLeftClear,
            handleSelect: this.handleLeftSelect,
            handleSelectAll: this.handleLeftSelectAll,
            renderItem: renderItem,
            showSearch: showSearch,
            searchPlaceholder: searchPlaceholder || locale.searchPlaceholder,
            notFoundContent: notFoundContent || locale.notFoundContent,
            itemUnit: locale.itemUnit,
            itemsUnit: locale.itemsUnit,
            body: body,
            footer: footer,
            lazy: lazy
          },
          style: listStyle, on: {
            'scroll': this.handleLeftScroll
          }
        }), h(_operation2['default'], {
          'class': prefixCls + '-operation',
          attrs: { rightActive: rightActive,
            rightArrowText: operations[0],
            moveToRight: this.moveToRight,
            leftActive: leftActive,
            leftArrowText: operations[1],
            moveToLeft: this.moveToLeft
          }
        }), h(_list2['default'], {
          attrs: {
            prefixCls: prefixCls + '-list',
            titleText: titles[1],
            dataSource: rightDataSource,
            filter: rightFilter,
            filterOption: filterOption,

            checkedKeys: targetSelectedKeys,
            handleFilter: this.handleRightFilter,
            handleClear: this.handleRightClear,
            handleSelect: this.handleRightSelect,
            handleSelectAll: this.handleRightSelectAll,
            renderItem: renderItem,
            showSearch: showSearch,
            searchPlaceholder: searchPlaceholder || locale.searchPlaceholder,
            notFoundContent: notFoundContent || locale.notFoundContent,
            itemUnit: locale.itemUnit,
            itemsUnit: locale.itemsUnit,
            body: body,
            footer: footer,
            lazy: lazy
          },
          style: listStyle, on: {
            'scroll': this.handleRightScroll
          }
        })]
      );
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(_LocaleReceiver2['default'], {
      attrs: {
        componentName: 'Transfer',
        defaultLocale: _default2['default'].Transfer,
        children: this.renderTransfer
      }
    });
  }
};