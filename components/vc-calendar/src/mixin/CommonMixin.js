export default {
  methods: {
    getFormat() {
      let { format } = this;
      const { locale, timePicker } = this;
      if (!format) {
        if (timePicker) {
          format = locale.dateTimeFormat;
        } else {
          format = locale.dateFormat;
        }
      }
      return format;
    },
    focus() {
      if (this.focusElement) {
        this.focusElement.focus();
      } else if (this.rootInstance) {
        this.rootInstance.focus();
      }
    },
    saveFocusElement(focusElement) {
      this.focusElement = focusElement;
    },
    saveRoot(root) {
      this.rootInstance = root;
    },
  },
};
