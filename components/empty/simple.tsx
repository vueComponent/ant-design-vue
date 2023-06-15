import { TinyColor } from '@ctrl/tinycolor';
import { computed, defineComponent } from 'vue';
import { useToken } from '../theme/internal';

const Simple = defineComponent({
  compatConfig: { MODE: 3 },
  setup() {
    const [, token] = useToken();

    const color = computed(() => {
      const { colorFill, colorFillTertiary, colorFillQuaternary, colorBgContainer } = token.value;

      return {
        borderColor: new TinyColor(colorFill).onBackground(colorBgContainer).toHexString(),
        shadowColor: new TinyColor(colorFillTertiary).onBackground(colorBgContainer).toHexString(),
        contentColor: new TinyColor(colorFillQuaternary)
          .onBackground(colorBgContainer)
          .toHexString(),
      };
    });

    return () => (
      <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
          <ellipse fill={color.value.shadowColor} cx="32" cy="33" rx="32" ry="7" />
          <g fill-rule="nonzero" stroke={color.value.borderColor}>
            <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z" />
            <path
              d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
              fill={color.value.contentColor}
            />
          </g>
        </g>
      </svg>
    );
  },
});

Simple.PRESENTED_IMAGE_SIMPLE = true;
export default Simple;
