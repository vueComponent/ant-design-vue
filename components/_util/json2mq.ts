/**
 * source by `json2mq`
 * https://github.com/akiran/json2mq.git
 */

const camel2hyphen = function (str: string) {
  return str
    .replace(/[A-Z]/g, function (match) {
      return '-' + match.toLowerCase();
    })
    .toLowerCase();
};

const isDimension = function (feature: string) {
  const re = /[height|width]$/;
  return re.test(feature);
};

const obj2mq = function (obj: { [x: string]: any }) {
  let mq = '';
  const features = Object.keys(obj);
  features.forEach(function (feature, index) {
    let value = obj[feature];
    feature = camel2hyphen(feature);
    // Add px to dimension features
    if (isDimension(feature) && typeof value === 'number') {
      value = value + 'px';
    }
    if (value === true) {
      mq += feature;
    } else if (value === false) {
      mq += 'not ' + feature;
    } else {
      mq += '(' + feature + ': ' + value + ')';
    }
    if (index < features.length - 1) {
      mq += ' and ';
    }
  });
  return mq;
};

export default function (query: any[]) {
  let mq = '';
  if (typeof query === 'string') {
    return query;
  }
  // Handling array of media queries
  if (query instanceof Array) {
    query.forEach(function (q, index) {
      mq += obj2mq(q);
      if (index < query.length - 1) {
        mq += ', ';
      }
    });
    return mq;
  }
  // Handling single media query
  return obj2mq(query);
}
