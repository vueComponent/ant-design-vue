import Vue from 'vue'
import Checkbox from './checkbox.vue'
import Button from './button.vue'
import Grid from './grid.vue'
// import Dialog from './dialog.vue'
import './index.less'
new Vue({
  el: '#app',
  template: `
    <div>
      <Grid />
      <Checkbox />
      <AntButton />
    </div>
    `,
  components: {
    AntButton: Button,
    // AntDialog: Dialog,
    Checkbox,
    Grid,
  },
})
