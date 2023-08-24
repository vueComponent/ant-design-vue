# Change Log (The following content is translated by Google)

`ant-design-vue` strictly follows [Semantic Versioning 2.0.0](http://semver.org/).

#### Release Schedule

- Weekly release: patch version at the end of every week for routine bugfix (anytime for urgent bugfix).
- Monthly release: minor version at the end of every month for new features.
- Major version release is not included in this schedule for breaking change and new features.

---

## 4.0.1

- 🌟 FloatButton add Badge support [#6738](https://github.com/vueComponent/ant-design-vue/issues/6738)
- 🌟 Image preview zoom in and out sensitivity adjustment [#6784](https://github.com/vueComponent/ant-design-vue/issues/6784)
- 🌟 Add flip feature to Image [#6785](https://github.com/vueComponent/ant-design-vue/issues/6785)
- 🌟 Add App component to provide context [#6735](https://github.com/vueComponent/ant-design-vue/issues/6735)
- 🌟 Style extraction feature for SSR [#6757](https://github.com/vueComponent/ant-design-vue/issues/6757)
- 🌟 Support px2rem [#6817](https://github.com/vueComponent/ant-design-vue/issues/6817)
- 🌟 Tag supports borderless mode [#6819](https://github.com/vueComponent/ant-design-vue/issues/6819)
- 🌟 Avatar group mode supports shape [#6822](https://github.com/vueComponent/ant-design-vue/issues/6822)
- 🌟 AutoComplete supports borderless and custom clearIcon [#6829](https://github.com/vueComponent/ant-design-vue/issues/6829)
- 🌟 InputPassword supports controlled visible [#6863](https://github.com/vueComponent/ant-design-vue/issues/6863)
- 🐞 Fix the style misalignment problem when InputGroup is large [#6866](https://github.com/vueComponent/ant-design-vue/issues/6866)
- 🐞 Fix the problem that Checkable Tag cannot customize class [#6854](https://github.com/vueComponent/ant-design-vue/issues/6854)
- 🐞 Fix the rendering problem in Tabs animation mode [#6855](https://github.com/vueComponent/ant-design-vue/issues/6855)
- 🐞 Fix the problem that the Image height attribute does not take effect [#6840](https://github.com/vueComponent/ant-design-vue/issues/6840)
- 🐞 Fix InputNumber trigger mouseup event [#6772](https://github.com/vueComponent/ant-design-vue/issues/6772)
- 🐞 Fix the Dropdown style problem when Tabs are collapsed [#6757](https://github.com/vueComponent/ant-design-vue/issues/6757)
- 🐞 Fix Table expandedRowRender property does not take effect [#6783](https://github.com/vueComponent/ant-design-vue/issues/6783)
- 🐞 Fix dayjs not packaged into dist [#6767](https://github.com/vueComponent/ant-design-vue/issues/6767)
- 🐞 Fix clipPath browser compatibility issue [#6770](https://github.com/vueComponent/ant-design-vue/issues/6770)
- 🐞 Fix Carousel autoplay responsive problem [#6768](https://github.com/vueComponent/ant-design-vue/issues/6768)
- 🐞 Fix PageHeader ghost style problem [#6761](https://github.com/vueComponent/ant-design-vue/issues/6761)
- 🐞 Fix Checkbox not triggering Form validation [#6741](https://github.com/vueComponent/ant-design-vue/issues/6741)
- 🐞 Fix the problem that the Input prefix attribute does not take effect [#6810](https://github.com/vueComponent/ant-design-vue/issues/6810)
- 🐞 Fix Badge style problem in Avatar [#6874](https://github.com/vueComponent/ant-design-vue/issues/6874)

## 4.0

### 🔥🔥🔥 4.0 official version released 🔥🔥🔥

### Design specification adjustment

- Basic rounded corner adjustment, changed from unified `2px` to four-level rounded corners, which are `2px` `4px` `6px` `8px` respectively, which are applied to different scenarios, for example, the rounded corners of the default size Button are adjusted to `6px`.
- Main color adjustment, changed from `#1890ff` to `#1677ff`.
- Overall shadow adjustment, from the original three-level shadow adjustment to two levels, which are used for resident page components (such as Card) and interactive feedback (such as Dropdown).
- Adjust the internal spacing of some components.
- Overall de-wireframing.

### Add 5 new components

- Segmented segment controller
- WaterMark watermark
- QrCode QR code
- FloatButton floating button
- Tour roaming guide

### Technical adjustments

- Deprecated less and adopted CSS-in-JS to better support dynamic themes.
  - All less files are removed, and less variables no longer support leaking.
  - css files are no longer included in the product. Since CSS-in-JS supports importing on demand, the original `ant-design-vue/dist/antd.css` has also been removed. If you need to reset some basic styles, please import `ant-design-vue/dist/reset .css`.
  - If you need to reset the style of the component and don't want to introduce `ant-design-vue/dist/reset.css` to pollute the global style, you can try to use [App component](/components/app), to solve the problem that native elements do not have ant-design-vue specification style.
- Removed css variables and dynamic theme schemes built on top of it.
- LocaleProvider has been deprecated in 3.x (use `<ConfigProvider locale />` instead), we have completely removed the related directories `ant-design-vue/es/locale-provider`, `ant- design-vue/lib/locale-provider`.
- `babel-plugin-import` is no longer supported, CSS-in-JS itself has the ability to load on demand, no longer need plug-in support.

#### Component API adjustments

- The classname API of the component popup is unified to `popupClassName`, and similar APIs such as `dropdownClassName` will be replaced.

  - AutoComplete component
  - Cascader component
  - Select component
  - TreeSelect component
  - TimePicker component
  - DatePicker component
  - Mentions component

- The controlled visibility API of the component popup is unified as `open`, and `visible` and other similar APIs will be replaced.
  - Drawer component `visible` becomes `open`.
  - Modal component `visible` becomes `open`.
  - Dropdown component `visible` becomes `open`.
  - Tooltip component `visible` becomes `open`.
  - Tag component `visible` has been removed.
  - Slider component `tooltip` related API converges to `tooltip` property.
  - Table component `filterDropdownVisible` changed to `filterDropdownOpen`.
- `getPopupContainer`: All `getPopupContainer` needs to ensure that the returned div is unique.
- Drawer `style` and `class` are migrated to the Drawer popup area, and the original attributes are replaced by `rootClassName` and `rootStyle`.

#### Component refactoring and removal

- Remove the `locale-provider` directory. `LocaleProvider` has been removed in v4, please use `ConfigProvider` instead.

- Remove `xxxl` breakpoint attribute in grid layout. `xxxl` attribute has been removed in v4, you can use [theme customization](/docs/vue/customize-theme) to modify `screen[XS|SM|MD|LG|XL|XXL]` to modify the break Point value achieved.

- The BackTop component was deprecated in `4.0.0` and moved to the FloatButton floating button. If needed, it can be imported from FloatButton.

### [Upgrade Guide](/docs/vue/migration-v4)

## 3.x

Visit [GitHub](https://github.com/vueComponent/ant-design-vue/blob/3.x/CHANGELOG.zh-CN.md) `3.x` Change Log。

## 2.x

Visit [GitHub](https://github.com/vueComponent/ant-design-vue/blob/2.x/CHANGELOG.zh-CN.md) `2.x` Change Log。

## 1.x

Visit [GitHub](https://github.com/vueComponent/ant-design-vue/blob/1.x/CHANGELOG.en-US.md) to read change logs from `0.x` to `1.x`.
