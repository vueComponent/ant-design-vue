import { transformSync } from '@babel/core';
import { ESLint } from 'eslint';
import path from 'path';
const engine = new ESLint({
  fix: true,
  useEslintrc: false,
  baseConfig: require(path.join(process.cwd(), '.eslintrc.js')),
});
const tsToJs = async (content: string): Promise<string> => {
  if (!content) {
    return '';
  }
  const { code } = transformSync(content, {
    configFile: false,
    plugins: [
      [
        require.resolve('@babel/plugin-transform-typescript'),
        {
          isTSX: false,
        },
      ],
    ],
  });
  const report = await engine.lintText(code);
  let output = report[0].output;
  output = output ? output.trim() : output;
  return output;
};

export default tsToJs;
