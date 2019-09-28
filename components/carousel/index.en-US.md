## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| afterChange | Callback function called after the current index changes | function(current) | - |
| autoplay | Whether to scroll automatically | boolean | `false` |
| beforeChange | Callback function called before the current index changes | function(from, to) | - |
| dots | Whether to show the dots at the bottom of the gallery | boolean | `true` |
| easing | Transition interpolation function name | string | `linear` |
| effect | Transition effect | `scrollx` \| `fade` | `scrollx` |
| vertical | Whether to use a vertical display | boolean | `false` |

## Methods

| Name | Description |
| --- | --- |
| goTo(slideNumber, dontAnimate) | Go to slide index, if dontAnimate=true, it happens without animation |
| next() | Change current slide to next slide |
| prev() | Change current slide to previous slide |

For more info on the parameters, refer to the [vc-slick props](https://github.com/vueComponent/ant-design-vue/blob/master/components/vc-slick/src/default-props.js#L3)
