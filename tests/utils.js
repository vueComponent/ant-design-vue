import moment from 'moment';
import MockDate from 'mockdate';
import Vue from 'vue';

export function setMockDate(dateString = '2017-09-18T03:30:07.795') {
  MockDate.set(moment(dateString));
}

export function resetMockDate() {
  MockDate.reset();
}

export function asyncExpect(fn, timeout) {
  return new Promise(resolve => {
    if (typeof timeout === 'number') {
      setTimeout(() => {
        fn();
        resolve();
      }, timeout);
    } else {
      Vue.nextTick(() => {
        fn();
        resolve();
      });
    }
  });
}
export const sleep = (timeout = 0) => new Promise(resolve => setTimeout(resolve, timeout));
