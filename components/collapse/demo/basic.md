<cn>
#### 折叠面板
可以同时展开多个面板，这个例子默认展开了第一个。
</cn>

<us>
#### Collapse
More than one panel can be expanded at a time, the first panel is initialized to be active in this case.
</us>

```html
<template>
  <div>
    <a-collapse v-model="value" @change="changeActivekey">
      <a-collapse-panel header="This is panel header 1" name="1">
        <p>{{text}}</p>
      </a-collapse-panel>
      <a-collapse-panel header="This is panel header 2" name="2" :disabled='false'>
        <p>{{text}}</p>
      </a-collapse-panel>
      <a-collapse-panel header="This is panel header 3" name="3" disabled>
        <p>{{text}}</p>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
  export default {
  data () {
    return {
      text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`,
      value: ['1']
    }
  },
  methods: {
    changeActivekey (key) {
      console.log(key)
    },
  },
}
</script>
```
