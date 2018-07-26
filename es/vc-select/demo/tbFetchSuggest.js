
import jsonp from 'jsonp';
import querystring from 'querystring';
var timeout = void 0;
var currentValue = void 0;

export function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  function fake() {
    var str = querystring.encode({
      code: 'utf-8',
      q: value
    });
    jsonp('http://suggest.taobao.com/sug?' + str, function (err, d) {
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