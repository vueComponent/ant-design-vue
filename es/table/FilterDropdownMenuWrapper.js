
export default {
  methods: {
    handelClick: function handelClick(e) {
      this.$emit('click', e);
    }
  },
  render: function render() {
    var h = arguments[0];
    var $slots = this.$slots,
        handelClick = this.handelClick;

    return h(
      'div',
      {
        on: {
          'click': handelClick
        }
      },
      [$slots['default']]
    );
  }
};