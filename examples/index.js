import Vue from 'vue'
import Checkbox from './checkbox.vue'
import Button from './button.vue'
// import Dialog from './dialog.vue'
import './index.less'
new Vue({
  el: '#app',
  template: `
    <div>
        <Checkbox />
        <AntButton />
    </div>
    `,
  components: {
    AntButton: Button,
    // AntDialog: Dialog,
    Checkbox,
  },
})
