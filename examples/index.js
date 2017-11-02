import Vue from 'vue'
import Checkbox from './checkbox.vue'
import Button from './button.vue'
import Radio from './radio.vue'
import Grid from './grid.vue'
// import Dialog from './dialog.vue'
import Rate from './rate.vue'
import './index.less'
new Vue({
  el: '#app',
  template: `
    <div>
      <Grid />
      <Checkbox />
      <AntButton />
      <Radio />
      <Rate />
    </div>
    `,
  components: {
    AntButton: Button,
    // AntDialog: Dialog,
    Checkbox,
    Grid,
    Radio,
    Rate,
  },
})
