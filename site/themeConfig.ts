import less from 'less';
// import { getThemeVariables } from 'ant-design-vue/dist/theme';
const themeConfig = [
  {
    theme: 'dark',
    htmlThemeAttr: 'dark',
    modifyVars: {
      // ...getThemeVariables({ dark: true }),
      'text-color': 'fade(@white, 65%)',
      'gray-8': '@text-color',
      'background-color-base': '#555',
      'skeleton-color': 'rgba(0,0,0,0.8)',
    },
  },
];
const additionalData = async (content: string, filename: string): Promise<string> => {
  const themePromises = themeConfig.map(async t => {
    const { htmlThemeAttr, modifyVars = {} } = t;
    const options = {
      javascriptEnabled: true,
      modifyVars,
      relativeUrls: true,
      filename,
    };
    try {
      const { css } = await less.render(content, options);
      let res = '';
      if (htmlThemeAttr && css) {
        res = `
        [data-doc-theme=${htmlThemeAttr}] {
          ${css}
        }
        `;
      }
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(content);
    }
  });
  let res = content;
  for (const themePromise of themePromises) {
    const theme = await themePromise;
    res += theme;
  }
  return res;
};

export default themeConfig;
export { themeConfig, additionalData };
