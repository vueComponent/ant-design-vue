import type { PropType } from 'vue';
import { defineComponent, toRefs, ref } from 'vue';
import { Button, CardProps } from 'ant-design-vue';
import { Card } from 'ant-design-vue';
import { Control } from '../icons';
import makeStyle from '../utils/makeStyle';
import classNames from 'ant-design-vue/es/_util/classNames';
import type { MutableTheme, TokenName } from '../interface';
import ComponentTokenDrawer from './ComponentTokenDrawer';

const useStyle = makeStyle('ComponentCard', token => ({
  [`${token.rootCls}-card.component-card`]: {
    borderRadius: 6,
    boxShadow: `0 1px 2px 0 rgba(25,15,15,0.07)`,

    [`${token.rootCls}-card-head`]: {
      paddingInline: 18,

      [`${token.rootCls}-card-head-title`]: {
        paddingBlock: token.paddingSM,
        fontSize: token.fontSize,
      },
    },

    [`${token.rootCls}-card-body`]: {
      padding: 18,
      overflow: 'auto',
    },

    '.component-token-control-icon': {
      color: token.colorIcon,
      transition: `color ${token.motionDurationMid}`,
      fontSize: token.fontSizeLG,
      cursor: 'pointer',

      '&:hover': {
        color: token.colorIconHover,
      },
    },
  },
}));

export const getComponentDemoId = (component: string) => `antdv-token-previewer-${component}`;

export interface ComponentCardProps {
  title: CardProps['title'];
  component?: string;
  onTokenClick?: (token: TokenName) => void;
  drawer?: boolean;
  theme?: MutableTheme;
}

const ComponentCard = defineComponent({
  name: 'ComponentCard',
  inheritAttrs: false,
  props: {
    title: { type: String as PropType<CardProps['title']> },
    component: { type: String },
    onTokenClick: { type: Function as PropType<(token: TokenName) => void> },
    drawer: { type: Boolean },
    theme: { type: Object as PropType<MutableTheme> },
  },
  setup(props, { attrs, slots }) {
    const { component, title, theme, drawer } = toRefs(props);

    const [wrapSSR, hashId] = useStyle();
    const drawerOpen = ref(false);

    return () => {
      return wrapSSR(
        <>
          <Card
            {...attrs}
            class={classNames('component-card', attrs.class, hashId.value)}
            title={title.value}
            v-slots={{
              extra: () =>
                drawer.value &&
                theme.value && (
                  <Button
                    type="text"
                    onClick={e => {
                      e.stopPropagation();
                      drawerOpen.value = true;
                    }}
                  >
                    <Control class="component-token-control-icon" />
                  </Button>
                ),
            }}
          >
            {slots.default && slots.default()}
          </Card>
          {drawer.value && theme.value && (
            <ComponentTokenDrawer
              open={drawerOpen.value}
              theme={theme.value}
              component={component.value}
              onClose={() => (drawerOpen.value = false)}
            />
          )}
        </>,
      );
    };
  },
});

export default ComponentCard;
