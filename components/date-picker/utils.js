const isFunction = function(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};

export function formatDate(value, format) {
  if (!value) {
    return '';
  }
  if (Array.isArray(format)) {
    format = format[0];
  }
  if (isFunction(format)) {
    const result = format(value);
    if (typeof result === 'string') {
      return result;
    } else {
      throw new Error('The function of format does not return a string');
    }
  }
  return value.format(format);
}
