# Change Log

---

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
