<template>
  <div class="login">
    <a-form :form="form" @submit="handleSubmit">
      <div v-if="tabs.length > 0">
        <a-tabs :animated="false" class="tabs" :active-key="type" @change="onSwitch">
          <v-nodes :value="children.tabChildren" />
        </a-tabs>
        <v-nodes :value="children.otherChildren" />
      </div>
      <slot v-else />
    </a-form>
  </div>
</template>
<script>
export default {
  provide() {
    const { tabs, form } = this;
    return {
      loginContext: {
        tabUtil: {
          addTab: id => {
            this.tabs = [...tabs, id];
          },
          removeTab: id => {
            this.tabs = tabs.filter(currentId => currentId !== id);
          },
        },
        form,
        updateActive: activeItem => {
          const { type, active } = this;
          if (active[type]) {
            active[type].push(activeItem);
          } else {
            active[type] = [activeItem];
          }
        },
      },
    };
  },
  props: {
    defaultActiveKey: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      type: this.defaultActiveKey,
      tabs: [],
      active: {},
    };
  },
  computed: {
    children() {
      const children = this.$slots.default();
      const tabChildren = [];
      const otherChildren = [];

      children.forEach(item => {
        if (!item) {
          return;
        }
        if (
          item.componentOptions &&
          item.componentOptions.Ctor.extendOptions.typeName === 'LoginTab'
        ) {
          tabChildren.push(item);
        } else {
          otherChildren.push(item);
        }
      });
      return {
        tabChildren,
        otherChildren,
      };
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      const { type, form } = this;
      const activeFileds = this.active[type];
      form.validateFields(activeFileds, { force: true }, (err, values) => {
        this.$emit('submit', err, values);
      });
    },
    onSwitch(type) {
      this.type = type;
      this.$emit('tabChange', type);
    },
  },
};
</script>
