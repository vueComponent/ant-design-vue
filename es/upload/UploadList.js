import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import BaseMixin from '../_util/BaseMixin';
import { getOptionProps, initDefaultProps } from '../_util/props-util';
import getTransitionProps from '../_util/getTransitionProps';
import Icon from '../icon';
import Tooltip from '../tooltip';
import Progress from '../progress';
import classNames from 'classnames';
import { UploadListProps } from './interface';

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

export default {
  name: 'AUploadList',
  mixins: [BaseMixin],
  props: initDefaultProps(UploadListProps, {
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

    var _getOptionProps = getOptionProps(this),
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
      var icon = h(Icon, {
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
          icon = h(Icon, { 'class': prefixCls + '-list-item-thumbnail', attrs: { type: 'picture' }
          });
        } else {
          var thumbnail = isImageUrl(file.thumbUrl || file.url) ? h('img', {
            attrs: { src: file.thumbUrl || file.url, alt: file.name }
          }) : h(Icon, {
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
          props: _extends({}, _this2.progressAttr, {
            type: 'line',
            percent: file.percent
          })
          // show loading icon if upload progress listener is disabled
        };var loadingProgress = 'percent' in file ? h(Progress, progressProps) : null;

        progress = h(
          'div',
          { 'class': prefixCls + '-list-item-progress', key: 'progress' },
          [loadingProgress]
        );
      }
      var infoUploadingClass = classNames((_classNames = {}, _defineProperty(_classNames, prefixCls + '-list-item', true), _defineProperty(_classNames, prefixCls + '-list-item-' + file.status, true), _classNames));
      var preview = file.url ? h(
        'a',
        _mergeJSXProps([file.linkProps, {
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
        [h(Icon, {
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
      var iconProps1 = _extends({}, iconProps, { props: { type: 'cross' } });
      var removeIcon = showRemoveIcon ? h(Icon, iconProps) : null;
      var removeIconCross = showRemoveIcon ? h(Icon, iconProps1) : null;
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
        Tooltip,
        {
          attrs: { title: message }
        },
        [icon, preview]
      ) : h('span', [icon, preview]);
      var transitionProps = getTransitionProps('fade');
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
    var listClassNames = classNames((_classNames2 = {}, _defineProperty(_classNames2, prefixCls + '-list', true), _defineProperty(_classNames2, prefixCls + '-list-' + listType, true), _classNames2));
    var animationDirection = listType === 'picture-card' ? 'animate-inline' : 'animate';
    var transitionGroupProps = getTransitionProps(prefixCls + '-' + animationDirection);
    return h(
      'transition-group',
      _mergeJSXProps([transitionGroupProps, {
        attrs: {
          tag: 'div'
        },
        'class': listClassNames
      }]),
      [list]
    );
  }
};