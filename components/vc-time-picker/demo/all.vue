<script>
import '../assets/index.less';

import moment from 'moment';

import TimePicker from '../index';

const format = 'h:mm a';

const now = moment()
  .hour(0)
  .minute(0);

function onChange(value) {
  console.log(value && value.format(format));
}

const showSecond = true;
const str = showSecond ? 'HH:mm:ss' : 'HH:mm';

const now1 = moment()
  .hour(14)
  .minute(30);

function generateOptions(length, excludedOptions) {
  const arr = [];
  for (let value = 0; value < length; value++) {
    if (excludedOptions.indexOf(value) < 0) {
      arr.push(value);
    }
  }
  return arr;
}

function onChange1(value) {
  console.log(value && value.format(str));
}

function disabledHours() {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23];
}

function disabledMinutes(h) {
  switch (h) {
    case 9:
      return generateOptions(60, [30]);
    case 21:
      return generateOptions(60, [0]);
    default:
      return generateOptions(60, [0, 30]);
  }
}

function disabledSeconds(h, m) {
  return [h + (m % 60)];
}

export default {
  data() {
    return {
      open: false,
      value: moment(),
    };
  },
  methods: {
    setOpen({ open }) {
      this.open = open;
    },
    toggleOpen() {
      this.open = !this.open;
    },
    handleValueChange(value) {
      console.log(value && value.format('HH:mm:ss'));
      this.value = value;
    },
    clear() {
      this.value = undefined;
    },
  },
  render() {
    return (
      <div>
        <TimePicker
          showSecond={false}
          defaultValue={now}
          class="xxx"
          onChange={onChange}
          format={format}
          use12Hours
          inputReadOnly
        />
        <br />
        <br />
        <div>
          <h3>Disabled picker</h3>
          <TimePicker defaultValue={now1} disabled onChange={onChange1} />
          <h3>Disabled options</h3>
          <TimePicker
            showSecond={showSecond}
            defaultValue={now1}
            class="xxx"
            onChange={onChange1}
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            disabledSeconds={disabledSeconds}
          />
        </div>
        <div>
          <TimePicker defaultValue={moment()} showHour={false} />
          <TimePicker defaultValue={moment()} showMinute={false} />
          <TimePicker defaultValue={moment()} showSecond={false} />

          <TimePicker defaultValue={moment()} showMinute={false} showSecond={false} />
          <TimePicker defaultValue={moment()} showHour={false} showSecond={false} />
          <TimePicker defaultValue={moment()} showHour={false} showMinute={false} />
        </div>
        <TimePicker
          format={str}
          showSecond={showSecond}
          // use to control utfOffset, locale, default open value
          defaultOpenValue={moment()}
          class="xxx"
          onChange={onChange1}
          disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23]}
          disabledMinutes={() => [0, 2, 4, 6, 8]}
          hideDisabledOptions
        />
        <div>
          <button onClick={this.toggleOpen}>Toggle open</button>
          <TimePicker open={this.open} onOpen={this.setOpen} onClose={this.setOpen} focusOnOpen />
        </div>
        <TimePicker
          style={{ width: '100px' }}
          showSecond={showSecond}
          defaultValue={moment()}
          class="xxx"
          onChange={onChange}
        />
        <TimePicker defaultValue={moment()} showSecond={false} minuteStep={15} />
        <div>
          <TimePicker defaultValue={this.value} onChange={this.handleValueChange} />
          <TimePicker value={this.value} onChange={this.handleValueChange} />
          <button onClick={this.clear}>clear</button>
        </div>
      </div>
    );
  },
};
</script>
