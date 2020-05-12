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
    return format(value);
  }
  return value.format(format);
}
