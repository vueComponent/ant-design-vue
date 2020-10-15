import PropTypes from '../../_util/vue-types';
import Trigger from '../../vc-trigger';
import DropdownMenu from './DropdownMenu';
import { OptionProps } from './Option';
import { PlaceMent } from './placement';

const BUILT_IN_PLACEMENTS = {
  bottomRight: {
    points: ['tl', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topRight: {
    points: ['bl', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
};

export default {
  name: 'KeywordTrigger',
  props: {
    loading: PropTypes.looseBool,
    options: PropTypes.arrayOf(OptionProps),
    prefixCls: PropTypes.string,
    placement: PropTypes.oneOf(PlaceMent),
    visible: PropTypes.looseBool,
    transitionName: PropTypes.string,
    getPopupContainer: PropTypes.func,
  },
  methods: {
    getDropdownPrefix() {
      return `${this.$props.prefixCls}-dropdown`;
    },
    getDropdownElement() {
      const { options } = this.$props;
      return <DropdownMenu prefixCls={this.getDropdownPrefix()} options={options} />;
    },
  },

  render() {
    const { visible, placement, transitionName, getPopupContainer } = this.$props;

    const { $slots } = this;

    const children = $slots.default?.();

    const popupElement = this.getDropdownElement();

    return (
      <Trigger
        prefixCls={this.getDropdownPrefix()}
        popupVisible={visible}
        popup={popupElement}
        popupPlacement={placement === 'top' ? 'topRight' : 'bottomRight'}
        popupTransitionName={transitionName}
        builtinPlacements={BUILT_IN_PLACEMENTS}
        getPopupContainer={getPopupContainer}
      >
        {children}
      </Trigger>
    );
  },
};
