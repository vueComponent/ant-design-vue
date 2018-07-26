'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _zh_CN = require('../vc-pagination/locale/zh_CN');

var _zh_CN2 = _interopRequireDefault(_zh_CN);

var _zh_CN3 = require('../date-picker/locale/zh_CN');

var _zh_CN4 = _interopRequireDefault(_zh_CN3);

var _zh_CN5 = require('../time-picker/locale/zh_CN');

var _zh_CN6 = _interopRequireDefault(_zh_CN5);

var _zh_CN7 = require('../calendar/locale/zh_CN');

var _zh_CN8 = _interopRequireDefault(_zh_CN7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'zh-cn',
  Pagination: _zh_CN2['default'],
  DatePicker: _zh_CN4['default'],
  TimePicker: _zh_CN6['default'],
  Calendar: _zh_CN8['default'],
  Table: {
    filterTitle: '筛选',
    filterConfirm: '确定',
    filterReset: '重置',
    emptyText: '暂无数据',
    selectAll: '全选当页',
    selectInvert: '反选当页'
  },
  Modal: {
    okText: '确定',
    cancelText: '取消',
    justOkText: '知道了'
  },
  Popconfirm: {
    cancelText: '取消',
    okText: '确定'
  },
  Transfer: {
    notFoundContent: '无匹配结果',
    searchPlaceholder: '请输入搜索内容',
    itemUnit: '项',
    itemsUnit: '项'
  },
  Select: {
    notFoundContent: '无匹配结果'
  },
  Upload: {
    uploading: '文件上传中',
    removeFile: '删除文件',
    uploadError: '上传错误',
    previewFile: '预览文件'
  }
};
module.exports = exports['default'];