function Panel(_, { slots }) {
  return <div>{slots.default?.()}</div>;
}

Panel.displayName = 'Panel';

export default Panel;
