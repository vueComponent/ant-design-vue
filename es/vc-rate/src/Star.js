import PropTypes from '../../_util/vue-types';

function noop() {}

export default {
  name: 'Star',
  props: {
    value: PropTypes.number,
    index: PropTypes.number,
    prefixCls: PropTypes.string,
    allowHalf: PropTypes.bool,
    disabled: PropTypes.bool,
    character: PropTypes.any,
    focused: PropTypes.bool
  },
  methods: {
    onHover: function onHover(e) {
      var index = this.index;

      this.$emit('hover', e, index);
    },
    onClick: function onClick(e) {
      var index = this.index;

      this.$emit('click', e, index);
    },
    getClassName: function getClassName() {
      var prefixCls = this.prefixCls,
          index = this.index,
          value = this.value,
          allowHalf = this.allowHalf,
          focused = this.focused;

      var starValue = index + 1;
      var className = prefixCls;
      if (value === 0 && index === 0 && focused) {
        className += ' ' + prefixCls + '-focused';
      } else if (allowHalf && value + 0.5 === starValue) {
        className += ' ' + prefixCls + '-half ' + prefixCls + '-active';
        if (focused) {
          className += ' ' + prefixCls + '-focused';
        }
      } else {
        className += starValue <= value ? ' ' + prefixCls + '-full' : ' ' + prefixCls + '-zero';
        if (starValue === value && focused) {
          className += ' ' + prefixCls + '-focused';
        }
      }
      return className;
    }
  },
  render: function render() {
    var h = arguments[0];
    var onHover = this.onHover,
        onClick = this.onClick,
        disabled = this.disabled,
        prefixCls = this.prefixCls;

    var character = this.character;
    if (character === undefined) {
      character = this.$slots.character;
    }
    return h(
      'li',
      {
        'class': this.getClassName(),
        on: {
          'click': disabled ? noop : onClick,
          'mousemove': disabled ? noop : onHover
        }
      },
      [h(
        'div',
        { 'class': prefixCls + '-first' },
        [character]
      ), h(
        'div',
        { 'class': prefixCls + '-second' },
        [character]
      )]
    );
  }
};