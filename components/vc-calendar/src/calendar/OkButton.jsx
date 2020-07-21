function noop() {}
const OkButton = (_, { attrs }) => {
  const { prefixCls, locale, okDisabled, onOk } = attrs;
  let className = `${prefixCls}-ok-btn`;
  if (okDisabled) {
    className += ` ${prefixCls}-ok-btn-disabled`;
  }
  return (
    <a class={className} role="button" onClick={okDisabled ? noop : onOk}>
      {locale.ok}
    </a>
  );
};

OkButton.inheritAttrs = false;
export default OkButton;
