'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetch = fetch;

var _jsonp = require('jsonp');

var _jsonp2 = _interopRequireDefault(_jsonp);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var timeout = void 0;
var currentValue = void 0;

function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  function fake() {
    var str = _querystring2['default'].encode({
      code: 'utf-8',
      q: value
    });
    (0, _jsonp2['default'])('http://suggest.taobao.com/sug?' + str, function (err, d) {
      // eslint-disable-line
      if (currentValue === value) {
        var result = d.result;
        var data = [];
        result.forEach(function (r) {
          data.push({
            value: r[0],
            text: r[0]
          });
        });
        callback(data);
      }
    });
  }

  timeout = setTimeout(fake, 300);
}