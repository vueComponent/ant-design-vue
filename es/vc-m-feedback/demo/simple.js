import TouchFeedback from '../index';
import './simple.less';

export default {
  render: function render() {
    var h = arguments[0];

    return h(
      'div',
      { style: { marginBottom: 12 } },
      [h(
        TouchFeedback,
        {
          attrs: { activeClassName: 'active', activeStyle: { color: 'red' } }
        },
        [h(
          'div',
          { 'class': 'normal', style: {
              backgroundColor: 'yellow'
            },
            on: {
              'click': function click() {
                return console.log('click div');
              }
            }
          },
          ['click to active']
        )]
      )]
    );
  }
};