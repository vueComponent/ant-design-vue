import getScrollBarSize from './getScrollBarSize';

export default close => {
  const bodyIsOverflowing =
    document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) &&
    window.innerWidth > document.body.offsetWidth;
  if (!bodyIsOverflowing) {
    return;
  }
  if (close) {
    document.body.style.position = '';
    document.body.style.width = '';
    return;
  }
  const scrollBarSize = getScrollBarSize();
  if (scrollBarSize) {
    document.body.style.position = 'relative';
    document.body.style.width = `calc(100% - ${scrollBarSize}px)`;
  }
};
