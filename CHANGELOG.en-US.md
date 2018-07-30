# Change Log

---

## 1.0.1

`2018-07-27`
- 🌟 Optimize Chinese input for `Input` components(just support v-model) [4a5154](https://github.com/vueComponent/ant-design/commit/4a51544bd6470ab628dda80e9d7593e4603dd0b6)
- 🐞 Fix `treeSelect` `treeData[i].children` throw error when null[#81](https://github.com/vueComponent/ant-design/issues/81)
- 🐞 Fix `Calendar` change event call twice[#82](https://github.com/vueComponent/ant-design/issues/82)
- 🐞 Fix the `description` and `title` slot attribute of the `Card` component does not work[#83](https://github.com/vueComponent/ant-design/issues/83)
- 🐞 Fix `dropdownClassName` attribute of `DataPicker` component does not working[02ab242](https://github.com/vueComponent/ant-design/commit/02ab242197b923f2157f41d98a7930512475a799)

## 1.0.0

`2018-07-21`
- 🌟 Add `Carousel` component [edddbd](https://github.com/vueComponent/ant-design/commit/edddbd982a279b62229ce825855c14c556866ece)
- modify some error document

## 0.7.1

`2018-07-17`
- 🐞 fix `Tooltip` containing disabled button does not show and style[#73](https://github.com/vueComponent/ant-design/issues/73)
- 🐞 add `Table` panagation deep watch[#b464c6](https://github.com/vueComponent/ant-design/commit/b464c6f6ee4df6df1b6c55f29ac85b2f462763bc)


## 0.7.0

`2018-07-11`
- 🌟 Add `TreeSelect` component
- 🌟 `Select` add `options`, Easy to generate a selection list directly[#37](https://github.com/vueComponent/ant-design/issues/37)
- 🐞 Fix `blur` event error when using `Select` component in `Tooltip`[#67](https://github.com/vueComponent/ant-design/issues/67)
- 🐞 Modify the `Upload` component `action` attribute to optional[#66](https://github.com/vueComponent/ant-design/issues/66)


## 0.6.8

`2018-07-05`
- 🐞 Fix `notification` h is not defined[#63](https://github.com/vueComponent/ant-design/issues/63)
- 🐞 Fix `Transfer` local-provider miss `titles`[#64](https://github.com/vueComponent/ant-design/issues/64)

## 0.6.7

`2018-07-03`
- 🐞 Fix `Form` component cannot be updated when using template syntax[#62](https://github.com/vueComponent/ant-design/issues/62)

## 0.6.6

`2018-07-03`
- 🐞 Fix `Upload` type validation error issue and update related demo[#61](https://github.com/vueComponent/ant-design/issues/61)
- 🐞 Fix `Upload` image preview does not jump correctly[1584b3](https://github.com/vueComponent/ant-design/commit/1584b3839e500d2d6b07abf704f5cd084ca00e87)


## 0.6.5

`2018-07-01`
- 🐞 Fix `Select` `getPopupContainer` not working [#56](https://github.com/vueComponent/ant-design/issues/56)
- 🐞 Fix `Select` popup position is not updated[8254f7](https://github.com/vueComponent/ant-design/commit/8254f783a32189b63ffcf2c53702b50afef1f3db)

## 0.6.4

`2018-06-28`
- 🐞 Fix `InputSearch` `v-model` return wrong value[#53](https://github.com/vueComponent/ant-design/issues/53)

## 0.6.3

`2018-06-26`
- 🐞 Fix `Popover` `v-model` not working[#49](https://github.com/vueComponent/ant-design/issues/49)

## 0.6.2

`2018-06-24`
- 🌟 `Form` component data auto-checking support for `template` syntax[7c9232](https://github.com/vueComponent/ant-design/commit/7c923278b3678a822ff90da0cb8db7653d79e15c)
- `Select`: 🐞 add `focus` `blur` methods[52f6f5](https://github.com/vueComponent/ant-design/commit/52f6f50dbe38631c0e698a6ea23b3686f6c2a375)
- `Radio`
  - 🐞 Fix Radiogroup `disabled` className[9df74b](https://github.com/vueComponent/ant-design/commit/9df74bedd7640b6066010c498f942ce544c658b7)
  - 🐞 Fix `autoFoucs` `focus` `blur` `mouseenter` `mouseleave` not working[f7886c](https://github.com/vueComponent/ant-design/commit/f7886c7203730bedf519bc45f5f78726735d3aac)
- `TimePicker`: 🐞 Fix `autoFoucs` `focus` `blur` not working[28d009](https://github.com/vueComponent/ant-design/commit/28d009d3ced807051a86a2c09cd2764303de98f7)

## 0.6.1

`2018-06-17`
- 🌟 Add `List` Component
- `Table`
  - 🐞 Fix `'querySelectorAll` error when updating height[#33](https://github.com/vueComponent/ant-design/issues/33)
  - 🐞 fix `defaultChecked` not working[ec1999](https://github.com/vueComponent/ant-design/commit/ec1999dea4cea126b78e3fd84bef620b876e9841)
  - `columns key` support `number` type[9b7f5c](https://github.com/vueComponent/ant-design/commit/9b7f5c2f81b6f83190e5b022b2b1e28de3f68a2b)
- `Tooltip`: 🛠 update events API `change` to `visibleChange`
- `Textarea`: 🐞 Fix `autoFoucs` not working[787927](https://github.com/vueComponent/ant-design/commit/787927912307db7edb9821a440feacd216e3a6a2)
- `InputSearch`: 🐞 Add `focus` `blur` methods[3cff62](https://github.com/vueComponent/ant-design/commit/3cff62997d16811ae17618f9b41617973d805d7d)
- `InputNumber`: 🐞 Fix `autoFoucs` not working[88f165](https://github.com/vueComponent/ant-design/commit/88f165edb5c3993f4dba90c3267a1ea037e0869b)
- `DatePicker`: 🐞 Fix `autoFoucs` not working[264abf](https://github.com/vueComponent/ant-design/commit/264abff59791181b9190ca0914b780a8df6aa81a)
- `Cascader`: 🐞 Fix `autoFoucs` not working[be69bd](https://github.com/vueComponent/ant-design/commit/be69bd9af1bae184a4ebe8c4ef9560479ab11027)
- `Rate`: 🐞 Fix `autoFoucs` not working，and `blur` error[c2c984](https://github.com/vueComponent/ant-design/commit/c2c9841eb9b8e5ce4decff57a925e60d4bd7d809)
- `RangePicker`: 🐞 Fix value type check error problem[228f44](https://github.com/vueComponent/ant-design/commit/228f4478a5d169d22960c97d1d8a8320c58da9cc)

## 0.6.0

`2018-06-04`
- 🌟 Add `Anchor` Component
- `Table`
  - 🐞 Fix show `emptyText` problem when `loading.spinning` [17b9dc](https://github.com/vueComponent/ant-design/commit/17b9dc14f5225eb75542facdb5053f4916b9d77f)
  - 🐞 Fixed `header style` not working [#30](https://github.com/vueComponent/ant-design/pull/30)
- 🐞  `DatePicker`: Fix the issue of `change` event repeatedly call when `showTime` is `true` [81ab82](https://github.com/vueComponent/ant-design/commit/81ab829b1d0f67ee926b106de788fc5b41ec4f9c)
- 🐞  `InputNumber`: Fix `placeholder` not working [ce39dc](https://github.com/vueComponent/ant-design/commit/ce39dc3506474a4b31632e03c38b518cf4060cef#diff-c9d10303f22c684e66d71ab1f9dac5f9R50)

## 0.5.4

`2018-05-26`
- 🐞 Fix missing `less` file problem in dist directory[ca084b9](https://github.com/vueComponent/ant-design/commit/ca084b9e6f0958c25a8278454c864ac8127cce95)

## 0.5.3

`2018-05-25`
- 🐞 Fixed issue with building `antd-with-locales.js` containing test files[90583a3](https://github.com/vueComponent/ant-design/commit/90583a3c42e8b520747d6f6ac10cfd718d447030)

## 0.5.2

`2018-05-25`

- 🐞 `Timeline`: Fix duplicated loading component bug [fa5141b](https://github.com/vueComponent/ant-design/commit/fa5141bd0061385f251b9026a07066677426b319)
- `Transfer`
  - 🐞 Fix search box clear button does not work Problem [4582da3](https://github.com/vueComponent/ant-design/commit/4582da3725e65c47a542f164532ab75a5618c265)
  - 💄 Override property change listener logic to avoid unnecessary [0920d23](https://github.com/vueComponent/ant-design/commit/0920d23f12f6c133f667cd65316f1f0e6af27a33)
- 💄 `Select`: Optimizing `title` display logic [9314957](https://github.com/vueComponent/ant-design/commit/931495768f8b573d12ce4e058e853c875f22bcd3)
- `Form`
  - 🐞 Fixed Form component `directive` error [#20](https://github.com/vueComponent/ant-design/issues/20)
  - 🌟 Maintain an ref for wrapped component instance, use `wrappedComponentRef` [c5e421c](https://github.com/vueComponent/ant-design/commit/c5e421cdb2768e93288ce7b4654bee2114f8e5ba)
- 🐞 `DatePicker`: Fix calendar keyboard event does not work [e9b6914](https://github.com/vueComponent/ant-design/commit/e9b6914282b1ac8d84b4262b8a6b33aa4e515831)
- `Avatar`: Fixing font size adaptation issues [#22](https://github.com/vueComponent/ant-design/pull/22)
- 🌟 Added single test for some components
- 🌟 sorted component library `dependencies` and `devDependencies`, deleted unused packages, and added `peerDependencies`

## 0.5.1

`2018-05-10`

- 🐞 `Table`: Fix `customRow` events not working[#16](https://github.com/vueComponent/ant-design/issues/16)

## 0.5.0

`2018-05-08`

- 🌟 `Form`: add Form component
- 💄 `Upload.Dragger`: Modify `name` name to `a-upload-dragger`
- 🐞 `Upload`: Fix `name` prop not working

## 0.4.3

`2018-05-02`

- 🐞 Fix component style loss problem
- 🌟 site add babel-polyfill

## 0.4.2

`2018-04-24`

- 🐞  fix menu click bug

## 0.4.1

#### bug

- Transfer Vue's dependencies to devDependencies to avoid unstable bugs caused by inconsistency with business versions

## 0.4.0

#### Layout

- add  `layout` component

#### Others

- support use [Vue.use(antd)](https://github.com/vueComponent/ant-design/issues/3)


## 0.3.1

#### Features

- first version, provide 45 [components](https://github.com/vueComponent/ant-design/blob/c7e83d6142f0c5e72ef8fe794620478e69a50a8e/site/components.js)
