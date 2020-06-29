// matchMedia polyfill for
// https://github.com/WickyNilliams/enquire.js/issues/82
let enquire;

// TODO: Will be removed in antd 4.0 because we will no longer support ie9
if (typeof window !== 'undefined') {
  const matchMediaPolyfill = mediaQuery => {
    return {
      media: mediaQuery,
      matches: false,
      addListener() {},
      removeListener() {},
    };
  };
  // ref: https://github.com/ant-design/ant-design/issues/18774
  if (!window.matchMedia) window.matchMedia = matchMediaPolyfill;
  // eslint-disable-next-line global-require
  enquire = require('enquire.js');
}

export const responsiveArray = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];

export const responsiveMap = {
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)',
};

let subscribers = [];
let subUid = -1;
let screens = {};

const responsiveObserve = {
  dispatch(pointMap) {
    screens = pointMap;
    if (subscribers.length < 1) {
      return false;
    }

    subscribers.forEach(item => {
      item.func(screens);
    });

    return true;
  },
  subscribe(func) {
    if (subscribers.length === 0) {
      this.register();
    }
    const token = (++subUid).toString();
    subscribers.push({
      token,
      func,
    });
    func(screens);
    return token;
  },
  unsubscribe(token) {
    subscribers = subscribers.filter(item => item.token !== token);
    if (subscribers.length === 0) {
      this.unregister();
    }
  },
  unregister() {
    Object.keys(responsiveMap).map(screen => enquire.unregister(responsiveMap[screen]));
  },
  register() {
    Object.keys(responsiveMap).map(screen =>
      enquire.register(responsiveMap[screen], {
        match: () => {
          const pointMap = {
            ...screens,
            [screen]: true,
          };
          this.dispatch(pointMap);
        },
        unmatch: () => {
          const pointMap = {
            ...screens,
            [screen]: false,
          };
          this.dispatch(pointMap);
        },
        // Keep a empty destroy to avoid triggering unmatch when unregister
        destroy() {},
      }),
    );
  },
};

export default responsiveObserve;
