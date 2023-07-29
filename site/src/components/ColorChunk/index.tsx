import { defineComponent, toRefs, computed } from 'vue';
import type { CSSProperties, PropType } from 'vue';
import { TinyColor, type ColorInput } from '@ctrl/tinycolor';
import useSiteToken from '../../hooks/useSiteToken';

const ColorChunk = defineComponent({
  props: {
    color: {
      type: String as PropType<ColorInput>,
      default: '#000',
    },
  },
  setup(props, { attrs, slots }) {
    const SiteToken = useSiteToken();

    const token = computed(() => SiteToken.value.token);

    const { color } = toRefs(props);

    const dotColor = computed(() => {
      const _color = new TinyColor(color.value).toHex8String();
      return _color.endsWith('ff') ? _color.slice(0, -2) : _color;
    });

    return () => {
      return (
        <span
          {...attrs}
          style={{
            padding: '0.2em 0.4em',
            fontSize: '0.9em',
            background: token.value.siteMarkdownCodeBg,
            borderRadius: `${token.value.borderRadius}px`,
            fontFamily: 'monospace',
            ...(attrs.style as CSSProperties),
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: `${token.value.borderRadiusSM}px`,
              marginRight: '4px',
              border: `1px solid ${token.value.colorSplit}`,
              backgroundColor: dotColor.value,
            }}
          />
          {slots.default ? slots.default() : dotColor.value}
        </span>
      );
    };
  },
});

export default ColorChunk;
