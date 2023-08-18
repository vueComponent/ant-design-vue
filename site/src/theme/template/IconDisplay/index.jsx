import Icon, * as AntdIcons from '@ant-design/icons-vue';
import { categories } from './fields';
import { FilledIcon, OutlinedIcon, TwoToneIcon } from './themeIcons';
import Category from './Category';
import { Radio } from 'ant-design-vue';
import { defineComponent } from 'vue';

const ThemeType = {
  Filled: 'Filled',
  Outlined: 'Outlined',
  TwoTone: 'TwoTone',
};

const allIcons = AntdIcons;

const IconDisplay = defineComponent({
  cagetories: categories,
  components: {
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    ARadioButton: Radio.Button,
  },
  newIconNames: [],
  data() {
    return {
      theme: ThemeType.Outlined,
      searchVal: '',
      searchBarAffixed: false,
    };
  },
  methods: {
    handleChangeTheme(e) {
      this.theme = e.target.value;
    },
    handleAffixChange(affixed) {
      this.searchBarAffixed = affixed;
    },
    renderCategories() {
      const { theme } = this;

      return Object.keys(categories)
        .map(key => {
          let iconList = categories[key];

          return {
            category: key,
            icons: iconList
              .map(iconName => iconName + theme)
              .filter(iconName => {
                if (iconName.toLowerCase().includes(this.searchVal.trim().toLowerCase()))
                  return allIcons[iconName];
              }),
          };
        })
        .filter(({ icons }) => !!icons.length)
        .map(({ category, icons }) => (
          <Category
            key={category}
            title={category}
            theme={theme}
            icons={icons}
            newIcons={IconDisplay.newIconNames}
          />
        ));
    },
  },

  render() {
    return (
      <div>
        <h3 style="margin: 1.6em 0 .6em;">{this.$t('app.docs.components.icon.pick-theme')}</h3>
        <a-affix offset-top={32} onChange={this.handleAffixChange}>
          <div class={this.searchBarAffixed ? 'icons-affix icons-affixed' : 'icons-affix'}>
            <a-radio-group value={this.theme} onChange={this.handleChangeTheme}>
              <a-radio-button value={ThemeType.Outlined}>
                <Icon component={OutlinedIcon} /> {this.$t('app.docs.components.icon.outlined')}
              </a-radio-button>
              <a-radio-button value={ThemeType.Filled}>
                <Icon component={FilledIcon} /> {this.$t('app.docs.components.icon.filled')}
              </a-radio-button>
              <a-radio-button value={ThemeType.TwoTone}>
                <Icon component={TwoToneIcon} /> {this.$t('app.docs.components.icon.two-tone')}
              </a-radio-button>
            </a-radio-group>
            <a-input-search
              style="flex: 1 1 0%; margin-inline-start: 16px;"
              placeholder={this.$t('app.docs.components.icon.search.placeholder')}
              v-model:value={this.searchVal}
            />
          </div>
        </a-affix>
        {this.renderCategories().length === 0 ? (
          <a-empty style="padding: 12px 0;" />
        ) : (
          this.renderCategories()
        )}
      </div>
    );
  },
});

export default IconDisplay;
