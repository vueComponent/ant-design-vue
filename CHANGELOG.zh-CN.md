# 更新日志

---

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

