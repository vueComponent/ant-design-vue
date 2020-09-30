const attributes = `accept acceptCharset accessKey action allowFullScreen allowTransparency
    alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing challenge
    charSet checked classID className colSpan cols content contentEditable contextMenu
    controls coords crossOrigin data dateTime default defer dir disabled download draggable
    encType form formAction formEncType formMethod formNoValidate formTarget frameBorder
    headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity
    is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media
    mediaGroup method min minLength multiple muted name noValidate nonce open
    optimum pattern placeholder poster preload radioGroup readOnly rel required
    reversed role rowSpan rows sandbox scope scoped scrolling seamless selected
    shape size sizes span spellCheck src srcDoc srcLang srcSet start step style
    summary tabIndex target title type useMap value width wmode wrap`;

const eventsName = `onCopy onCut onPaste onCompositionend onCompositionstart onCompositionupdate onKeydown
    onKeypress onKeyup onFocus onBlur onChange onInput onSubmit onClick onContextmenu onDoubleclick onDblclick
    onDrag onDragend onDragenter onDragexit onDragleave onDragover onDragstart onDrop onMousedown
    onMouseenter onMouseleave onMousemove onMouseout onMouseover onMouseup onSelect onTouchcancel
    onTouchend onTouchmove onTouchstart onScroll onWheel onAbort onCanplay onCanplaythrough
    onDurationchange onEmptied onEncrypted onEnded onError onLoadedsata onLoadedmetadata
    onLoadstart onPause onPlay onPlaying onProgress onRatechange onSeeked onSeeking onStalled onSuspend onTimeupdate onVolumechange onWaiting onLoad onError`;

const propList = `${attributes} ${eventsName}`.split(/[\s\n]+/);

/* eslint-enable max-len */
const ariaPrefix = 'aria-';
const dataPrefix = 'data-';

function match(key: string, prefix: string) {
  return key.indexOf(prefix) === 0;
}

export interface PickConfig {
  aria?: boolean;
  data?: boolean;
  attr?: boolean;
}

/**
 * Picker props from exist props with filter
 * @param props Passed props
 * @param ariaOnly boolean | { aria?: boolean; data?: boolean; attr?: boolean; } filter config
 */
export default function pickAttrs(props: object, ariaOnly: boolean | PickConfig = false) {
  let mergedConfig: PickConfig;
  if (ariaOnly === false) {
    mergedConfig = {
      aria: true,
      data: true,
      attr: true,
    };
  } else if (ariaOnly === true) {
    mergedConfig = {
      aria: true,
    };
  } else {
    mergedConfig = {
      ...ariaOnly,
    };
  }

  const attrs = {};
  Object.keys(props).forEach(key => {
    if (
      // Aria
      (mergedConfig.aria && (key === 'role' || match(key, ariaPrefix))) ||
      // Data
      (mergedConfig.data && match(key, dataPrefix)) ||
      // Attr
      (mergedConfig.attr && propList.includes(key))
    ) {
      attrs[key] = props[key];
    }
  });
  return attrs;
}
