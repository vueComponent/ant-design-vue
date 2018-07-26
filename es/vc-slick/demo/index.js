import SimpleSlider from './SimpleSlider';
import SlideChangeHooks from './SlideChangeHooks';
import MultipleItems from './MultipleItems';
import MultipleRows from './MultipleRows';
import Responsive from './Responsive';
import Resizable from './Resizable';
import UnevenSetsInfinite from './UnevenSetsInfinite';
import UnevenSetsFinite from './UnevenSetsFinite';
import CenterMode from './CenterMode';
import FocusOnSelect from './FocusOnSelect';
import AutoPlay from './AutoPlay';
import AutoPlayMethods from './AutoPlayMethods';
import PauseOnHover from './PauseOnHover';
import Rtl from './Rtl';
import VariableWidth from './VariableWidth';
import AdaptiveHeight from './AdaptiveHeight';
import LazyLoad from './LazyLoad';
import Fade from './Fade';
import SlickGoTo from './SlickGoTo';
import CustomArrows from './CustomArrows';
import PreviousNextMethods from './PreviousNextMethods';
import DynamicSlides from './DynamicSlides';
import VerticalMode from './VerticalMode';
import SwipeToSlide from './SwipeToSlide';
import VerticalSwipeToSlide from './VerticalSwipeToSlide';
import CustomPaging from './CustomPaging';
import CustomSlides from './CustomSlides';
import AsNavFor from './AsNavFor';
import AppendDots from './AppendDots';

export default {
  render: function render() {
    var h = arguments[0];

    return h(
      'div',
      { 'class': 'content' },
      [h(SimpleSlider), h(MultipleItems), h(MultipleRows), h(Responsive), h(Resizable), h(UnevenSetsInfinite), h(UnevenSetsFinite), h(CenterMode), h(FocusOnSelect), h(AutoPlay), h(AutoPlayMethods), h(PauseOnHover), h(Rtl), h(VariableWidth), h(AdaptiveHeight), h(LazyLoad), h(Fade), h(SlideChangeHooks), h(SlickGoTo), h(CustomPaging), h(CustomArrows), h(CustomSlides), h(PreviousNextMethods), h(DynamicSlides), h(VerticalMode), h(SwipeToSlide), h(VerticalSwipeToSlide), h(AsNavFor), h(AppendDots)]
    );
  }
};