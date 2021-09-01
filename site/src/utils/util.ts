export function isZhCN(name: string): boolean {
  return /-cn\/?$/.test(name);
}

export function isLocalStorageNameSupported() {
  const testKey = 'test';
  const storage = window.localStorage;
  try {
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}

export function getLocalizedPathname(
  path: string,
  zhCN?: boolean,
  query = {},
  hash?: {
    zhCN: string;
    enUS: string;
  },
): {
  path: string;
  query: Record<string, any>;
} {
  const pathname = path.startsWith('/') ? path : `/${path}`;
  let fullPath;
  if (!zhCN) {
    // to enUS
    fullPath = /\/?index-cn/.test(pathname) ? '/' : pathname.replace('-cn', '');
  } else if (pathname === '/') {
    fullPath = '/index-cn';
  } else if (pathname.endsWith('/')) {
    fullPath = pathname.replace(/\/$/, '-cn/');
  } else {
    fullPath = `${pathname}-cn`;
  }

  if (hash) {
    const localHash = hash[zhCN ? 'zhCN' : 'enUS'];
    fullPath += `#${localHash}`;
  }
  return { path: fullPath, query };
}
