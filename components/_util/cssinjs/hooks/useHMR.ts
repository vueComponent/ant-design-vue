function useProdHMR() {
  return false;
}

let webpackHMR = false;
let viteHMR = false;

function useDevHMR() {
  return webpackHMR || viteHMR;
}

export default process.env.NODE_ENV === 'production' ? useProdHMR : useDevHMR;

// Webpack `module.hot.accept` do not support any deps update trigger
// We have to hack handler to force mark as HRM
if (
  process.env.NODE_ENV !== 'production' &&
  ((typeof module !== 'undefined' &&
    module &&
    // @ts-ignore
    module.hot) ||
    // @ts-ignore
    import.meta.hot)
) {
  const win = window as any;

  if (typeof win.webpackHotUpdate === 'function') {
    const originWebpackHotUpdate = win.webpackHotUpdate;

    win.webpackHotUpdate = (...args: any[]) => {
      webpackHMR = true;
      setTimeout(() => {
        webpackHMR = false;
      }, 0);
      return originWebpackHotUpdate(...args);
    };
    // @ts-ignore
  } else if (import.meta.hot) {
    viteHMR = true;
  }
}
