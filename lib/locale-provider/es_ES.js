'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _es_ES = require('../vc-pagination/locale/es_ES');

var _es_ES2 = _interopRequireDefault(_es_ES);

var _es_ES3 = require('../date-picker/locale/es_ES');

var _es_ES4 = _interopRequireDefault(_es_ES3);

var _es_ES5 = require('../time-picker/locale/es_ES');

var _es_ES6 = _interopRequireDefault(_es_ES5);

var _es_ES7 = require('../calendar/locale/es_ES');

var _es_ES8 = _interopRequireDefault(_es_ES7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'es',
  Pagination: _es_ES2['default'],
  DatePicker: _es_ES4['default'],
  TimePicker: _es_ES6['default'],
  Calendar: _es_ES8['default'],
  Table: {
    filterTitle: 'Filtrar menú',
    filterConfirm: 'Aceptar',
    filterReset: 'Reiniciar',
    emptyText: 'No hay datos',
    selectAll: 'Seleccionar todo',
    selectInvert: 'Invertir selección'
  },
  Modal: {
    okText: 'Aceptar',
    cancelText: 'Cancelar',
    justOkText: 'Aceptar'
  },
  Popconfirm: {
    okText: 'Aceptar',
    cancelText: 'Cancelar'
  },
  Transfer: {
    notFoundContent: 'No encontrado',
    searchPlaceholder: 'Buscar aquí',
    itemUnit: 'elemento',
    itemsUnit: 'elementos'
  },
  Select: {
    notFoundContent: 'No encontrado'
  },
  Upload: {
    uploading: 'Subiendo...',
    removeFile: 'Eliminar archivo',
    uploadError: 'Error al subir el archivo',
    previewFile: 'Vista previa'
  }
};
module.exports = exports['default'];