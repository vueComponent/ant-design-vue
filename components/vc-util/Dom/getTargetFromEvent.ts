export default function getTargetFromEvent(e: Event) {
  const target = e.target as HTMLElement;

  // get target if in shadow dom
  if (e.composed && target.shadowRoot) {
    return (e.composedPath?.()[0] || target) as HTMLElement;
  }

  return target;
}
