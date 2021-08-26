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

export function openPicker(wrapper, index = 0) {
  wrapper.findAll('input')[index].trigger('mousedown');
  wrapper.findAll('input')[index].trigger('focus');
}
export function closePicker(wrapper, index = 0) {
  wrapper.findAll('input')[index].trigger('blur');
}

export function selectCell(wrapper, text, index = 0) {
  let matchCell;
  $$('table')
    [index].querySelectorAll('td')
    .forEach(td => {
      if (td.textContent === String(text) && td.className.includes('-in-view')) {
        matchCell = td;
        td.click('click');
      }
    });

  if (!matchCell) {
    throw new Error('Cell not match in picker panel.');
  }

  return matchCell;
}
