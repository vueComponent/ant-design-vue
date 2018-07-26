
import PropTypes from '../_util/vue-types';
import KEYCODE from './KeyCode';
import BaseMixin from '../_util/BaseMixin';

export default {
  mixins: [BaseMixin],
  props: {
    rootPrefixCls: PropTypes.String,
    selectPrefixCls: PropTypes.String,
    changeSize: PropTypes.func,
    quickGo: PropTypes.func,
    selectComponentClass: PropTypes.any,
    current: PropTypes.number,
    pageSizeOptions: PropTypes.array.def(['10', '20', '30', '40']),
    pageSize: PropTypes.number,
    buildOptionText: PropTypes.func,
    locale: PropTypes.object,
    goButton: PropTypes.any
  },
  data: function data() {
    return {
      goInputText: '',
      stateCurrent: this.current
    };
  },

  methods: {
    defaultBuildOptionText: function defaultBuildOptionText(opt) {
      return opt.value + ' ' + this.locale.items_per_page;
    },
    handleChange: function handleChange(e) {
      this.setState({
        goInputText: e.target.value
      });
    },
    go: function go(e) {
      var val = this.goInputText;
      if (val === '') {
        return;
      }
      val = Number(val);
      if (isNaN(val)) {
        val = this.stateCurrent;
      }
      if (e.keyCode === KEYCODE.ENTER || e.type === 'click') {
        this.setState({
          goInputText: '',
          stateCurrent: this.quickGo(val)
        });
      }
    }
  },
  render: function render() {
    var _this = this;

    var h = arguments[0];
    var rootPrefixCls = this.rootPrefixCls,
        locale = this.locale,
        changeSize = this.changeSize,
        quickGo = this.quickGo,
        goButton = this.goButton,
        Select = this.selectComponentClass,
        defaultBuildOptionText = this.defaultBuildOptionText;

    var prefixCls = rootPrefixCls + '-options';
    var changeSelect = null;
    var goInput = null;
    var gotoButton = null;

    if (!(changeSize || quickGo)) {
      return null;
    }

    if (changeSize && Select) {
      var Option = Select.Option;
      var pageSize = this.pageSize || this.pageSizeOptions[0];
      var buildOptionText = this.buildOptionText || defaultBuildOptionText;
      var options = this.pageSizeOptions.map(function (opt, i) {
        return h(
          Option,
          { key: i, attrs: { value: opt }
          },
          [buildOptionText({ value: opt })]
        );
      });

      changeSelect = h(
        Select,
        {
          attrs: {
            prefixCls: this.selectPrefixCls,
            showSearch: false,

            optionLabelProp: 'children',
            dropdownMatchSelectWidth: false,
            value: pageSize.toString(),

            getPopupContainer: function getPopupContainer(triggerNode) {
              return triggerNode.parentNode;
            }
          },
          'class': prefixCls + '-size-changer', on: {
            'change': function change(value) {
              return _this.changeSize(Number(value));
            }
          }
        },
        [options]
      );
    }

    if (quickGo) {
      if (goButton) {
        if (typeof goButton === 'boolean') {
          gotoButton = h(
            'button',
            {
              attrs: {
                type: 'button'
              },
              on: {
                'click': this.go,
                'keyup': this.go
              }
            },
            [locale.jump_to_confirm]
          );
        } else {
          gotoButton = h(
            'span',
            {
              on: {
                'click': this.go,
                'keyup': this.go
              }
            },
            [goButton]
          );
        }
      }
      goInput = h(
        'div',
        { 'class': prefixCls + '-quick-jumper' },
        [locale.jump_to, h('input', {
          attrs: {
            type: 'text'
          },
          domProps: {
            'value': this.goInputText
          },
          on: {
            'input': this.handleChange,
            'keyup': this.go
          }
        }), locale.page, gotoButton]
      );
    }

    return h(
      'li',
      { 'class': '' + prefixCls },
      [changeSelect, goInput]
    );
  }
};