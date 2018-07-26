import _defineProperty from 'babel-runtime/helpers/defineProperty';

import Icon from '../icon';

export default {
  name: 'AAvatar',
  props: {
    prefixCls: {
      type: String,
      'default': 'ant-avatar'
    },
    shape: {
      validator: function validator(val) {
        return ['circle', 'square'].includes(val);
      },
      'default': 'circle'
    },
    size: {
      validator: function validator(val) {
        return ['small', 'large', 'default'].includes(val);
      },
      'default': 'default'
    },
    src: String,
    icon: String
  },
  data: function data() {
    return {
      isExistSlot: false,
      childrenWidth: 0,
      scale: 1
    };
  },

  computed: {
    classes: function classes() {
      var _ref;

      var prefixCls = this.prefixCls,
          shape = this.shape,
          size = this.size,
          src = this.src,
          icon = this.icon;

      return _ref = {}, _defineProperty(_ref, '' + prefixCls, true), _defineProperty(_ref, prefixCls + '-image', !!src), _defineProperty(_ref, prefixCls + '-icon', !!icon), _defineProperty(_ref, prefixCls + '-' + shape, true), _defineProperty(_ref, prefixCls + '-lg', size === 'large'), _defineProperty(_ref, prefixCls + '-sm', size === 'small'), _ref;
    },
    childrenStyle: function childrenStyle() {
      var style = {};
      var scale = this.scale,
          isExistSlot = this.isExistSlot,
          childrenWidth = this.childrenWidth;

      if (isExistSlot) {
        style = {
          msTransform: 'scale(' + scale + ')',
          WebkitTransform: 'scale(' + scale + ')',
          transform: 'scale(' + scale + ')',
          position: 'absolute',
          display: 'inline-block',
          left: 'calc(50% - ' + Math.round(childrenWidth / 2) + 'px)'
        };
      }
      return style;
    }
  },
  methods: {
    setScale: function setScale() {
      var src = this.src,
          icon = this.icon,
          $refs = this.$refs,
          $el = this.$el;

      var children = $refs.avatorChildren;
      this.isExistSlot = !src && !icon;
      if (children) {
        this.childrenWidth = children.offsetWidth;
        var avatarWidth = $el.getBoundingClientRect().width;
        if (avatarWidth - 8 < this.childrenWidth) {
          this.scale = (avatarWidth - 8) / this.childrenWidth;
        } else {
          this.scale = 1;
        }
      }
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.setScale();
    });
  },
  updated: function updated() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.setScale();
    });
  },
  render: function render() {
    var h = arguments[0];
    var classes = this.classes,
        prefixCls = this.prefixCls,
        src = this.src,
        icon = this.icon,
        childrenStyle = this.childrenStyle,
        $slots = this.$slots;

    return h(
      'span',
      { 'class': classes },
      [src ? h('img', {
        attrs: { src: src }
      }) : icon ? h(Icon, {
        attrs: { type: icon }
      }) : h(
        'span',
        {
          ref: 'avatorChildren',
          'class': prefixCls + '-string',
          style: childrenStyle },
        [$slots['default']]
      )]
    );
  }
};