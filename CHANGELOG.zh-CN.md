# 更新日志

---

## 0.6.0

`2018-06-04`
- 🌟 新增`Anchor`锚点组件
- `Table`
  - 🐞 修复`loading.spinning`时显示`emptyText`问题[17b9dc](https://github.com/vueComponent/ant-design/commit/17b9dc14f5225eb75542facdb5053f4916b9d77f)
  - 🐞 修复`header style`不生效问题[#30](https://github.com/vueComponent/ant-design/pull/30)
- `DatePicker` 🐞 修复属性`showTime`为`true`时，重复调用`change`事件问题[81ab82](https://github.com/vueComponent/ant-design/commit/81ab829b1d0f67ee926b106de788fc5b41ec4f9c)
- `InputNumber` 🐞 修复`placeholder`不生效问题[ce39dc](https://github.com/vueComponent/ant-design/commit/ce39dc3506474a4b31632e03c38b518cf4060cef#diff-c9d10303f22c684e66d71ab1f9dac5f9R50)


## 0.5.4

`2018-05-26`
- 🐞 修复dist目录缺少less文件问题[ca084b9](https://github.com/vueComponent/ant-design/commit/ca084b9e6f0958c25a8278454c864ac8127cce95)

## 0.5.3

`2018-05-25`
- 🐞 修复构建`antd-with-locales.js`包含测试文件的问题[90583a3](https://github.com/vueComponent/ant-design/commit/90583a3c42e8b520747d6f6ac10cfd718d447030)

## 0.5.2

`2018-05-25`

- 🐞 `Timeline`: 修复重复显示loading组件bug[fa5141b](https://github.com/vueComponent/ant-design/commit/fa5141bd0061385f251b9026a07066677426b319)
- `Transfer`
  - 🐞 修复搜索框的清除按钮不起作用问题[4582da3](https://github.com/vueComponent/ant-design/commit/4582da3725e65c47a542f164532ab75a5618c265)
  - 💄 重写了属性变化监听逻辑，避免不必要的[0920d23](https://github.com/vueComponent/ant-design/commit/0920d23f12f6c133f667cd65316f1f0e6af27a33)
- 💄 `Select`: 优化`title`显示逻辑[9314957](https://github.com/vueComponent/ant-design/commit/931495768f8b573d12ce4e058e853c875f22bcd3)
- `Form`
  - 🐞 修复Form组件指令报错问题[#20](https://github.com/vueComponent/ant-design/issues/20)
  - 🌟 优化获取Form包装组件实例功能[c5e421c](https://github.com/vueComponent/ant-design/commit/c5e421cdb2768e93288ce7b4654bee2114f8e5ba)
- 🐞 `DatePicker`: 修复日历键盘事件不起作用问题[e9b6914](https://github.com/vueComponent/ant-design/commit/e9b6914282b1ac8d84b4262b8a6b33aa4e515831)
- `Avatar`: 修复字体大小自适应问题[#22](https://github.com/vueComponent/ant-design/pull/22)
- 🌟 添加了部分组件的单测
- 🌟 整理了组件库依赖(dependencies、devDependencies)，删除不再使用的包，并添加peerDependencies


## 0.5.1

`2018-05-10`

- 🐞 `Table`: 修复 `customRow` 自定义事件不生效问题[#16](https://github.com/vueComponent/ant-design/issues/16)

## 0.5.0

`2018-05-08`

- 🌟 `Form `新增Form表单组件
- 💄 `Upload.Dragger`: 修改组件name名称为`a-upload-dragger`
- 🐞 `Upload`: 修复Upload name属性失效问题


## 0.4.3

`2018-05-02`

- 🐞 修复组件样式丢失问题
- 🌟 站点添加babel-polyfill

## 0.4.2

`2018-04-24`

- 🐞  修复menu 非 inline 模式下的 click bug

## 0.4.1

#### bug

- 将Vue依赖转移到devDependencies，避免与业务版本不一致导致的不稳定bug

## 0.4.0

#### Layout

- 新增 Layout 组件

#### 其它

- 支持导入所有组件[Vue.use(antd)](https://github.com/vueComponent/ant-design/issues/3)


## 0.3.1

#### Features

- 对外第一个版本，提供常用45个[组件](https://github.com/vueComponent/ant-design/blob/c7e83d6142f0c5e72ef8fe794620478e69a50a8e/site/components.js)

