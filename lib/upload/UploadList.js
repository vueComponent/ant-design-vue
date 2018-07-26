'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

var _getTransitionProps = require('../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _tooltip = require('../tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _progress = require('../progress');

var _progress2 = _interopRequireDefault(_progress);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _interface = require('./interface');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
var previewFile = function previewFile(file, callback) {
  var reader = new window.FileReader();
  reader.onloadend = function () {
    return callback(reader.result);
  };
  reader.readAsDataURL(file);
};

var isImageUrl = function isImageUrl(url) {
  return (/^data:image\//.test(url) || /\.(webp|svg|png|gif|jpg|jpeg)$/.test(url)
  );
};

exports['default'] = {
  name: 'AUploadList',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(_interface.UploadListProps, {
    listType: 'text', // or picture
    progressAttr: {
      strokeWidth: 2,
      showInfo: false
    },
    prefixCls: 'ant-upload',
    showRemoveIcon: true,
    showPreviewIcon: true
  }),
  updated: function updated() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.listType !== 'picture' && _this.listType !== 'picture-card') {
        return;
      }
      (_this.items || []).forEach(function (file) {
        if (typeof document === 'undefined' || typeof window === 'undefined' || !window.FileReader || !window.File || !(file.originFileObj instanceof window.File) || file.thumbUrl !== undefined) {
          return;
        }
        /*eslint-disable */
        file.thumbUrl = '';
        /*eslint -enable */
        previewFile(file.originFileObj, function (previewDataUrl) {
          /*eslint-disable */
          file.thumbUrl = previewDataUrl;
          /*eslint -enable todo */
          // this.forceUpdate()
        });
      });
    });
  },

  methods: {
    handleClose: function handleClose(file) {
      this.$emit('remove', file);
    },
    handlePreview: function handlePreview(file, e) {
      var preview = this.$listeners.preview;

      if (!preview) {
        return;
      }
      e.preventDefault();
      return this.$emit('preview', file);
    }
  },
  render: function render() {
    var _this2 = this,
        _classNames2;

    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        prefixCls = _getOptionProps.prefixCls,
        _getOptionProps$items = _getOptionProps.items,
        items = _getOptionProps$items === undefined ? [] : _getOptionProps$items,
        listType = _getOptionProps.listType,
        showPreviewIcon = _getOptionProps.showPreviewIcon,
        showRemoveIcon = _getOptionProps.showRemoveIcon,
        locale = _getOptionProps.locale;

    var list = items.map(function (file) {
      var _classNames;

      var progress = void 0;
      var icon = h(_icon2['default'], {
        attrs: { type: file.status === 'uploading' ? 'loading' : 'paper-clip' }
      });

      if (listType === 'picture' || listType === 'picture-card') {
        if (listType === 'picture-card' && file.status === 'uploading') {
          icon = h(
            'div',
            { 'class': prefixCls + '-list-item-uploading-text' },
            [locale.uploading]
          );
        } else if (!file.thumbUrl && !file.url) {
          icon = h(_icon2['default'], { 'class': prefixCls + '-list-item-thumbnail', attrs: { type: 'picture' }
          });
        } else {
          var thumbnail = isImageUrl(file.thumbUrl || file.url) ? h('img', {
            attrs: { src: file.thumbUrl || file.url, alt: file.name }
          }) : h(_icon2['default'], {
            attrs: {
              type: 'file'
            },
            style: { fontSize: '48px', color: 'rgba(0,0,0,0.5)' }
          });
          icon = h(
            'a',
            {
              'class': prefixCls + '-list-item-thumbnail',
              on: {
                'click': function click(e) {
                  return _this2.handlePreview(file, e);
                }
              },
              attrs: {
                href: file.url || file.thumbUrl,
                target: '_blank',
                rel: 'noopener noreferrer'
              }
            },
            [thumbnail]
          );
        }
      }

      if (file.status === 'uploading') {
        var progressProps = {
          props: (0, _extends3['default'])({}, _this2.progressAttr, {
            type: 'line',
            percent: file.percent
          })
          // show loading icon if upload progress listener is disabled
        };var loadingProgress = 'percent' in file ? h(_progress2['default'], progressProps) : null;

        progress = h(
          'div',
          { 'class': prefixCls + '-list-item-progress', key: 'progress' },
          [loadingProgress]
        );
      }
      var infoUploadingClass = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-list-item', true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-list-item-' + file.status, true), _classNames));
      var preview = file.url ? h(
        'a',
        (0, _babelHelperVueJsxMergeProps2['default'])([file.linkProps, {
          attrs: {
            href: file.url,
            target: '_blank',
            rel: 'noopener noreferrer',

            title: file.name
          },
          'class': prefixCls + '-list-item-name',
          on: {
            'click': function click(e) {
              return _this2.handlePreview(file, e);
            }
          }
        }]),
        [file.name]
      ) : h(
        'span',
        {
          'class': prefixCls + '-list-item-name',
          on: {
            'click': function click(e) {
              return _this2.handlePreview(file, e);
            }
          },
          attrs: {
            title: file.name
          }
        },
        [file.name]
      );
      var style = file.url || file.thumbUrl ? undefined : {
        pointerEvents: 'none',
        opacity: 0.5
      };
      var previewIcon = showPreviewIcon ? h(
        'a',
        {
          attrs: {
            href: file.url || file.thumbUrl,
            target: '_blank',
            rel: 'noopener noreferrer',

            title: locale.previewFile
          },
          style: style,
          on: {
            'click': function click(e) {
              return _this2.handlePreview(file, e);
            }
          }
        },
        [h(_icon2['default'], {
          attrs: { type: 'eye-o' }
        })]
      ) : null;
      var iconProps = {
        props: {
          type: 'delete',
          title: locale.removeFile
        },
        on: {
          click: function click() {
            _this2.handleClose(file);
          }
        }
      };
      var iconProps1 = (0, _extends3['default'])({}, iconProps, { props: { type: 'cross' } });
      var removeIcon = showRemoveIcon ? h(_icon2['default'], iconProps) : null;
      var removeIconCross = showRemoveIcon ? h(_icon2['default'], iconProps1) : null;
      var actions = listType === 'picture-card' && file.status !== 'uploading' ? h(
        'span',
        { 'class': prefixCls + '-list-item-actions' },
        [previewIcon, removeIcon]
      ) : removeIconCross;
      var message = void 0;
      if (file.response && typeof file.response === 'string') {
        message = file.response;
      } else {
        message = file.error && file.error.statusText || locale.uploadError;
      }
      var iconAndPreview = file.status === 'error' ? h(
        _tooltip2['default'],
        {
          attrs: { title: message }
        },
        [icon, preview]
      ) : h('span', [icon, preview]);
      var transitionProps = (0, _getTransitionProps2['default'])('fade');
      return h(
        'div',
        { 'class': infoUploadingClass, key: file.uid },
        [h(
          'div',
          { 'class': prefixCls + '-list-item-info' },
          [iconAndPreview]
        ), actions, h(
          'transition',
          transitionProps,
          [progress]
        )]
      );
    });
    var listClassNames = (0, _classnames2['default'])((_classNames2 = {}, (0, _defineProperty3['default'])(_classNames2, prefixCls + '-list', true), (0, _defineProperty3['default'])(_classNames2, prefixCls + '-list-' + listType, true), _classNames2));
    var animationDirection = listType === 'picture-card' ? 'animate-inline' : 'animate';
    var transitionGroupProps = (0, _getTransitionProps2['default'])(prefixCls + '-' + animationDirection);
    return h(
      'transition-group',
      (0, _babelHelperVueJsxMergeProps2['default'])([transitionGroupProps, {
        attrs: {
          tag: 'div'
        },
        'class': listClassNames
      }]),
      [list]
    );
  }
};
module.exports = exports['default'];