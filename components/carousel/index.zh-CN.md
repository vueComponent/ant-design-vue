## API

| 参数         | 说明                             | 类型               | 默认值  |
| ------------ | -------------------------------- | ------------------ | ------- |
| afterChange  | 切换面板的回调                   | function(current)  | 无      |
| autoplay     | 是否自动切换                     | boolean            | false   |
| beforeChange | 切换面板的回调                   | function(from, to) | 无      |
| dots         | 是否显示面板指示点               | boolean            | true    |
| easing       | 动画效果                         | string             | linear  |
| effect       | 动画效果函数，可取 scrollx, fade | string             | scrollx |
| vertical     | 垂直显示                         | boolean            | false   |

## 方法

| 名称                           | 描述                                              |
| ------------------------------ | ------------------------------------------------- |
| goTo(slideNumber, dontAnimate) | 切换到指定面板, dontAnimate = true 时，不使用动画 |
| next()                         | 切换到下一面板                                    |
| prev()                         | 切换到上一面板                                    |

更多参数可参考：[vc-slick props](https://github.com/vueComponent/ant-design-vue/blob/master/components/vc-slick/src/default-props.js#L3)
