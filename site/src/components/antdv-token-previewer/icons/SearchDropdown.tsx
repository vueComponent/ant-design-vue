import type { CSSProperties } from 'vue';
import { defineComponent } from 'vue';

const SearchDropdown = defineComponent({
  name: 'SearchDropdown',
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
          viewBox="0 0 18 18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            id="SearchDropdown-\u9875\u9762-1"
            stroke="none"
            stroke-width="1"
            fill="none"
            fill-rule="evenodd"
          >
            <g
              id="SearchDropdown-\u4E3B\u9898\u9884\u89C8\u5668---\u7EC4\u4EF6\u9884\u89C8"
              transform="translate(-23.000000, -198.000000)"
              fill-rule="nonzero"
            >
              <g id="SearchDropdown-\u7F16\u7EC4-18" transform="translate(0.000000, 70.000000)">
                <g id="SearchDropdown-search-outlined" transform="translate(7.000000, 5.000000)">
                  <rect
                    id="SearchDropdown-\u77E9\u5F62"
                    fill="#000000"
                    opacity="0"
                    x="0"
                    y="0"
                    width="18"
                    height="18"
                  ></rect>
                  <path
                    d="M15.958,14.99375 L11.41325,10.449 C12.1185,9.53725 12.5,8.4225 12.5,7.25 C12.5,5.8465 11.95225,4.5305 10.96175,3.53825 C9.97125,2.546 8.65175,2 7.25,2 C5.84825,2 4.52875,2.54775 3.53825,3.53825 C2.546,4.52875 2,5.8465 2,7.25 C2,8.65175 2.54775,9.97125 3.53825,10.96175 C4.52875,11.954 5.8465,12.5 7.25,12.5 C8.4225,12.5 9.5355,12.1185 10.44725,11.415 L14.992,15.958 C15.048,16.014 15.139,16.014 15.195,15.958 L15.958,15.19675 C16.014,15.14075 16.014,15.04975 15.958,14.99375 Z M10.022,10.022 C9.28,10.76225 8.2965,11.17 7.25,11.17 C6.2035,11.17 5.22,10.76225 4.478,10.022 C3.73775,9.28 3.33,8.2965 3.33,7.25 C3.33,6.2035 3.73775,5.21825 4.478,4.478 C5.22,3.73775 6.2035,3.33 7.25,3.33 C8.2965,3.33 9.28175,3.736 10.022,4.478 C10.76225,5.22 11.17,6.2035 11.17,7.25 C11.17,8.2965 10.76225,9.28175 10.022,10.022 Z"
                    id="SearchDropdown-\u5F62\u72B6"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M17.8616348,7.7578125 L14.0131973,7.7578125 C13.8977676,7.7578125 13.8333145,7.8796875 13.9047988,7.96289062 L15.8290176,10.1941406 C15.8840957,10.2580078 15.9901504,10.2580078 16.0458145,10.1941406 L17.9700332,7.96289062 C18.0415176,7.8796875 17.9770645,7.7578125 17.8616348,7.7578125 Z"
                    id="SearchDropdown-\u8DEF\u5F84"
                    fill="currentColor"
                  ></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
      );
    };
  },
});

export default SearchDropdown;
