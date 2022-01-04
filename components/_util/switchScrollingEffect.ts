import getScrollBarSize from './getScrollBarSize';
import setStyle from './setStyle';

function isBodyOverflowing() {
  return (
    document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) &&
    window.innerWidth > document.body.offsetWidth
  );
}

let cacheStyle = {};

export default (close?: boolean) => {
  if (!isBodyOverflowing() && !close) {
    return;
  }

  // https://github.com/ant-design/ant-design/issues/19729
  const scrollingEffectClassName = 'ant-scrolling-effect';
  const scrollingEffectClassNameReg = new RegExp(`${scrollingEffectClassName}`, 'g');
  const bodyClassName = document.body.className;

  if (close) {
    if (!scrollingEffectClassNameReg.test(bodyClassName)) return;
    setStyle(cacheStyle);
    cacheStyle = {};
    document.body.className = bodyClassName.replace(scrollingEffectClassNameReg, '').trim();
    return;
  }

  const scrollBarSize = getScrollBarSize();
  if (scrollBarSize) {
    cacheStyle = setStyle({
      position: 'relative',
      width: `calc(100% - ${scrollBarSize}px)`,
    });
    if (!scrollingEffectClassNameReg.test(bodyClassName)) {
      const addClassName = `${bodyClassName} ${scrollingEffectClassName}`;
      document.body.className = addClassName.trim();
    }
  }
};
