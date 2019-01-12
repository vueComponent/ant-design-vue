import PropTypes from '../../_util/vue-types';
import { setTransform, isTransformSupported, getLeft, getTop, getActiveIndex } from './utils';
import BaseMixin from '../../_util/BaseMixin';

function componentDidUpdate(component, init) {
  const { styles = {}, panels, activeKey } = component.$props;
  const rootNode = component.getRef('root');
  const wrapNode = component.getRef('nav') || rootNode;
  const inkBarNode = component.getRef('inkBar');
  const activeTab = component.getRef('activeTab');
  const inkBarNodeStyle = inkBarNode.style;
  const tabBarPosition = component.$props.tabBarPosition;
  const activeIndex = getActiveIndex(panels, activeKey);
  if (init) {
    // prevent mount animation
    inkBarNodeStyle.display = 'none';
  }
  if (activeTab) {
    const tabNode = activeTab;
    const transformSupported = isTransformSupported(inkBarNodeStyle);

    // Reset current style
    setTransform(inkBarNodeStyle, '');
    inkBarNodeStyle.width = '';
    inkBarNodeStyle.height = '';
    inkBarNodeStyle.left = '';
    inkBarNodeStyle.top = '';
    inkBarNodeStyle.bottom = '';
    inkBarNodeStyle.right = '';

    if (tabBarPosition === 'top' || tabBarPosition === 'bottom') {
      let left = getLeft(tabNode, wrapNode);
      let width = tabNode.offsetWidth;
      // If tabNode'width width equal to wrapNode'width when tabBarPosition is top or bottom
      // It means no css working, then ink bar should not have width until css is loaded
      // Fix https://github.com/ant-design/ant-design/issues/7564
      if (width === rootNode.offsetWidth) {
        width = 0;
      } else if (styles.inkBar && styles.inkBar.width !== undefined) {
        width = parseFloat(styles.inkBar.width, 10);
        if (width) {
          left += (tabNode.offsetWidth - width) / 2;
        }
      }
      // use 3d gpu to optimize render
      if (transformSupported) {
        setTransform(inkBarNodeStyle, `translate3d(${left}px,0,0)`);
      } else {
        inkBarNodeStyle.left = `${left}px`;
      }
      inkBarNodeStyle.width = `${width}px`;
    } else {
      let top = getTop(tabNode, wrapNode, true);
      let height = tabNode.offsetHeight;
      if (styles.inkBar && styles.inkBar.height !== undefined) {
        height = parseFloat(styles.inkBar.height, 10);
        if (height) {
          top += (tabNode.offsetHeight - height) / 2;
        }
      }
      if (transformSupported) {
        setTransform(inkBarNodeStyle, `translate3d(0,${top}px,0)`);
        inkBarNodeStyle.top = '0';
      } else {
        inkBarNodeStyle.top = `${top}px`;
      }
      inkBarNodeStyle.height = `${height}px`;
    }
  }
  inkBarNodeStyle.display = activeIndex !== -1 ? 'block' : 'none';
}

export default {
  name: 'InkTabBarNode',
  mixins: [BaseMixin],
  props: {
    inkBarAnimated: {
      type: Boolean,
      default: true,
    },
    prefixCls: String,
    styles: Object,
    tabBarPosition: String,
    saveRef: PropTypes.func.def(() => {}),
    getRef: PropTypes.func.def(() => {}),
    panels: PropTypes.array,
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  },
  updated() {
    this.$nextTick(function() {
      componentDidUpdate(this);
    });
  },

  mounted() {
    this.$nextTick(function() {
      componentDidUpdate(this, true);
    });
  },
  render() {
    const { prefixCls, styles = {}, inkBarAnimated } = this;
    const className = `${prefixCls}-ink-bar`;
    const classes = {
      [className]: true,
      [inkBarAnimated ? `${className}-animated` : `${className}-no-animated`]: true,
    };
    return (
      <div
        style={styles.inkBar}
        class={classes}
        key="inkBar"
        {...{
          directives: [
            {
              name: 'ant-ref',
              value: this.saveRef('inkBar'),
            },
          ],
        }}
      />
    );
  },
};
