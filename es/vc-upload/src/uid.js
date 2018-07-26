var now = +new Date();
var index = 0;

export default function uid() {
  return "vc-upload-" + now + "-" + ++index;
}