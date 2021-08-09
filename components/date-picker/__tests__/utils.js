export function $$(className) {
  return document.body.querySelectorAll(className);
}
export function hasSelected(wrapper, date) {
  return document.body
    .querySelector(`[title="${date.format('LL')}"][role="gridcell"]`)
    .getAttribute('class')
    .split(' ')
    .includes('ant-calendar-selected-day');
}

export function openPanel(wrapper) {
  wrapper.find('.ant-calendar-picker-input').trigger('click');
}

export function clearInput(wrapper) {
  wrapper.find('.ant-calendar-picker-clear').trigger('click');
}

export function nextYear() {
  $$('.ant-calendar-next-year-btn')[0].click();
}

export function nextMonth() {
  $$('.ant-calendar-next-month-btn')[0].click();
}

export function selectDateFromBody(date, index) {
  let calendar = document.body;
  if (index !== undefined) {
    calendar = document.body.querySelectorAll('.ant-calendar-range-part')[index];
  }
  calendar.querySelector(`[title="${date.format('LL')}"][role="gridcell"]`).click();
}
