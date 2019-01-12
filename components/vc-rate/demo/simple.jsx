import Rate from '../index';
import '../assets/index.less';

export default {
  data() {
    return {};
  },
  methods: {
    onChange(v) {
      console.log('selected star', v);
    },
    onFocus() {
      console.dir('focus');
    },
  },
  render() {
    const { onChange, onFocus } = this;
    const rateProps = {
      props: {
        defaultValue: 2.5,
        allowHalf: true,
      },
      on: {
        change: onChange,
      },
      style: {
        fontSize: '50px',
        marginTop: '24px',
      },
    };
    const rateProps1 = {
      props: {
        defaultValue: 2,
      },
      on: {
        change: onChange,
      },
      style: {
        fontSize: '50px',
        marginTop: '24px',
      },
    };
    return (
      <div style="margin: 100px">
        <Rate
          defaultValue={2.5}
          onChange={onChange}
          onFocus={onFocus}
          style="fontSize: 40px"
          allowHalf
          allowClear={false}
          autoFocus
          disabled
        />
        <br />
        <Rate
          defaultValue={2.5}
          onChange={onChange}
          style="fontSize: 50px; marginTop: 24px"
          allowHalf
          character="$"
        />
        <br />
        <Rate {...rateProps}>
          <i slot="character" class="anticon anticon-star" />
        </Rate>
        <br />
        <Rate {...rateProps1}>
          <i slot="character" class="anticon anticon-star" />
        </Rate>
      </div>
    );
  },
};
