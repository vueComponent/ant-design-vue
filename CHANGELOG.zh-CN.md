# 更新日志

---

## 1.0.0

`2018-07-21`
- 🌟 新增`Carousel 走马灯`组件[edddbd](https://github.com/vueComponent/ant-design/commit/edddbd982a279b62229ce825855c14c556866ece)
- 更正了若干文档错误

## 0.7.1

`2018-07-17`
- 🐞 修复`Tooltip`包含`Button`时的样式及功能问题[#73](https://github.com/vueComponent/ant-design/issues/73)
- 🐞 add `Table` panagation deep watch[#b464c6](https://github.com/vueComponent/ant-design/commit/b464c6f6ee4df6df1b6c55f29ac85b2f462763bc)


## 0.7.0

`2018-07-11`
- 🌟 新增`TreeSelect`组件
- 🌟 `Select`组件新增`options`，方便直接生成选择列表[#37](https://github.com/vueComponent/ant-design/issues/37)
- 🐞 修复`Tooltip`中使用`Select`组件时，`blur`事件报错问题[#67](https://github.com/vueComponent/ant-design/issues/67)
- 🐞 修改`Upload`组件`action`属性为可选[#66](https://github.com/vueComponent/ant-design/issues/66)


## 0.6.8

`2018-07-05`
- 🐞 修复`notification` h is not defined[#63](https://github.com/vueComponent/ant-design/issues/63)
- 🐞 修复`Transfer`国际化缺少titles问题[#64](https://github.com/vueComponent/ant-design/issues/64)


## 0.6.7

`2018-07-03`
- 🐞 修复`Form`使用模板语法时组件不能更新[#62](https://github.com/vueComponent/ant-design/issues/62)

## 0.6.6

`2018-07-03`
- 🐞 修复`Upload`的类型校验错误问题并更新相关demo[#61](https://github.com/vueComponent/ant-design/issues/61)
- 🐞 修复`Upload`图片预览不能正确跳转问题[1584b3](https://github.com/vueComponent/ant-design/commit/1584b3839e500d2d6b07abf704f5cd084ca00e87)


## 0.6.5

`2018-07-01`
- 🐞 修复`Select`的`getPopupContainer`不生效问题[#56](https://github.com/vueComponent/ant-design/issues/56)
- 🐞 修复`Select`的弹出框位置不更新问题[8254f7](https://github.com/vueComponent/ant-design/commit/8254f783a32189b63ffcf2c53702b50afef1f3db)

## 0.6.4

`2018-06-28`
- 🐞 修复`InputSearch`的`v-model`返回值错误问题[#53](https://github.com/vueComponent/ant-design/issues/53)

## 0.6.3

`2018-06-26`
- 🐞 修复`Popover`的`v-model`不生效问题[#49](https://github.com/vueComponent/ant-design/issues/49)

## 0.6.2

`2018-06-24`
- 🌟 `Form`组件数据自动校验功能支持`template`语法[7c9232](https://github.com/vueComponent/ant-design/commit/7c923278b3678a822ff90da0cb8db7653d79e15c)
- `Select`: 🐞 添加`focus` `blur`方法[52f6f5](https://github.com/vueComponent/ant-design/commit/52f6f50dbe38631c0e698a6ea23b3686f6c2a375)
- `Radio`
  - 🐞 修复Radiogroup `disabled` className[9df74b](https://github.com/vueComponent/ant-design/commit/9df74bedd7640b6066010c498f942ce544c658b7)
  - 🐞 修复`autoFoucs` `focus` `blur` `mouseenter` `mouseleave` 不生效问题[f7886c](https://github.com/vueComponent/ant-design/commit/f7886c7203730bedf519bc45f5f78726735d3aac)
- `TimePicker`: 🐞 修复`autoFoucs` `focus` `blur`不生效问题[28d009](https://github.com/vueComponent/ant-design/commit/28d009d3ced807051a86a2c09cd2764303de98f7)


## 0.6.1

`2018-06-17`
- 🌟 新增`List`列表组件
- `Table`
  - 🐞 修复更新高度时报错问题[#33](https://github.com/vueComponent/ant-design/issues/33)
  - 🐞 修复`defaultChecked`不生效问题[ec1999](https://github.com/vueComponent/ant-design/commit/ec1999dea4cea126b78e3fd84bef620b876e9841)
  - `columns key`支持数字类型[9b7f5c](https://github.com/vueComponent/ant-design/commit/9b7f5c2f81b6f83190e5b022b2b1e28de3f68a2b)
- `Tooltip`
  - 🛠 更新事件API`change`为`visibleChange`
- `Textarea`: 🐞 修复`autoFoucs`不生效问题[787927](https://github.com/vueComponent/ant-design/commit/787927912307db7edb9821a440feacd216e3a6a2)
- `InputSearch`: 🐞 添加`focus` `blur`方法[3cff62](https://github.com/vueComponent/ant-design/commit/3cff62997d16811ae17618f9b41617973d805d7d)
- `InputNumber`: 🐞 修复`autoFoucs`不生效问题[88f165](https://github.com/vueComponent/ant-design/commit/88f165edb5c3993f4dba90c3267a1ea037e0869b)
- `DatePicker`: 🐞 修复`autoFoucs`不生效问题[264abf](https://github.com/vueComponent/ant-design/commit/264abff59791181b9190ca0914b780a8df6aa81a)
- `Cascader`: 🐞 修复`autoFoucs`不生效问题[be69bd](https://github.com/vueComponent/ant-design/commit/be69bd9af1bae184a4ebe8c4ef9560479ab11027)
- `Rate`: 🐞 修复`autoFoucs`不生效问题，及`blur`报错问题[c2c984](https://github.com/vueComponent/ant-design/commit/c2c9841eb9b8e5ce4decff57a925e60d4bd7d809)
- `RangePicker`: 🐞 修复值类型校验出错问题[228f44](https://github.com/vueComponent/ant-design/commit/228f4478a5d169d22960c97d1d8a8320c58da9cc)


## 0.6.0

`2018-06-04`
- 🌟 新增`Anchor`锚点组件
- `Table`
  - 🐞 修复`loading.spinning`时显示`emptyText`问题[17b9dc](https://github.com/vueComponent/ant-design/commit/17b9dc14f5225eb75542facdb5053f4916b9d77f)
  - 🐞 修复`header style`不生效问题[#30](https://github.com/vueComponent/ant-design/pull/30)
- `DatePicker`: 🐞 修复属性`showTime`为`true`时，重复调用`change`事件问题[81ab82](https://github.com/vueComponent/ant-design/commit/81ab829b1d0f67ee926b106de788fc5b41ec4f9c)
- `InputNumber`: 🐞 修复`placeholder`不生效问题[ce39dc](https://github.com/vueComponent/ant-design/commit/ce39dc3506474a4b31632e03c38b518cf4060cef#diff-c9d10303f22c684e66d71ab1f9dac5f9R50)


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

