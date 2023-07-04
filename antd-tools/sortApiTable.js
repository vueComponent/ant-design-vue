const program = require('commander');
const majo = require('majo');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const unified = require('unified');
const parse = require('remark-parse');
const stringify = require('remark-stringify');

const yamlConfig = require('remark-yaml-config');
const frontmatter = require('remark-frontmatter');

let fileAPIs = {};
const remarkWithYaml = unified()
  .use(parse)
  .use(stringify, {
    paddedTable: false,
    listItemIndent: 1,
    stringLength: () => 3,
  })
  .use(frontmatter)
  .use(yamlConfig);

const stream = majo.majo();

function getCellValue(node) {
  return node.children[0].children[0].value;
}

// from small to large
const sizeBreakPoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

const whiteMethodList = ['afterChange', 'beforeChange'];

const groups = {
  isDynamic: val => /^on[A-Z]/.test(val) || whiteMethodList.indexOf(val) > -1,
  isSize: val => sizeBreakPoints.indexOf(val) > -1,
};

function asciiSort(prev, next) {
  if (prev > next) {
    return 1;
  }

  if (prev < next) {
    return -1;
  }

  return 0;
}

// follow the alphabet order
function alphabetSort(nodes) {
  // use toLowerCase to keep `case insensitive`
  return nodes.sort((...comparison) =>
    asciiSort(...comparison.map(val => getCellValue(val).toLowerCase())),
  );
}

function sizeSort(nodes) {
  return nodes.sort((...comparison) =>
    asciiSort(...comparison.map(val => sizeBreakPoints.indexOf(getCellValue(val).toLowerCase()))),
  );
}

function sort(ast, filename) {
  const nameMatch = filename.match(/^components\/([^/]*)\//);
  const componentName = nameMatch[1];
  fileAPIs[componentName] = fileAPIs[componentName] || {
    static: new Set(),
    size: new Set(),
    dynamic: new Set(),
  };

  ast.children.forEach(child => {
    const staticProps = [];
    // prefix with `on`
    const dynamicProps = [];
    // one of ['xs', 'sm', 'md', 'lg', 'xl']
    const sizeProps = [];

    // find table markdown type
    if (child.type === 'table') {
      // slice will create new array, so sort can affect the original array.
      // slice(1) cut down the thead
      child.children.slice(1).forEach(node => {
        const value = getCellValue(node);
        if (groups.isDynamic(value)) {
          dynamicProps.push(node);
          fileAPIs[componentName].dynamic.add(value);
        } else if (groups.isSize(value)) {
          sizeProps.push(node);
          fileAPIs[componentName].size.add(value);
        } else {
          staticProps.push(node);
          fileAPIs[componentName].static.add(value);
        }
      });

      // eslint-disable-next-line
      child.children = [
        child.children[0],
        ...alphabetSort(staticProps),
        ...sizeSort(sizeProps),
        ...alphabetSort(dynamicProps),
      ];
    }
  });

  return ast;
}

function sortAPI(md, filename) {
  return remarkWithYaml.stringify(sort(remarkWithYaml.parse(md), filename));
}

function sortMiddleware(ctx) {
  Object.keys(ctx.files).forEach(filename => {
    const content = ctx.fileContents(filename);
    ctx.writeContents(filename, sortAPI(content, filename));
  });
}

module.exports = () => {
  fileAPIs = {};

  program
    .version('0.1.0')
    .option(
      '-f, --file [file]',
      'Specify which file to be transformed',
      // default value
      'components/**/index.+(zh-CN|en-US).md',
    )
    .option('-o, --output [output]', 'Specify component api output path', '~component-api.json')
    .parse(process.argv);
  // Get the markdown file all need to be transformed

  /* eslint-disable no-console */
  stream
    .source(program.file)
    .use(sortMiddleware)
    .dest('.')
    .then(() => {
      if (program.output) {
        const data = {};
        Object.keys(fileAPIs).forEach(componentName => {
          data[componentName] = {
            static: [...fileAPIs[componentName].static],
            size: [...fileAPIs[componentName].size],
            dynamic: [...fileAPIs[componentName].dynamic],
          };
        });

        const reportPath = path.resolve(program.output);
        fs.writeFileSync(reportPath, JSON.stringify(data, null, 2), 'utf8');
        console.log(chalk.cyan(`API list file: ${reportPath}`));
      }
    })
    .then(() => {
      console.log(chalk.green(`sort ant-design-vue api successfully!`));
    });
  /* eslint-enable no-console */
};
