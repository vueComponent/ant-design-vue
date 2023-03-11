import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context';
import { PropType, toRefs } from 'vue';
import { defineComponent } from 'vue';

import getColorBgImg from '../utils/getColorBgImg';
import getDesignToken from '../utils/getDesignToken';

export type TokenPreviewProps = {
  theme: ThemeConfig;
  tokenName: string;
  type?: string;
};

const TokenPreview = defineComponent({
  name: 'TokenPreview',
  props: {
    theme: { type: Object as PropType<ThemeConfig> },
    tokenName: { type: String },
    type: { type: String },
  },
  setup(props) {
    const { theme, tokenName, type } = toRefs(props);

    return () => {
      if (type.value === 'Color') {
        return (
          <div
            style={{
              background: `${getColorBgImg(false)} 0% 0% / 28px`,
              width: '100%',
              height: '100%',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: (getDesignToken(theme.value) as any)[tokenName.value],
                transition: 'background-color 0.2s',
              }}
            />
          </div>
        );
      }
      if (type.value === 'FontSize') {
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              background: `${getColorBgImg(false)} 0% 0% / 28px`,
              fontSize: `${(getDesignToken(theme.value) as any)[tokenName.value]}px`,
              fontWeight: 700,
            }}
          >
            <span>Aa</span>
          </div>
        );
      }
      if (type.value === 'LineHeight') {
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              overflow: 'hidden',
              background: `${getColorBgImg(false)} 0% 0% / 28px`,
            }}
          >
            <span
              style={{
                fontSize: `${
                  (getDesignToken(theme.value) as any)[
                    tokenName.value.replace('lineHeight', 'fontSize')
                  ]
                }px`,
                lineHeight: (getDesignToken(theme.value) as any)[tokenName.value],
                background: '#fff2f0',
                paddingInline: '8px',
              }}
            >
              Aa
            </span>
          </div>
        );
      }
      if (type.value === 'Margin') {
        const margin = (getDesignToken(theme.value) as any)[tokenName.value];
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              background: `${getColorBgImg(false)} 0% 0% / 28px`,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                background: '#fff1b8',
                transform: 'translate(10%, 10%) scale(0.8)',
              }}
            >
              <div
                style={{
                  marginLeft: `${margin}px`,
                  marginTop: `${margin}px`,
                  width: `calc(100% - ${margin}px)`,
                  height: `calc(100% - ${margin}px)`,
                  background: '#bae0ff',
                }}
              />
            </div>
          </div>
        );
      }
      if (type.value === 'Padding') {
        const padding = `${(getDesignToken(theme.value) as any)[tokenName.value]}px`;
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              background: `${getColorBgImg(false)} 0% 0% / 28px`,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                background: '#d9f7be',
                transform: 'translate(10%, 10%) scale(0.8)',
                paddingLeft: padding,
                paddingTop: padding,
              }}
            >
              <div
                style={{
                  width: `100%`,
                  height: `100%`,
                  background: '#bae0ff',
                }}
              />
            </div>
          </div>
        );
      }
      if (type.value === 'BorderRadius') {
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              background: `${getColorBgImg(false)} 0% 0% / 28px`,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                transform: 'translate(30%, 30%)',
                border: '2px solid rgba(0,0,0,0.45)',
                background: '#fff',
                borderRadius: `${(getDesignToken(theme.value) as any)[tokenName.value]}px`,
              }}
            />
          </div>
        );
      }
      if (type.value === 'BoxShadow') {
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${getColorBgImg(false)} 0% 0% / 28px`,
            }}
          >
            <div
              style={{
                width: '60%',
                height: '50%',
                borderRadius: '6px',
                background: '#fff',
                border: '1px solid #d9d9d9',
                boxShadow: (getDesignToken(theme.value) as any)[tokenName.value],
              }}
            />
          </div>
        );
      }
      return null;
    };
  },
});

export default TokenPreview;
