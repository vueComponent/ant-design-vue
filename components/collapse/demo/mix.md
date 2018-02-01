<cn>
#### 面板嵌套
嵌套折叠面板。
</cn>

<us>
#### Nested panel
`Collapse` is nested inside the `Collapse`.
</us>

```html
<template>
  <div>
    <a-collapse @change="changeActivekey">
      <a-collapse-panel header="This is panel header 1" name="1">
        <a-collapse :defaultValue="'1'">
          <a-collapse-panel header="This is panel nest panel" name="1">
            <p>{{text}}</p>
          </a-collapse-panel>
        </a-collapse>
      </a-collapse-panel>
      <a-collapse-panel header="This is panel header 2" name="2" :disabled='false'>
        <p>{{text}}</p>
      </a-collapse-panel>
      <a-collapse-panel header="This is panel header 3" name="3">
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
