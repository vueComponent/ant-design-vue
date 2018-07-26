'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ko_KR = require('../vc-pagination/locale/ko_KR');

var _ko_KR2 = _interopRequireDefault(_ko_KR);

var _ko_KR3 = require('../date-picker/locale/ko_KR');

var _ko_KR4 = _interopRequireDefault(_ko_KR3);

var _ko_KR5 = require('../time-picker/locale/ko_KR');

var _ko_KR6 = _interopRequireDefault(_ko_KR5);

var _ko_KR7 = require('../calendar/locale/ko_KR');

var _ko_KR8 = _interopRequireDefault(_ko_KR7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'ko',
  Pagination: _ko_KR2['default'],
  DatePicker: _ko_KR4['default'],
  TimePicker: _ko_KR6['default'],
  Calendar: _ko_KR8['default'],
  Table: {
    filterTitle: '필터 메뉴',
    filterConfirm: '확인',
    filterReset: '초기화',
    emptyText: '데이터 없음'
  },
  Modal: {
    okText: '확인',
    cancelText: '취소',
    justOkText: '확인'
  },
  Popconfirm: {
    okText: '확인',
    cancelText: '취소'
  },
  Transfer: {
    notFoundContent: '데이터 없음',
    searchPlaceholder: '여기에 검색하세요',
    itemUnit: '개',
    itemsUnit: '개'
  },
  Select: {
    notFoundContent: '데이터 없음'
  },
  Upload: {
    uploading: '업로드 중...',
    removeFile: '파일 삭제',
    uploadError: '업로드 실패',
    previewFile: '파일 미리보기'
  }
};
module.exports = exports['default'];