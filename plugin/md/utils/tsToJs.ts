import { transformSync } from '@babel/core';
import { CLIEngine } from 'eslint';
const engine = new CLIEngine({
  fix: true,
  useEslintrc: false,
});
const tsToJs = (content: string): string => {
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
  const report = engine.executeOnText(code);
  let output = report.results[0].output;
  output = output ? output.trim() : output;
  return output;
};

export default tsToJs;
