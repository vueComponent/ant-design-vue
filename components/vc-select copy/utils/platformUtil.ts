/* istanbul ignore file */
export function isPlatformMac(): boolean {
  return /(mac\sos|macintosh)/i.test(navigator.appVersion);
}
