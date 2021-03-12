import manifest from '@ant-design/icons/lib/manifest';
import Category from './Category';
import { FilledIcon, OutlinedIcon, TwoToneIcon } from './themeIcons';
import categories from './fields';
import { Radio } from 'ant-design-vue';
import 'ant-design-vue/es/radio/style';

const IconDisplay = {
  cagetories: categories,
  newIconNames: [],

  themeTypeMapper: {
    filled: 'fill',
    outlined: 'outline',
    twoTone: 'twotone',
  },
  components: {
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    ARadioButton: Radio.Button,
  },
  data() {
    return {
      theme: 'outlined',
      searchKey: '',
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
      const { searchKey, theme } = this;
      const otherIcons = categories.all.filter(icon => {
        return list
          .filter(({ category }) => category !== 'all')
          .every(item => !item.icons.includes(icon));
      });
      return list
        .filter(({ category }) => category !== 'all')
        .concat({ category: 'other', icons: otherIcons })
        .map(({ category, icons }) => ({
          category,
          icons: icons
            .filter(name => name.includes(searchKey))
            .filter(name => manifest[IconDisplay.themeTypeMapper[theme]].includes(name)),
        }))
        .filter(({ icons }) => !!icons.length)
        .map(({ category, icons }) => {
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
    handleSearchIcon(val) {
      this.searchKey = val;
    },
  },

  render() {
    const list = this.getComputedDisplayList();
    return (
      <div>
        <h3>{this.$t('app.docs.components.icon.pick-theme')}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <a-radio-group value={this.theme} onChange={this.handleChangeTheme} size="large">
            <a-radio-button value="outlined">
              <a-icon component={OutlinedIcon} /> {this.$t('app.docs.components.icon.outlined')}
            </a-radio-button>
            <a-radio-button value="filled">
              <a-icon component={FilledIcon} /> {this.$t('app.docs.components.icon.filled')}
            </a-radio-button>
            <a-radio-button value="twoTone">
              <a-icon component={TwoToneIcon} /> {this.$t('app.docs.components.icon.two-tone')}
            </a-radio-button>
          </a-radio-group>
          <a-input-search
            placeholder={this.$t('app.docs.components.icon.search.placeholder')}
            style={{ marginLeft: '10px', flex: 1 }}
            allowClear
            onChange={e => this.handleSearchIcon(e.currentTarget.value)}
            size="large"
            autoFocus
          />
        </div>
        {this.renderCategories(list)}
      </div>
    );
  },
};

export default IconDisplay;
