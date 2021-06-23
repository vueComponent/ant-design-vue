// copy from https://github.com/sudodoki/toggle-selection
// refactor to esm
const deselectCurrent = (): (() => void) => {
  const selection = document.getSelection();
  if (!selection.rangeCount) {
    return function () {};
  }
  let active = document.activeElement as any;

  const ranges = [];
  for (let i = 0; i < selection.rangeCount; i++) {
    ranges.push(selection.getRangeAt(i));
  }

  switch (
    active.tagName.toUpperCase() // .toUpperCase handles XHTML
  ) {
    case 'INPUT':
    case 'TEXTAREA':
      active.blur();
      break;

    default:
      active = null;
      break;
  }

  selection.removeAllRanges();
  return function () {
    selection.type === 'Caret' && selection.removeAllRanges();

    if (!selection.rangeCount) {
      ranges.forEach(function (range) {
        selection.addRange(range);
      });
    }

    active && active.focus();
  };
};
export default deselectCurrent;
