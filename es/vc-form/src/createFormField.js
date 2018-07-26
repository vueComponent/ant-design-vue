import _extends from "babel-runtime/helpers/extends";
import _classCallCheck from "babel-runtime/helpers/classCallCheck";

var Field = function Field(fields) {
  _classCallCheck(this, Field);

  _extends(this, fields);
};

export function isFormField(obj) {
  return obj instanceof Field;
}

export default function createFormField(field) {
  if (isFormField(field)) {
    return field;
  }
  return new Field(field);
}