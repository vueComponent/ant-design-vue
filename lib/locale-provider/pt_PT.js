'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pt_PT = require('../vc-pagination/locale/pt_PT');

var _pt_PT2 = _interopRequireDefault(_pt_PT);

var _pt_PT3 = require('../date-picker/locale/pt_PT');

var _pt_PT4 = _interopRequireDefault(_pt_PT3);

var _pt_PT5 = require('../time-picker/locale/pt_PT');

var _pt_PT6 = _interopRequireDefault(_pt_PT5);

var _pt_PT7 = require('../calendar/locale/pt_PT');

var _pt_PT8 = _interopRequireDefault(_pt_PT7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'pt',
  Pagination: _pt_PT2['default'],
  DatePicker: _pt_PT4['default'],
  TimePicker: _pt_PT6['default'],
  Calendar: _pt_PT8['default'],
  Table: {
    filterTitle: 'Filtro',
    filterConfirm: 'Aplicar',
    filterReset: 'Reiniciar',
    emptyText: 'Sem resultados',
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
    notFoundContent: 'Sem resultados',
    searchPlaceholder: 'Procurar...',
    itemUnit: 'item',
    itemsUnit: 'itens'
  },
  Select: {
    notFoundContent: 'Sem resultados'
  },
  Upload: {
    uploading: 'A carregar...',
    removeFile: 'Remover',
    uploadError: 'Erro ao carregar',
    previewFile: 'Pré-visualizar'
  }
};
module.exports = exports['default'];