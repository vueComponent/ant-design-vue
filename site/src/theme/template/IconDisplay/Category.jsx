import { message } from 'ant-design-vue';
import { defineComponent } from 'vue';
import CopyableIcon from './CopyableIcon.vue';

const Category = defineComponent({
  props: ['icons', 'title', 'newIcons', 'theme'],
  data() {
    return {
      justCopied: null,
    };
  },
  methods: {
    onCopied(type, text) {
      message.success(
        <span>
          <code class="copied-code">{text}</code> copied 🎉
        </span>,
      );
      this.justCopied = type;
      setTimeout(() => {
        this.justCopied = null;
      }, 2000);
    },
  },
  render() {
    const { icons, title, theme, newIcons } = this.$props;
    const items = icons.map(name => {
      return (
        <CopyableIcon
          key={name}
          name={name}
          type={name}
          theme={theme}
          isNew={newIcons.indexOf(name) >= 0}
          justCopied={this.justCopied}
          onCopied={this.onCopied}
        />
      );
    });
    return (
      <div>
        <h3 style="margin: 1.6em 0 .6em;">
          {this.$t(`app.docs.components.icon.category.${title}`)}
        </h3>
        <ul class={'anticons-list'}>{items}</ul>
      </div>
    );
  },
});

export default Category;
