'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

var _Pager = require('./Pager');

var _Pager2 = _interopRequireDefault(_Pager);

var _Options = require('./Options');

var _Options2 = _interopRequireDefault(_Options);

var _zh_CN = require('./locale/zh_CN');

var _zh_CN2 = _interopRequireDefault(_zh_CN);

var _KeyCode = require('./KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

// 是否是正整数
function isInteger(value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

function defaultItemRender(page, type, element) {
  return element;
}

exports['default'] = {
  name: 'Pagination',
  mixins: [_BaseMixin2['default']],
  props: {
    prefixCls: _vueTypes2['default'].string.def('rc-pagination'),
    selectPrefixCls: _vueTypes2['default'].string.def('rc-select'),
    current: _vueTypes2['default'].number,
    defaultCurrent: _vueTypes2['default'].number.def(1),
    total: _vueTypes2['default'].number.def(0),
    pageSize: _vueTypes2['default'].number,
    defaultPageSize: _vueTypes2['default'].number.def(10),
    change: _vueTypes2['default'].func.def(noop),
    hideOnSinglePage: _vueTypes2['default'].bool.def(false),
    showSizeChanger: _vueTypes2['default'].bool.def(false),
    showLessItems: _vueTypes2['default'].bool.def(false),
    // showSizeChange: PropTypes.func.def(noop),
    selectComponentClass: _vueTypes2['default'].any,
    showPrevNextJumpers: _vueTypes2['default'].bool.def(true),
    showQuickJumper: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].object]).def(false),
    showTitle: _vueTypes2['default'].bool.def(true),
    pageSizeOptions: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
    buildOptionText: _vueTypes2['default'].func,
    showTotal: _vueTypes2['default'].func,
    simple: _vueTypes2['default'].bool,
    locale: _vueTypes2['default'].object.def(_zh_CN2['default']),
    itemRender: _vueTypes2['default'].func.def(defaultItemRender)
  },
  model: {
    prop: 'current',
    event: 'change'
  },
  data: function data() {
    var hasOnChange = this.onChange !== noop;
    var hasCurrent = (0, _propsUtil.hasProp)(this, 'current');
    if (hasCurrent && !hasOnChange) {
      console.warn('Warning: You provided a `current` prop to a Pagination component without an `onChange` handler. This will render a read-only component.'); // eslint-disable-line
    }
    var current = this.defaultCurrent;
    if (hasCurrent) {
      current = this.current;
    }

    var pageSize = this.defaultPageSize;
    if ((0, _propsUtil.hasProp)(this, 'pageSize')) {
      pageSize = this.pageSize;
    }

    return {
      stateCurrent: current,
      stateCurrentInputValue: current,
      statePageSize: pageSize
    };
  },

  watch: {
    current: function current(val) {
      this.setState({
        stateCurrent: val,
        stateCurrentInputValue: val
      });
    },
    pageSize: function pageSize(val) {
      var newState = {};
      var current = this.stateCurrent;
      var newCurrent = this.calculatePage(val);
      current = current > newCurrent ? newCurrent : current;
      if (!(0, _propsUtil.hasProp)(this, 'current')) {
        newState.stateCurrent = current;
        newState.stateCurrentInputValue = current;
      }
      newState.statePageSize = val;
      this.setState(newState);
    },
    stateCurrent: function stateCurrent(val, oldValue) {
      var _this = this;

      // When current page change, fix focused style of prev item
      // A hacky solution of https://github.com/ant-design/ant-design/issues/8948
      this.$nextTick(function () {
        if (_this.$refs.paginationNode) {
          var lastCurrentNode = _this.$refs.paginationNode.querySelector('.' + _this.prefixCls + '-item-' + oldValue);
          if (lastCurrentNode && document.activeElement === lastCurrentNode) {
            lastCurrentNode.blur();
          }
        }
      });
    }
  },
  methods: {
    isValid: function isValid(page) {
      return isInteger(page) && page >= 1 && page !== this.stateCurrent;
    },
    calculatePage: function calculatePage(p) {
      var pageSize = p;
      if (typeof pageSize === 'undefined') {
        pageSize = this.statePageSize;
      }
      return Math.floor((this.total - 1) / pageSize) + 1;
    },
    handleGoTO: function handleGoTO(event) {
      if (event.keyCode === _KeyCode2['default'].ENTER || event.type === 'click') {
        this.handleChange(this.stateCurrentInputValue);
      }
    },
    prev: function prev() {
      if (this.hasPrev()) {
        this.handleChange(this.stateCurrent - 1);
      }
    },
    next: function next() {
      if (this.hasNext()) {
        this.handleChange(this.stateCurrent + 1);
      }
    },
    hasPrev: function hasPrev() {
      return this.stateCurrent > 1;
    },
    hasNext: function hasNext() {
      return this.stateCurrent < this.calculatePage();
    },
    handleKeyDown: function handleKeyDown(event) {
      if (event.keyCode === _KeyCode2['default'].ARROW_UP || event.keyCode === _KeyCode2['default'].ARROW_DOWN) {
        event.preventDefault();
      }
    },
    handleKeyUp: function handleKeyUp(event) {
      var inputValue = event.target.value;
      var stateCurrentInputValue = this.stateCurrentInputValue;
      var value = void 0;

      if (inputValue === '') {
        value = inputValue;
      } else if (isNaN(Number(inputValue))) {
        value = stateCurrentInputValue;
      } else {
        value = Number(inputValue);
      }

      if (value !== stateCurrentInputValue) {
        this.setState({
          stateCurrentInputValue: value
        });
      }

      if (event.keyCode === _KeyCode2['default'].ENTER) {
        this.handleChange(value);
      } else if (event.keyCode === _KeyCode2['default'].ARROW_UP) {
        this.handleChange(value - 1);
      } else if (event.keyCode === _KeyCode2['default'].ARROW_DOWN) {
        this.handleChange(value + 1);
      }
    },
    changePageSize: function changePageSize(size) {
      var current = this.stateCurrent;
      var newCurrent = this.calculatePage(size);
      current = current > newCurrent ? newCurrent : current;
      if (typeof size === 'number') {
        if (!(0, _propsUtil.hasProp)(this, 'pageSize')) {
          this.setState({
            statePageSize: size
          });
        }
        if (!(0, _propsUtil.hasProp)(this, 'current')) {
          this.setState({
            stateCurrent: current,
            stateCurrentInputValue: current
          });
        }
      }
      this.$emit('update:pageSize', size);
      this.$emit('showSizeChange', current, size);
      this.$emit('change', current, size);
    },
    handleChange: function handleChange(p) {
      var page = p;
      if (this.isValid(page)) {
        var allTotal = this.calculatePage();
        if (page > allTotal) {
          page = allTotal;
        }
        if (!(0, _propsUtil.hasProp)(this, 'current')) {
          this.setState({
            stateCurrent: page,
            stateCurrentInputValue: page
          });
        }
        // this.$emit('input', page)
        this.$emit('change', page, this.statePageSize);
        return page;
      }
      return this.stateCurrent;
    },
    runIfEnter: function runIfEnter(event, callback) {
      if (event.key === 'Enter' || event.charCode === 13) {
        for (var _len = arguments.length, restParams = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          restParams[_key - 2] = arguments[_key];
        }

        callback.apply(undefined, (0, _toConsumableArray3['default'])(restParams));
      }
    },
    runIfEnterPrev: function runIfEnterPrev(event) {
      this.runIfEnter(event, this.prev);
    },
    runIfEnterNext: function runIfEnterNext(event) {
      this.runIfEnter(event, this.next);
    },
    runIfEnterJumpPrev: function runIfEnterJumpPrev(event) {
      this.runIfEnter(event, this.jumpPrev);
    },
    runIfEnterJumpNext: function runIfEnterJumpNext(event) {
      this.runIfEnter(event, this.jumpNext);
    },
    getJumpPrevPage: function getJumpPrevPage() {
      return Math.max(1, this.stateCurrent - (this.showLessItems ? 3 : 5));
    },
    getJumpNextPage: function getJumpNextPage() {
      return Math.min(this.calculatePage(), this.stateCurrent + (this.showLessItems ? 3 : 5));
    },
    jumpPrev: function jumpPrev() {
      this.handleChange(this.getJumpPrevPage());
    },
    jumpNext: function jumpNext() {
      this.handleChange(this.getJumpNextPage());
    }
  },
  render: function render() {
    var h = arguments[0];

    // When hideOnSinglePage is true and there is only 1 page, hide the pager
    if (this.hideOnSinglePage === true && this.total <= this.statePageSize) {
      return null;
    }

    var locale = this.locale;

    var prefixCls = this.prefixCls;
    var allPages = this.calculatePage();
    var pagerList = [];
    var jumpPrev = null;
    var jumpNext = null;
    var firstPager = null;
    var lastPager = null;
    var gotoButton = null;
    var goButton = this.showQuickJumper && this.showQuickJumper.goButton;
    var pageBufferSize = this.showLessItems ? 1 : 2;
    var stateCurrent = this.stateCurrent,
        statePageSize = this.statePageSize;

    var prevPage = stateCurrent - 1 > 0 ? stateCurrent - 1 : 0;
    var nextPage = stateCurrent + 1 < allPages ? stateCurrent + 1 : allPages;

    if (this.simple) {
      if (goButton) {
        if (typeof goButton === 'boolean') {
          gotoButton = h(
            'button',
            {
              attrs: {
                type: 'button'
              },
              on: {
                'click': this.handleGoTO,
                'keyup': this.handleGoTO
              }
            },
            [locale.jump_to_confirm]
          );
        } else {
          gotoButton = h(
            'span',
            {
              on: {
                'click': this.handleGoTO,
                'keyup': this.handleGoTO
              }
            },
            [goButton]
          );
        }
        gotoButton = h(
          'li',
          {
            attrs: {
              title: this.showTitle ? '' + locale.jump_to + this.stateCurrent + '/' + allPages : null
            },
            'class': prefixCls + '-simple-pager'
          },
          [gotoButton]
        );
      }
      var hasPrev = this.hasPrev();
      var hasNext = this.hasNext();
      return h(
        'ul',
        { 'class': prefixCls + ' ' + prefixCls + '-simple' },
        [h(
          'li',
          {
            attrs: {
              title: this.showTitle ? locale.prev_page : null,

              tabIndex: hasPrev ? 0 : null,

              'aria-disabled': !this.hasPrev()
            },
            on: {
              'click': this.prev,
              'keypress': this.runIfEnterPrev
            },

            'class': (hasPrev ? '' : prefixCls + '-disabled') + ' ' + prefixCls + '-prev' },
          [this.itemRender(prevPage, 'prev', h('a', { 'class': prefixCls + '-item-link' }))]
        ), h(
          'li',
          {
            attrs: {
              title: this.showTitle ? stateCurrent + '/' + allPages : null
            },
            'class': prefixCls + '-simple-pager'
          },
          [h('input', {
            attrs: {
              type: 'text',

              size: '3'
            },
            domProps: {
              'value': this.stateCurrentInputValue
            },
            on: {
              'keydown': this.handleKeyDown,
              'keyup': this.handleKeyUp,
              'input': this.handleKeyUp
            }
          }), h(
            'span',
            { 'class': prefixCls + '-slash' },
            ['\uFF0F']
          ), allPages]
        ), h(
          'li',
          {
            attrs: {
              title: this.showTitle ? locale.next_page : null,

              tabIndex: this.hasNext ? 0 : null,

              'aria-disabled': !this.hasNext()
            },
            on: {
              'click': this.next,
              'keypress': this.runIfEnterNext
            },

            'class': (hasNext ? '' : prefixCls + '-disabled') + ' ' + prefixCls + '-next' },
          [this.itemRender(nextPage, 'next', h('a', { 'class': prefixCls + '-item-link' }))]
        ), gotoButton]
      );
    }
    if (allPages <= 5 + pageBufferSize * 2) {
      for (var i = 1; i <= allPages; i++) {
        var active = stateCurrent === i;
        pagerList.push(h(_Pager2['default'], {
          attrs: {
            locale: locale,
            rootPrefixCls: prefixCls,

            page: i,
            active: active,
            showTitle: this.showTitle,
            itemRender: this.itemRender
          },
          on: {
            'click': this.handleChange,
            'keypress': this.runIfEnter
          },

          key: i }));
      }
    } else {
      var prevItemTitle = this.showLessItems ? locale.prev_3 : locale.prev_5;
      var nextItemTitle = this.showLessItems ? locale.next_3 : locale.next_5;
      if (this.showPrevNextJumpers) {
        jumpPrev = h(
          'li',
          {
            attrs: {
              title: this.showTitle ? prevItemTitle : null,

              tabIndex: '0'
            },
            key: 'prev',
            on: {
              'click': this.jumpPrev,
              'keypress': this.runIfEnterJumpPrev
            },

            'class': prefixCls + '-jump-prev'
          },
          [this.itemRender(this.getJumpPrevPage(), 'jump-prev', h('a', { 'class': prefixCls + '-item-link' }))]
        );
        jumpNext = h(
          'li',
          {
            attrs: {
              title: this.showTitle ? nextItemTitle : null,

              tabIndex: '0'
            },
            key: 'next', on: {
              'click': this.jumpNext,
              'keypress': this.runIfEnterJumpNext
            },

            'class': prefixCls + '-jump-next'
          },
          [this.itemRender(this.getJumpNextPage(), 'jump-next', h('a', { 'class': prefixCls + '-item-link' }))]
        );
      }

      lastPager = h(_Pager2['default'], {
        attrs: {
          locale: locale,
          last: true,
          rootPrefixCls: prefixCls,

          page: allPages,
          active: false,
          showTitle: this.showTitle,
          itemRender: this.itemRender
        },
        on: {
          'click': this.handleChange,
          'keypress': this.runIfEnter
        },

        key: allPages });
      firstPager = h(_Pager2['default'], {
        attrs: {
          locale: locale,
          rootPrefixCls: prefixCls,

          page: 1,
          active: false,
          showTitle: this.showTitle,
          itemRender: this.itemRender
        },
        on: {
          'click': this.handleChange,
          'keypress': this.runIfEnter
        },

        key: 1 });

      var left = Math.max(1, stateCurrent - pageBufferSize);
      var right = Math.min(stateCurrent + pageBufferSize, allPages);

      if (stateCurrent - 1 <= pageBufferSize) {
        right = 1 + pageBufferSize * 2;
      }

      if (allPages - stateCurrent <= pageBufferSize) {
        left = allPages - pageBufferSize * 2;
      }

      for (var _i = left; _i <= right; _i++) {
        var _active = stateCurrent === _i;
        pagerList.push(h(_Pager2['default'], {
          attrs: {
            locale: locale,
            rootPrefixCls: prefixCls,

            page: _i,
            active: _active,
            showTitle: this.showTitle,
            itemRender: this.itemRender
          },
          on: {
            'click': this.handleChange,
            'keypress': this.runIfEnter
          },

          key: _i }));
      }

      if (stateCurrent - 1 >= pageBufferSize * 2 && stateCurrent !== 1 + 2) {
        pagerList[0] = h(_Pager2['default'], {
          attrs: {
            locale: locale,
            rootPrefixCls: prefixCls,

            page: left,

            active: false,
            showTitle: this.showTitle,
            itemRender: this.itemRender
          },
          on: {
            'click': this.handleChange,
            'keypress': this.runIfEnter
          },

          key: left, 'class': prefixCls + '-item-after-jump-prev' });
        pagerList.unshift(jumpPrev);
      }
      if (allPages - stateCurrent >= pageBufferSize * 2 && stateCurrent !== allPages - 2) {
        pagerList[pagerList.length - 1] = h(_Pager2['default'], {
          attrs: {
            locale: locale,
            rootPrefixCls: prefixCls,

            page: right,

            active: false,
            showTitle: this.showTitle,
            itemRender: this.itemRender
          },
          on: {
            'click': this.handleChange,
            'keypress': this.runIfEnter
          },

          key: right, 'class': prefixCls + '-item-before-jump-next' });
        pagerList.push(jumpNext);
      }

      if (left !== 1) {
        pagerList.unshift(firstPager);
      }
      if (right !== allPages) {
        pagerList.push(lastPager);
      }
    }

    var totalText = null;

    if (this.showTotal) {
      totalText = h(
        'li',
        { 'class': prefixCls + '-total-text' },
        [this.showTotal(this.total, [(stateCurrent - 1) * statePageSize + 1, stateCurrent * statePageSize > this.total ? this.total : stateCurrent * statePageSize])]
      );
    }
    var prevDisabled = !this.hasPrev();
    var nextDisabled = !this.hasNext();
    var buildOptionText = this.buildOptionText || this.$scopedSlots.buildOptionText;
    return h(
      'ul',
      {
        'class': '' + prefixCls,
        attrs: { unselectable: 'unselectable'
        },
        ref: 'paginationNode'
      },
      [totalText, h(
        'li',
        {
          attrs: {
            title: this.showTitle ? locale.prev_page : null,

            tabIndex: prevDisabled ? null : 0,

            'aria-disabled': prevDisabled
          },
          on: {
            'click': this.prev,
            'keypress': this.runIfEnterPrev
          },

          'class': (!prevDisabled ? '' : prefixCls + '-disabled') + ' ' + prefixCls + '-prev' },
        [this.itemRender(prevPage, 'prev', h('a', { 'class': prefixCls + '-item-link' }))]
      ), pagerList, h(
        'li',
        {
          attrs: {
            title: this.showTitle ? locale.next_page : null,

            tabIndex: nextDisabled ? null : 0,

            'aria-disabled': nextDisabled
          },
          on: {
            'click': this.next,
            'keypress': this.runIfEnterNext
          },

          'class': (!nextDisabled ? '' : prefixCls + '-disabled') + ' ' + prefixCls + '-next' },
        [this.itemRender(nextPage, 'next', h('a', { 'class': prefixCls + '-item-link' }))]
      ), h(_Options2['default'], {
        attrs: {
          locale: locale,
          rootPrefixCls: prefixCls,
          selectComponentClass: this.selectComponentClass,
          selectPrefixCls: this.selectPrefixCls,
          changeSize: this.showSizeChanger ? this.changePageSize : null,
          current: stateCurrent,
          pageSize: statePageSize,
          pageSizeOptions: this.pageSizeOptions,
          buildOptionText: buildOptionText || null,
          quickGo: this.showQuickJumper ? this.handleChange : null,
          goButton: goButton
        }
      })]
    );
  }
};
module.exports = exports['default'];