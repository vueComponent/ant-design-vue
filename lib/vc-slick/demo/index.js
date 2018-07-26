'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SimpleSlider = require('./SimpleSlider');

var _SimpleSlider2 = _interopRequireDefault(_SimpleSlider);

var _SlideChangeHooks = require('./SlideChangeHooks');

var _SlideChangeHooks2 = _interopRequireDefault(_SlideChangeHooks);

var _MultipleItems = require('./MultipleItems');

var _MultipleItems2 = _interopRequireDefault(_MultipleItems);

var _MultipleRows = require('./MultipleRows');

var _MultipleRows2 = _interopRequireDefault(_MultipleRows);

var _Responsive = require('./Responsive');

var _Responsive2 = _interopRequireDefault(_Responsive);

var _Resizable = require('./Resizable');

var _Resizable2 = _interopRequireDefault(_Resizable);

var _UnevenSetsInfinite = require('./UnevenSetsInfinite');

var _UnevenSetsInfinite2 = _interopRequireDefault(_UnevenSetsInfinite);

var _UnevenSetsFinite = require('./UnevenSetsFinite');

var _UnevenSetsFinite2 = _interopRequireDefault(_UnevenSetsFinite);

var _CenterMode = require('./CenterMode');

var _CenterMode2 = _interopRequireDefault(_CenterMode);

var _FocusOnSelect = require('./FocusOnSelect');

var _FocusOnSelect2 = _interopRequireDefault(_FocusOnSelect);

var _AutoPlay = require('./AutoPlay');

var _AutoPlay2 = _interopRequireDefault(_AutoPlay);

var _AutoPlayMethods = require('./AutoPlayMethods');

var _AutoPlayMethods2 = _interopRequireDefault(_AutoPlayMethods);

var _PauseOnHover = require('./PauseOnHover');

var _PauseOnHover2 = _interopRequireDefault(_PauseOnHover);

var _Rtl = require('./Rtl');

var _Rtl2 = _interopRequireDefault(_Rtl);

var _VariableWidth = require('./VariableWidth');

var _VariableWidth2 = _interopRequireDefault(_VariableWidth);

var _AdaptiveHeight = require('./AdaptiveHeight');

var _AdaptiveHeight2 = _interopRequireDefault(_AdaptiveHeight);

var _LazyLoad = require('./LazyLoad');

var _LazyLoad2 = _interopRequireDefault(_LazyLoad);

var _Fade = require('./Fade');

var _Fade2 = _interopRequireDefault(_Fade);

var _SlickGoTo = require('./SlickGoTo');

var _SlickGoTo2 = _interopRequireDefault(_SlickGoTo);

var _CustomArrows = require('./CustomArrows');

var _CustomArrows2 = _interopRequireDefault(_CustomArrows);

var _PreviousNextMethods = require('./PreviousNextMethods');

var _PreviousNextMethods2 = _interopRequireDefault(_PreviousNextMethods);

var _DynamicSlides = require('./DynamicSlides');

var _DynamicSlides2 = _interopRequireDefault(_DynamicSlides);

var _VerticalMode = require('./VerticalMode');

var _VerticalMode2 = _interopRequireDefault(_VerticalMode);

var _SwipeToSlide = require('./SwipeToSlide');

var _SwipeToSlide2 = _interopRequireDefault(_SwipeToSlide);

var _VerticalSwipeToSlide = require('./VerticalSwipeToSlide');

var _VerticalSwipeToSlide2 = _interopRequireDefault(_VerticalSwipeToSlide);

var _CustomPaging = require('./CustomPaging');

var _CustomPaging2 = _interopRequireDefault(_CustomPaging);

var _CustomSlides = require('./CustomSlides');

var _CustomSlides2 = _interopRequireDefault(_CustomSlides);

var _AsNavFor = require('./AsNavFor');

var _AsNavFor2 = _interopRequireDefault(_AsNavFor);

var _AppendDots = require('./AppendDots');

var _AppendDots2 = _interopRequireDefault(_AppendDots);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  render: function render() {
    var h = arguments[0];

    return h(
      'div',
      { 'class': 'content' },
      [h(_SimpleSlider2['default']), h(_MultipleItems2['default']), h(_MultipleRows2['default']), h(_Responsive2['default']), h(_Resizable2['default']), h(_UnevenSetsInfinite2['default']), h(_UnevenSetsFinite2['default']), h(_CenterMode2['default']), h(_FocusOnSelect2['default']), h(_AutoPlay2['default']), h(_AutoPlayMethods2['default']), h(_PauseOnHover2['default']), h(_Rtl2['default']), h(_VariableWidth2['default']), h(_AdaptiveHeight2['default']), h(_LazyLoad2['default']), h(_Fade2['default']), h(_SlideChangeHooks2['default']), h(_SlickGoTo2['default']), h(_CustomPaging2['default']), h(_CustomArrows2['default']), h(_CustomSlides2['default']), h(_PreviousNextMethods2['default']), h(_DynamicSlides2['default']), h(_VerticalMode2['default']), h(_SwipeToSlide2['default']), h(_VerticalSwipeToSlide2['default']), h(_AsNavFor2['default']), h(_AppendDots2['default'])]
    );
  }
};
module.exports = exports['default'];