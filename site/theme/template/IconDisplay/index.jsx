import manifest from '@ant-design/icons/lib/manifest';
import Category from './Category';
import { FilledIcon, OutlinedIcon, TwoToneIcon } from './themeIcons';
import { categories } from './fields';

const IconDisplay = {
  cagetories: categories,
  newIconNames: [
    // direction
    'border-bottom',
    'border-horizontal',
    'border-inner',
    'border-outter',
    'border-left',
    'border-right',
    'border-top',
    'border-verticle',
    'pic-center',
    'pic-left',
    'pic-right',
    'radius-bottomleft',
    'radius-bottomright',
    'radius-upleft',
    'radius-upleft',
    'fullscreen',
    'fullscreen-exit',
    // suggestion
    'issues-close',
    'stop',

    // edit
    'scissor',
    'snippets',
    'diff',
    'highlight',
    'align-center',
    'align-left',
    'align-right',
    'bg-colors',
    'bold',
    'italic',
    'underline',
    'redo',
    'undo',
    'zoom-in',
    'zoom-out',
    'font-colors',
    'font-size',
    'line-height',
    'colum-height',
    'colum-width',
    'dash',
    'small-dash',
    'sort-ascending',
    'sort-descending',
    'drag',
    'ordered-list',
    'radius-setting',

    // data
    'radar-chart',
    'heat-map',
    'fall',
    'rise',
    'stock',
    'box-plot',
    'fund',
    'sliders',

    // other
    'alert',
    'audit',
    'batch-folding',
    'branches',
    'build',
    'border',
    'crown',
    'experiment',
    'fire',
    'money-collect',
    'property-safety',
    'read',
    'reconciliation',
    'rest',
    'security-scan',
    'insurance',
    'interation',
    'safety-certificate',
    'project',
    'thunderbolt',
    'block',
    'cluster',
    'deployment-unit',
    'dollar',
    'euro',
    'pound',
    'file-done',
    'file-exclamation',
    'file-protect',
    'file-search',
    'file-sync',
    'gateway',
    'gold',
    'robot',
    'strikethrough',
    'shopping',

    // logo
    'alibaba',
    'yahoo',
  ],

  themeTypeMapper: {
    filled: 'fill',
    outlined: 'outline',
    twoTone: 'twotone',
  },
  data() {
    return {
      theme: 'outlined',
    };
  },
  methods: {
    getComputedDisplayList() {
      return Object.keys(IconDisplay.cagetories)
        .map(category => ({
          category,
          icons: IconDisplay.cagetories[category].filter(
            name => manifest[IconDisplay.themeTypeMapper[this.theme]].indexOf(name) !== -1,
          ),
        }))
        .filter(({ icons }) => Boolean(icons.length));
    },

    handleChangeTheme(e) {
      this.theme = e.target.value;
    },

    renderCategories(list) {
      return list.map(({ category, icons }) => {
        return (
          <Category
            key={category}
            title={category}
            icons={icons}
            theme={this.theme}
            newIcons={IconDisplay.newIconNames}
          />
        );
      });
    },
  },

  render() {
    const list = this.getComputedDisplayList();
    const message = this.$t('message');
    return (
      <div>
        <h3>{message['app.docs.components.icon.pick-theme']}</h3>
        <a-radio-group value={this.theme} onChange={this.handleChangeTheme}>
          <a-radio-button value="outlined">
            <a-icon component={OutlinedIcon} /> {message['app.docs.components.icon.outlined']}
          </a-radio-button>
          <a-radio-button value="filled">
            <a-icon component={FilledIcon} /> {message['app.docs.components.icon.filled']}
          </a-radio-button>
          <a-radio-button value="twoTone">
            <a-icon component={TwoToneIcon} /> {message['app.docs.components.icon.two-tone']}
          </a-radio-button>
        </a-radio-group>
        {this.renderCategories(list)}
      </div>
    );
  },
};

export default IconDisplay;
