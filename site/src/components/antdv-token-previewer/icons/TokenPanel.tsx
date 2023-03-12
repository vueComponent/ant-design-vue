import type { CSSProperties } from 'vue';
import { defineComponent } from 'vue';

const TokenPanel = defineComponent({
  name: 'TokenPanel',
  setup(_, { attrs }) {
    return () => {
      return (
        <svg
          {...attrs}
          width="1em"
          height="1em"
          style={{
            verticalAlign: '-0.125em',
            ...(attrs.style as CSSProperties),
          }}
          class={['nanqu-token-panel-icon', attrs.class].filter(Boolean).join(' ')}
          viewBox="0 0 20 19"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            id="TokenPanel-\u9875\u9762-1"
            stroke="none"
            stroke-width="1"
            fill="none"
            fill-rule="evenodd"
            fill-opacity="0.85"
          >
            <g
              id="TokenPanel-\u4E3B\u9898\u7F16\u8F91\u5668---\u591A\u4E3B\u9898"
              transform="translate(-14.000000, -70.000000)"
              fill="currentColor"
            >
              <g id="TokenPanel-\u7F16\u7EC4-3" transform="translate(10.000000, 66.000000)">
                <g id="TokenPanel-\u7F16\u7EC4-20" transform="translate(4.000000, 4.000000)">
                  <rect
                    id="TokenPanel-\u77E9\u5F62"
                    opacity="0.600000024"
                    x="1"
                    y="12"
                    width="7"
                    height="7"
                    rx="0.434782594"
                  ></rect>
                  <path
                    d="M12.3540059,0 L19.5652174,0 C19.8053412,8.08981097e-16 20,0.194658804 20,0.434782609 L20,7.6459941 C20,7.88611791 19.8053412,8.08077671 19.5652174,8.08077671 C19.4499059,8.08077671 19.3393172,8.03496939 19.2577797,7.95343183 L12.0465682,0.74222034 C11.876775,0.572427169 11.876775,0.297138048 12.0465682,0.127344878 C12.1281057,0.0458073219 12.2386944,-6.44951433e-16 12.3540059,0 Z"
                    id="TokenPanel-\u77E9\u5F62"
                    opacity="0.400000006"
                  ></path>
                  <circle
                    id="TokenPanel-\u692D\u5706\u5F62"
                    cx="4.34782609"
                    cy="4.34782609"
                    r="4.34782609"
                  ></circle>
                  <circle id="TokenPanel-\u692D\u5706\u5F62" cx="15.5" cy="15.5" r="3.5"></circle>
                </g>
              </g>
            </g>
          </g>
        </svg>
      );
    };
  },
});

export default TokenPanel;
