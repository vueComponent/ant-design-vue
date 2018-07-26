import _extends from 'babel-runtime/helpers/extends';

import PropTypes from '../_util/vue-types';
import MenuMixin from './MenuMixin';
import BaseMixin from '../_util/BaseMixin';
import hasProp from '../_util/props-util';
import commonPropsType from './commonPropsType';

var Menu = {
  name: 'Menu',
  props: _extends({}, commonPropsType, {
    selectable: PropTypes.bool.def(true)
  }),
  mixins: [BaseMixin, MenuMixin],

  data: function data() {
    var props = this.$props;
    var sSelectedKeys = props.defaultSelectedKeys;
    var sOpenKeys = props.defaultOpenKeys;
    if (hasProp(this, 'selectedKeys')) {
      sSelectedKeys = props.selectedKeys || [];
    }
    if (hasProp(this, 'openKeys')) {
      sOpenKeys = props.openKeys || [];
    }

    // this.isRootMenu = true
    return {
      sSelectedKeys: sSelectedKeys,
      sOpenKeys: sOpenKeys
    };
  },

  watch: {
    '$props': {
      handler: function handler(nextProps) {
        if (hasProp(this, 'selectedKeys')) {
          this.setState({
            sSelectedKeys: nextProps.selectedKeys || []
          });
        }
        if (hasProp(this, 'openKeys')) {
          this.setState({
            sOpenKeys: nextProps.openKeys || []
          });
        }
      },
      deep: true
    }
  },
  methods: {
    // onDestroy (key) {
    //   const state = this.$data
    //   const sSelectedKeys = state.sSelectedKeys
    //   const sOpenKeys = state.sOpenKeys
    //   let index = sSelectedKeys.indexOf(key)
    //   if (!hasProp(this, 'selectedKeys') && index !== -1) {
    //     sSelectedKeys.splice(index, 1)
    //   }
    //   index = sOpenKeys.indexOf(key)
    //   if (!hasProp(this, 'openKeys') && index !== -1) {
    //     sOpenKeys.splice(index, 1)
    //   }
    // },

    onSelect: function onSelect(selectInfo) {
      var props = this.$props;
      if (props.selectable) {
        // root menu
        var sSelectedKeys = this.$data.sSelectedKeys;
        var selectedKey = selectInfo.key;
        if (props.multiple) {
          sSelectedKeys = sSelectedKeys.concat([selectedKey]);
        } else {
          sSelectedKeys = [selectedKey];
        }
        if (!hasProp(this, 'selectedKeys')) {
          this.setState({
            sSelectedKeys: sSelectedKeys
          });
        }
        this.__emit('select', _extends({}, selectInfo, {
          selectedKeys: sSelectedKeys
        }));
      }
    },
    onClick: function onClick(e) {
      this.__emit('click', e);
    },
    onOpenChange: function onOpenChange(event) {
      var sOpenKeys = this.$data.sOpenKeys.concat();
      var changed = false;
      var processSingle = function processSingle(e) {
        var oneChanged = false;
        if (e.open) {
          oneChanged = sOpenKeys.indexOf(e.key) === -1;
          if (oneChanged) {
            sOpenKeys.push(e.key);
          }
        } else {
          var index = sOpenKeys.indexOf(e.key);
          oneChanged = index !== -1;
          if (oneChanged) {
            sOpenKeys.splice(index, 1);
          }
        }
        changed = changed || oneChanged;
      };
      if (Array.isArray(event)) {
        // batch change call
        event.forEach(processSingle);
      } else {
        processSingle(event);
      }
      if (changed) {
        if (!hasProp(this, 'openKeys')) {
          this.setState({ sOpenKeys: sOpenKeys });
        }
        this.__emit('openChange', sOpenKeys);
      }
    },
    onDeselect: function onDeselect(selectInfo) {
      var props = this.$props;
      if (props.selectable) {
        var sSelectedKeys = this.$data.sSelectedKeys.concat();
        var selectedKey = selectInfo.key;
        var index = sSelectedKeys.indexOf(selectedKey);
        if (index !== -1) {
          sSelectedKeys.splice(index, 1);
        }
        if (!hasProp(this, 'selectedKeys')) {
          this.setState({
            sSelectedKeys: sSelectedKeys
          });
        }
        this.__emit('deselect', _extends({}, selectInfo, {
          selectedKeys: sSelectedKeys
        }));
      }
    },
    getOpenTransitionName: function getOpenTransitionName() {
      var props = this.$props;
      var transitionName = props.openTransitionName;
      var animationName = props.openAnimation;
      if (!transitionName && typeof animationName === 'string') {
        transitionName = props.prefixCls + '-open-' + animationName;
      }
      return transitionName;
    },
    isInlineMode: function isInlineMode() {
      return this.$props.mode === 'inline';
    },
    lastOpenSubMenu: function lastOpenSubMenu() {
      var lastOpen = [];
      var sOpenKeys = this.$data.sOpenKeys;

      if (sOpenKeys.length) {
        lastOpen = this.getFlatInstanceArray().filter(function (c) {
          return c && sOpenKeys.indexOf(c.eventKey) !== -1;
        });
      }
      return lastOpen[0];
    },
    renderMenuItem: function renderMenuItem(c, i, subIndex) {
      if (!c) {
        return null;
      }
      var state = this.$data;
      var extraProps = {
        openKeys: state.sOpenKeys,
        selectedKeys: state.sSelectedKeys,
        triggerSubMenuAction: this.$props.triggerSubMenuAction,
        isRootMenu: this.isRootMenu
      };
      return this.renderCommonMenuItem(c, i, subIndex, extraProps);
    }
  },

  render: function render() {
    var props = _extends({}, this.$props);
    props['class'] = ' ' + props.prefixCls + '-root';
    return this.renderRoot(props, this.$slots['default']);
  }
};
export default Menu;