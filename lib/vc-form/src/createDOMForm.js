'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _domScrollIntoView = require('dom-scroll-into-view');

var _domScrollIntoView2 = _interopRequireDefault(_domScrollIntoView);

var _has = require('lodash/has');

var _has2 = _interopRequireDefault(_has);

var _createBaseForm = require('./createBaseForm');

var _createBaseForm2 = _interopRequireDefault(_createBaseForm);

var _createForm = require('./createForm');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function computedStyle(el, prop) {
  var getComputedStyle = window.getComputedStyle;
  var style =
  // If we have getComputedStyle
  getComputedStyle
  // Query it
  // TODO: From CSS-Query notes, we might need (node, null) for FF
  ? getComputedStyle(el)

  // Otherwise, we are in IE and use currentStyle
  : el.currentStyle;
  if (style) {
    return style[
    // Switch to camelCase for CSSOM
    // DEV: Grabbed from jQuery
    // https://github.com/jquery/jquery/blob/1.9-stable/src/css.js#L191-L194
    // https://github.com/jquery/jquery/blob/1.9-stable/src/core.js#L593-L597
    prop.replace(/-(\w)/gi, function (word, letter) {
      return letter.toUpperCase();
    })];
  }
  return undefined;
}

function getScrollableContainer(n) {
  var node = n;
  var nodeName = void 0;
  /* eslint no-cond-assign:0 */
  while ((nodeName = node.nodeName.toLowerCase()) !== 'body') {
    var overflowY = computedStyle(node, 'overflowY');
    // https://stackoverflow.com/a/36900407/3040605
    if (node !== n && (overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
      return node;
    }
    node = node.parentNode;
  }
  return nodeName === 'body' ? node.ownerDocument : node;
}

var mixin = {
  methods: {
    getForm: function getForm() {
      return (0, _extends3['default'])({}, _createForm.mixin.methods.getForm.call(this), {
        validateFieldsAndScroll: this.validateFieldsAndScroll
      });
    },
    validateFieldsAndScroll: function validateFieldsAndScroll(ns, opt, cb) {
      var _this = this;

      var _getParams = (0, _utils.getParams)(ns, opt, cb),
          names = _getParams.names,
          callback = _getParams.callback,
          options = _getParams.options;

      var newCb = function newCb(error, values) {
        if (error) {
          var validNames = _this.fieldsStore.getValidFieldsName();
          var firstNode = void 0;
          var firstTop = void 0;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = validNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var name = _step.value;

              if ((0, _has2['default'])(error, name)) {
                var instance = _this.getFieldInstance(name);
                if (instance) {
                  var node = instance.$el || instance.elm;
                  var top = node.getBoundingClientRect().top;
                  if (firstTop === undefined || firstTop > top) {
                    firstTop = top;
                    firstNode = node;
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          if (firstNode) {
            var c = options.container || getScrollableContainer(firstNode);
            (0, _domScrollIntoView2['default'])(firstNode, c, (0, _extends3['default'])({
              onlyScrollIfNeeded: true
            }, options.scroll));
          }
        }

        if (typeof callback === 'function') {
          callback(error, values);
        }
      };

      return this.validateFields(names, options, newCb);
    }
  }

};

function createDOMForm(option) {
  return (0, _createBaseForm2['default'])((0, _extends3['default'])({}, option), [mixin]);
}

exports['default'] = createDOMForm;
module.exports = exports['default'];