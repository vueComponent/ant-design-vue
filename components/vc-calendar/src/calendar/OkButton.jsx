function noop() {}
export default {
  functional: true,
  render(createElement, context) {
    const { props, listeners = {} } = context;
    const { prefixCls, locale, okDisabled } = props;
    const { ok = noop } = listeners;
    let className = `${prefixCls}-ok-btn`;
    if (okDisabled) {
      className += ` ${prefixCls}-ok-btn-disabled`;
    }
    return (
      <a class={className} role="button" onClick={okDisabled ? noop : ok}>
        {locale.ok}
      </a>
    );
  },
};
