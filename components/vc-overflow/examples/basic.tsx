import { defineComponent, ref } from 'vue';
import Overflow from '..';
import '../assets/index.less';
import './common.less';

interface ItemType {
  value: string | number;
  label: string;
}

function createData(count: number): ItemType[] {
  const data: ItemType[] = new Array(count).fill(undefined).map((_, index) => ({
    value: index,
    label: `Label ${index}`,
  }));

  return data;
}

function renderItem(item: ItemType) {
  return (
    <div
      style={{
        margin: '0 16px 0 8px',
        padding: '4px 8px',
        background: 'rgba(255, 0, 0, 0.2)',
      }}
    >
      {item.label}
    </div>
  );
}

function renderRest(items: ItemType[]) {
  return (
    <div
      style={{
        margin: '0 16px 0 8px',
        padding: '4px 8px',
        background: 'rgba(255, 0, 0, 0.2)',
      }}
    >
      +{items.length}...
    </div>
  );
}
export default defineComponent({
  setup() {
    const responsive = ref(true);
    const data = ref(createData(1));
    return () => {
      return (
        <div style={{ padding: '32px' }}>
          <button
            type="button"
            onClick={() => {
              responsive.value = !responsive.value;
            }}
          >
            {responsive.value ? 'Responsive' : 'MaxCount: 6'}
          </button>
          <select
            style={{ width: '200px', height: '32px' }}
            value={data.value.length}
            onChange={(e: any) => {
              data.value = createData(Number(e.target.value));
            }}
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={200}>200</option>
          </select>

          <div
            style={{
              border: '5px solid green',
              padding: '8px',
              maxWidth: '300px',
              marginTop: '32px',
            }}
          >
            <Overflow
              data={data.value}
              renderItem={renderItem}
              renderRest={renderRest}
              maxCount={responsive.value ? 'responsive' : 6}
            />
          </div>
        </div>
      );
    };
  },
});
