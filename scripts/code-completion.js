const { version, install } = require('../lib/index');
const { default: PropTypes } = require('../lib/_util/vue-types/index');
const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');

/**
 * copy from vuetify
 * @param filePath
 */
function ensureDirectoryExists(filePath) {
  const folderPath = path.resolve(path.dirname(filePath));
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}

/**
 * copy from vuetify
 * @param filePath
 */
function writeJsonFile(obj, file) {
  ensureDirectoryExists(file);
  const stream = fs.createWriteStream(file);

  stream.once('open', () => {
    stream.write(JSON.stringify(obj, null, 2));
    stream.end();
  });
}

/**
 * 生成VSCode的tags.json和attributes.json文件
 */
function generateForVSCode(components) {
  console.info('not support for vscode now.');
}

/**
 * 生成JetBrains系列软件支持的web-types.json文件
 */
function generateForWebStorm(components) {
  const createAttributesForComponent = component => {
    const componentProps = component.props;
    let attributes = [];
    for (let propName in componentProps) {
      let type = 'string';
      const propTypeName = componentProps[propName]._vueTypes_name;
      switch (propTypeName) {
        case PropTypes.looseBool._vueTypes_name:
          type = 'boolean';
          break;
        case PropTypes.func._vueTypes_name:
          type = 'function';
          break;
        case PropTypes.number._vueTypes_name:
          type = 'number';
          break;
        // case PropTypes.oneOf._vueTypes_name:
        //   type =
        default:
          type = 'string';
          break;
      }
      attributes.push({
        name: propName,
        value: {
          kind: 'expression',
          type,
        },
      });
    }
    return attributes;
  };

  const createEventsForComponent = component => {
    let events = [];
    if (component.emits) {
      events = component.emits.map(eventName => {
        return {
          name: eventName,
          description: '',
          arguments: [],
        };
      });
    }
    return events;
  };

  const createTagForComponent = component => {
    return {
      name: component.name,
      attributes: createAttributesForComponent(component),
      events: createEventsForComponent(component),
    };
  };

  const tags = components.map(createTagForComponent);

  const webTypes = {
    $schema: 'http://json.schemastore.org/web-types',
    framework: 'vue',
    name: 'ant-design-vue',
    version,
    contributions: {
      html: {
        'types-syntax': 'typescript',
        'description-markup': 'markdown',
        tags,
      },
    },
  };

  rimraf.sync(path.resolve('./dist/web-types.json'));
  writeJsonFile(webTypes, 'dist/web-types.json');
}

const components = [];
const fakeVue = {
  component(componentName, component) {
    components.push(component);
  },
  use(component) {
    component.install(fakeVue);
  },
  config: {
    globalProperties: {},
  },
};
install(fakeVue);
generateForWebStorm(components);
generateForVSCode(components);
