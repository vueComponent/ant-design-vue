import { defineComponent, toRefs } from 'vue';
import type { CSSProperties } from 'vue';
import classNames from 'ant-design-vue/es/_util/classNames';
import makeStyle from './utils/makeStyle';
import getColorBgImg from './utils/getColorBgImg';

export type ColorPreviewProps = {
  color: string;
  dark?: boolean;
};

const useStyle = makeStyle('ColorPreview', () => ({
  '.previewer-color-preview': {
    width: '20px',
    height: '20px',
    position: 'relative',
    borderRadius: '50%',
    padding: 0,
    display: 'inline-block',

    '&::before': {
      content: '""',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      top: 0,
      insetInlineStart: 0,
      position: 'absolute',
      zIndex: 2,
      backgroundColor: 'var(--antd-token-previewer-color-preview)',
      boxShadow: '0 2px 3px -1px rgba(0,0,0,0.20), inset 0 0 0 1px rgba(0,0,0,0.09)',
    },
  },
}));

const ColorPreview = defineComponent({
  name: 'ColorPreview',
  inheritAttrs: false,
  props: {
    color: { type: String },
    dark: { type: Boolean },
  },
  setup(props, { attrs }) {
    const { color, dark } = toRefs(props);

    const [warpSSR, hashId] = useStyle();

    return () => {
      return warpSSR(
        <div
          {...attrs}
          class={classNames('previewer-color-preview', attrs.class, hashId.value)}
          style={[
            {
              // @ts-ignore
              ['--antd-token-previewer-color-preview']: color.value,
              ...(attrs.style as CSSProperties),
            },
          ]}
        >
          <div
            style={{
              content: '""',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              top: '1px',
              insetInlineStart: '1px',
              position: 'absolute',
              zIndex: 1,
              background: `${getColorBgImg(dark.value)} 0% 0% / 20px`,
            }}
          />
        </div>,
      );
    };
  },
});

export default ColorPreview;
