import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';

import PropTypes from '../_util/vue-types';
import { initDefaultProps, getOptionProps } from '../_util/props-util';
import VcRate from '../vc-rate';
import Icon from '../icon';

export var RateProps = {
  prefixCls: PropTypes.string,
  count: PropTypes.number,
  value: PropTypes.value,
  defaultValue: PropTypes.value,
  allowHalf: PropTypes.bool,
  allowClear: PropTypes.bool,
  disabled: PropTypes.bool,
  character: PropTypes.any,
  autoFocus: PropTypes.bool
};

export default {
  name: 'ARate',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: initDefaultProps(RateProps, {
    prefixCls: 'ant-rate'
  }),
  methods: {
    focus: function focus() {
      this.$refs.refRate.focus();
    },
    blur: function blur() {
      this.$refs.refRate.blur();
    }
  },
  render: function render() {
    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        character = _getOptionProps.character,
        restProps = _objectWithoutProperties(_getOptionProps, ['character']);

    var slotCharacter = this.$slots.character;
    var rateProps = {
      props: _extends({
        character: character
      }, restProps),
      on: this.$listeners,
      ref: 'refRate'
    };
    var slotCharacterHtml = slotCharacter !== undefined ? h(
      'template',
      { slot: 'character' },
      [slotCharacter]
    ) : h(Icon, { slot: 'character', attrs: { type: 'star' }
    });
    return h(
      VcRate,
      rateProps,
      [character === undefined ? slotCharacterHtml : null]
    );
  }
};