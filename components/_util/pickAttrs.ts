const attributes = `accept acceptcharset accesskey action allowfullscreen allowtransparency
alt async autocomplete autofocus autoplay capture cellpadding cellspacing challenge
charset checked classid classname colspan cols content contenteditable contextmenu
controls coords crossorigin data datetime default defer dir disabled download draggable
enctype form formaction formenctype formmethod formnovalidate formtarget frameborder
headers height hidden high href hreflang htmlfor for httpequiv icon id inputmode integrity
is keyparams keytype kind label lang list loop low manifest marginheight marginwidth max maxlength media
mediagroup method min minlength multiple muted name novalidate nonce open
optimum pattern placeholder poster preload radiogroup readonly rel required
reversed role rowspan rows sandbox scope scoped scrolling seamless selected
shape size sizes span spellcheck src srcdoc srclang srcset start step style
summary tabindex target title type usemap value width wmode wrap`;

const eventsName = `onCopy onCut onPaste onCompositionend onCompositionstart onCompositionupdate onKeydown
    onKeypress onKeyup onFocus onBlur onChange onInput onSubmit onClick onContextmenu onDoubleclick onDblclick
    onDrag onDragend onDragenter onDragexit onDragleave onDragover onDragstart onDrop onMousedown
    onMouseenter onMouseleave onMousemove onMouseout onMouseover onMouseup onSelect onTouchcancel
    onTouchend onTouchmove onTouchstart onTouchstartPassive onTouchmovePassive onScroll onWheel onAbort onCanplay onCanplaythrough
    onDurationchange onEmptied onEncrypted onEnded onError onLoadeddata onLoadedmetadata
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
  let mergedConfig;
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
      (mergedConfig.attr && (propList.includes(key) || propList.includes(key.toLowerCase())))
    ) {
      attrs[key] = props[key];
    }
  });
  return attrs;
}
