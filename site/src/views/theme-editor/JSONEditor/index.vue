<template>
  <div ref="editor" class="svelte-jsoneditor-vue"></div>
</template>

<script>
import { JSONEditor, Mode } from 'vanilla-jsoneditor';
// JSONEditor properties as of version 0.3.60
const propNames = [
  'content',
  'mode',
  'mainMenuBar',
  'navigationBar',
  'statusBar',
  'readOnly',
  'indentation',
  'tabSize',
  'escapeControlCharacters',
  'escapeUnicodeCharacters',
  'validator',
  'onError',
  'onChange',
  'onChangeMode',
  'onClassName',
  'onRenderValue',
  'onRenderMenu',
  'queryLanguages',
  'queryLanguageId',
  'onChangeQueryLanguage',
  'onFocus',
  'onBlur',
];

function pickDefinedProps(object, propNames) {
  const props = {};
  for (const propName of propNames) {
    if (object[propName] !== undefined) {
      props[propName] = object[propName];
    }
  }
  return props;
}

export default {
  name: 'VueJSONEditor',
  props: propNames,
  mounted() {
    this.editor = new JSONEditor({
      target: this.$refs['editor'],
      props: {
        ...pickDefinedProps(this, propNames),
        mode: Mode.text,
      },
    });
  },
  updated() {
    const props = pickDefinedProps(this, propNames);
    this.editor.updateProps(props);
  },
  beforeUnmount() {
    this.editor.destroy();
    this.editor = null;
  },
};
</script>

<style scoped>
.svelte-jsoneditor-vue {
  display: flex;
  flex: 1;
}
</style>
