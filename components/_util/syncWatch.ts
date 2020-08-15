export default function syncWatch(fn) {
  return {
    handler: fn,
    flush: 'sync',
  };
}
