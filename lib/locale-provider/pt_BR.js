'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pt_BR = require('../vc-pagination/locale/pt_BR');

var _pt_BR2 = _interopRequireDefault(_pt_BR);

var _pt_BR3 = require('../date-picker/locale/pt_BR');

var _pt_BR4 = _interopRequireDefault(_pt_BR3);

var _pt_BR5 = require('../time-picker/locale/pt_BR');

var _pt_BR6 = _interopRequireDefault(_pt_BR5);

var _pt_BR7 = require('../calendar/locale/pt_BR');

var _pt_BR8 = _interopRequireDefault(_pt_BR7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'pt-br',
  Pagination: _pt_BR2['default'],
  DatePicker: _pt_BR4['default'],
  TimePicker: _pt_BR6['default'],
  Calendar: _pt_BR8['default'],
  Table: {
    filterTitle: 'Filtro',
    filterConfirm: 'OK',
    filterReset: 'Resetar',
    emptyText: 'Não há dados',
    selectAll: 'Selecionar página atual',
    selectInvert: 'Inverter seleção'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Cancelar',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Cancelar'
  },
  Transfer: {
    notFoundContent: 'Não encontrado',
    searchPlaceholder: 'Procurar',
    itemUnit: 'item',
    itemsUnit: 'items'
  },
  Select: {
    notFoundContent: 'Não encontrado'
  },
  Upload: {
    uploading: 'Enviando...',
    removeFile: 'Remover arquivo',
    uploadError: 'Erro no envio',
    previewFile: 'Visualizar arquivo'
  }
};
module.exports = exports['default'];