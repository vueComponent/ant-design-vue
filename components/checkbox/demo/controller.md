<cn>
#### 受控的checkbox
联动checkbox
</cn>

<us>
#### Controlled Checkbox
Communicated with other components
</us>

```tpl
<template>
  <div>
    <p :style="{ marginBottom: '20px' }">
      <a-checkbox :checked="checked" :disabled="disabled" @change="onChange">
        {{label}}
      </a-checkbox>
    </p>
    <p>
      <a-button type="primary" size="small" @click="toggleChecked">
        {{!checked ? 'Check' : 'Uncheck'}}
      </a-button>
      <a-button :style="{ marginLeft: '10px' }" type="primary" size="small" @click="toggleDisable">
        {{!disabled ? 'Disable' : 'Enable'}}
      </a-button>
    </p>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        checked: true,
        disabled: false,
      };
    },
    computed: {
      label() {
        const { checked, disabled } = this;
        return `${checked ? 'Checked' : 'Unchecked'}-${disabled ? 'Disabled' : 'Enabled'}`;
      },
    },
    methods: {
      toggleChecked() {
        this.checked = !this.checked;
      },
      toggleDisable() {
        this.disabled = !this.disabled;
      },
      onChange(e) {
        this.checked = e.target.checked;
      },
    },
  };
</script>
```
