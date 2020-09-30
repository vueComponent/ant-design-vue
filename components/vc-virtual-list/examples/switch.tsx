/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */
import * as React from 'react';
import List from '../src/List';

interface Item {
  id: number;
}

const MyItem: React.FC<Item> = ({ id }, ref) => (
  <span
    ref={ref}
    style={{
      border: '1px solid gray',
      padding: '0 16px',
      height: 30,
      lineHeight: '30px',
      boxSizing: 'border-box',
      display: 'inline-block',
    }}
  >
    {id}
  </span>
);

const ForwardMyItem = React.forwardRef(MyItem);

function getData(count: number) {
  const data: Item[] = [];
  for (let i = 0; i < count; i += 1) {
    data.push({
      id: i,
    });
  }
  return data;
}

const Demo = () => {
  const [height, setHeight] = React.useState(100);
  const [data, setData] = React.useState(getData(20));

  return (
    <React.StrictMode>
      <div style={{ height: '150vh' }}>
        <h2>Switch</h2>
        <span
          onChange={(e: any) => {
            setData(getData(Number(e.target.value)));
          }}
        >
          Data
          <label>
            <input type="radio" name="switch" value={0} />0
          </label>
          <label>
            <input type="radio" name="switch" value={2} />2
          </label>
          <label>
            <input type="radio" name="switch" value={100} />
            100
          </label>
          <label>
            <input type="radio" name="switch" value={200} />
            200
          </label>
          <label>
            <input type="radio" name="switch" value={1000} />
            1000
          </label>
        </span>
        <span
          onChange={(e: any) => {
            setHeight(Number(e.target.value));
          }}
        >
          | Height
          <label>
            <input type="radio" name="switch" value={0} />0
          </label>
          <label>
            <input type="radio" name="switch" value={100} />
            100
          </label>
          <label>
            <input type="radio" name="switch" value={200} />
            200
          </label>
        </span>

        <List
          data={data}
          height={height}
          itemHeight={30}
          itemKey="id"
          style={{
            border: '1px solid red',
            boxSizing: 'border-box',
          }}
        >
          {(item, _, props) => <ForwardMyItem {...item} {...props} />}
        </List>
      </div>
    </React.StrictMode>
  );
};

export default Demo;
