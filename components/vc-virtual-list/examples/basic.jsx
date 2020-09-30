/* eslint-disable no-console */
import { reactive, ref } from 'vue';

import List from '../List';
import './basic.less';

const MyItem = (_, { attrs: { id } }) => (
  <span
    // style={{
    //   // height: 30 + (id % 2 ? 0 : 10),
    // }}
    class="fixed-item"
    onClick={() => {
      console.log('Click:', id);
    }}
  >
    {id}
  </span>
);

const TestItem = {
  render() {
    return <div style={{ lineHeight: '30px' }}>{this.$attrs.id}</div>;
  },
};

const data = [];
for (let i = 0; i < 1000; i += 1) {
  data.push({
    id: String(i),
  });
}

const TYPES = [
  { name: 'ref real dom element', type: 'dom' },
  { name: 'ref vue node', type: 'vue' },
];

const onScroll = e => {
  console.log('scroll:', e.currentTarget.scrollTop);
};

const state = reactive({
  destroy: false,
  visible: true,
  type: 'dom',
});

const listRef = ref(null);
const Demo = () => {
  const { destroy, visible, type } = state;
  return (
    <div style={{ height: '200vh' }}>
      <h2>Basic</h2>
      {TYPES.map(({ name, type: nType }) => (
        <label key={nType}>
          <input
            name="type"
            type="radio"
            checked={type === nType}
            onChange={() => {
              state.type = nType;
            }}
          />
          {name}
        </label>
      ))}

      <button
        type="button"
        onClick={() => {
          listRef.value.scrollTo(100);
        }}
      >
        Scroll To 100px
      </button>
      <button
        type="button"
        onClick={() => {
          listRef.value.scrollTo({
            index: 50,
            align: 'top',
          });
        }}
      >
        Scroll To 50 (top)
      </button>
      <button
        type="button"
        onClick={() => {
          listRef.value.scrollTo({
            index: 50,
            align: 'bottom',
          });
        }}
      >
        Scroll To 50 (bottom)
      </button>
      <button
        type="button"
        onClick={() => {
          listRef.value.scrollTo({
            index: 50,
            align: 'auto',
          });
        }}
      >
        Scroll To 50 (auto)
      </button>
      <button
        type="button"
        onClick={() => {
          listRef.value.scrollTo({
            index: 50,
            align: 'top',
            offset: 15,
          });
        }}
      >
        Scroll To 50 (top) + 15 offset
      </button>
      <button
        type="button"
        onClick={() => {
          listRef.value.scrollTo({
            index: 50,
            align: 'bottom',
            offset: 15,
          });
        }}
      >
        Scroll To 50 (bottom) + 15 offset
      </button>
      <button
        type="button"
        onClick={() => {
          listRef.value.scrollTo({
            key: '50',
            align: 'auto',
          });
        }}
      >
        Scroll To key 50 (auto)
      </button>

      <button
        type="button"
        onClick={() => {
          state.visible = !state.visible;
        }}
      >
        visible
      </button>

      <button
        type="button"
        onClick={() => {
          listRef.value.scrollTo({
            index: data.length - 2,
            align: 'top',
          });
        }}
      >
        Scroll To Last (top)
      </button>
      <button
        type="button"
        onClick={() => {
          listRef.value.scrollTo({
            index: 0,
            align: 'bottom',
          });
        }}
      >
        Scroll To First (bottom)
      </button>

      <button
        type="button"
        onClick={() => {
          listRef.value.scrollTo({
            index: 50,
            align: 'top',
          });
          state.destroy = true;
        }}
      >
        Scroll To remove
      </button>

      {!destroy && (
        <List
          id="list"
          ref={listRef}
          data={data}
          height={200}
          itemHeight={20}
          itemKey="id"
          style={{
            border: '1px solid red',
            boxSizing: 'border-box',
            display: visible ? null : 'none',
          }}
          onScroll={onScroll}
          children={(item, _, props) =>
            type === 'dom' ? <MyItem {...item} {...props} /> : <TestItem {...item} {...props} />
          }
        ></List>
      )}
    </div>
  );
};

export default Demo;

/* eslint-enable */
