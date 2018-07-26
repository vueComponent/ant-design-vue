import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../../_util/vue-types';
import { measureScrollbar } from './utils';
import BaseTable from './BaseTable';

export default {
  name: 'BodyTable',
  props: {
    fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    columns: PropTypes.array.isRequired,
    tableClassName: PropTypes.string.isRequired,
    handleBodyScroll: PropTypes.func.isRequired,
    getRowKey: PropTypes.func.isRequired,
    expander: PropTypes.object.isRequired,
    isAnyColumnsFixed: PropTypes.bool
  },
  inject: {
    table: { 'default': {} }
  },
  mounted: function mounted() {
    this.updateTableRef();
  },
  updated: function updated() {
    this.updateTableRef();
  },

  methods: {
    updateTableRef: function updateTableRef() {
      this.$refs.fixedColumnsBodyLeft && this.table.saveChildrenRef('fixedColumnsBodyLeft', this.$refs.fixedColumnsBodyLeft);
      this.$refs.fixedColumnsBodyRight && this.table.saveChildrenRef('fixedColumnsBodyRight', this.$refs.fixedColumnsBodyRight);
      this.$refs.bodyTable && this.table.saveChildrenRef('bodyTable', this.$refs.bodyTable);
    }
  },
  render: function render() {
    var h = arguments[0];
    var _table = this.table,
        prefixCls = _table.prefixCls,
        scroll = _table.scroll;
    var columns = this.columns,
        fixed = this.fixed,
        tableClassName = this.tableClassName,
        getRowKey = this.getRowKey,
        handleBodyScroll = this.handleBodyScroll,
        expander = this.expander,
        isAnyColumnsFixed = this.isAnyColumnsFixed;
    var useFixedHeader = this.table.useFixedHeader;

    var bodyStyle = _extends({}, this.table.bodyStyle);
    var innerBodyStyle = {};

    if (scroll.x || fixed) {
      bodyStyle.overflowX = bodyStyle.overflowX || 'auto';
      // Fix weired webkit render bug
      // https://github.com/ant-design/ant-design/issues/7783
      bodyStyle.WebkitTransform = 'translate3d (0, 0, 0)';
    }

    if (scroll.y) {
      // maxHeight will make fixed-Table scrolling not working
      // so we only set maxHeight to body-Table here
      var maxHeight = bodyStyle.maxHeight || scroll.y;
      maxHeight = typeof maxHeight === 'number' ? maxHeight + 'px' : maxHeight;
      if (fixed) {
        innerBodyStyle.maxHeight = maxHeight;
        innerBodyStyle.overflowY = bodyStyle.overflowY || 'scroll';
      } else {
        bodyStyle.maxHeight = maxHeight;
      }
      bodyStyle.overflowY = bodyStyle.overflowY || 'scroll';
      useFixedHeader = true;

      // Add negative margin bottom for scroll bar overflow bug
      var scrollbarWidth = measureScrollbar();
      if (scrollbarWidth > 0 && fixed) {
        bodyStyle.marginBottom = '-' + scrollbarWidth + 'px';
        bodyStyle.paddingBottom = '0px';
      }
    }

    var baseTable = h(BaseTable, {
      attrs: {
        tableClassName: tableClassName,
        hasHead: !useFixedHeader,
        hasBody: true,
        fixed: fixed,
        columns: columns,
        expander: expander,
        getRowKey: getRowKey,
        isAnyColumnsFixed: isAnyColumnsFixed
      }
    });

    if (fixed && columns.length) {
      var refName = void 0;
      if (columns[0].fixed === 'left' || columns[0].fixed === true) {
        refName = 'fixedColumnsBodyLeft';
      } else if (columns[0].fixed === 'right') {
        refName = 'fixedColumnsBodyRight';
      }
      delete bodyStyle.overflowX;
      delete bodyStyle.overflowY;
      return h(
        'div',
        {
          key: 'bodyTable',
          'class': prefixCls + '-body-outer',
          style: _extends({}, bodyStyle)
        },
        [h(
          'div',
          {
            'class': prefixCls + '-body-inner',
            style: innerBodyStyle,
            ref: refName,
            on: {
              'scroll': handleBodyScroll
            }
          },
          [baseTable]
        )]
      );
    }
    return h(
      'div',
      {
        key: 'bodyTable',
        'class': prefixCls + '-body',
        style: bodyStyle,
        ref: 'bodyTable',
        on: {
          'scroll': handleBodyScroll
        }
      },
      [baseTable]
    );
  }
};