export default function FooterRow(props, { slots }) {
  return <tr {...props}>{slots.default?.()}</tr>;
}
