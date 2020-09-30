const TransBtn = (
  _,
  { attrs: { class: className, customizeIcon, customizeIconProps, onMousedown, onClick }, slots },
) => {
  let icon;

  if (typeof customizeIcon === 'function') {
    icon = customizeIcon(customizeIconProps);
  } else {
    icon = customizeIcon;
  }

  return (
    <span
      class={className}
      onMousedown={event => {
        event.preventDefault();
        if (onMousedown) {
          onMousedown(event);
        }
      }}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      unselectable="on"
      onClick={onClick}
      aria-hidden
    >
      {icon !== undefined ? (
        icon
      ) : (
        <span class={className.split(/\s+/).map(cls => `${cls}-icon`)}>{slots?.default()}</span>
      )}
    </span>
  );
};

TransBtn.inheritAttrs = false;

export default TransBtn;
