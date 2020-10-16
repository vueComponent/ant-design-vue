export default function contains(root: Node | null | undefined, n?: Node) {
  if (!root) {
    return false;
  }

  return root.contains(n);
}
