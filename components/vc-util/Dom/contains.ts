export default function contains(root: HTMLElement | null | undefined, n?: HTMLElement) {
  if (!root) {
    return false;
  }

  return root.contains(n);
}
