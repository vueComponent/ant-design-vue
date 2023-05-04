import Modal from '..';
import { sleep } from '../../../tests/utils';
const { confirm } = Modal;
jest.mock('../../_util/Portal');

describe('Modal.confirm triggers callbacks correctly', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  document.createDocumentFragment = () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    return container;
  };
  afterEach(() => {
    errorSpy.mockReset();
    document.body.innerHTML = '';
    Modal.destroyAll();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  function $$(className) {
    return document.body.querySelectorAll(className);
  }

  function open(args) {
    jest.useFakeTimers();
    confirm({
      title: 'Want to delete these items?',
      content: 'some descriptions',
      ...args,
    });
    jest.runAllTimers();
    jest.useRealTimers();
  }

  it('trigger onCancel once when click on cancel button', async () => {
    const onCancel = jest.fn();
    const onOk = jest.fn();
    open({
      onCancel,
      onOk,
    });
    await sleep();
    // first Modal
    $$('.ant-btn')[0].click();
    expect(onCancel.mock.calls.length).toBe(1);
    expect(onOk.mock.calls.length).toBe(0);
  });

  it('trigger onOk once when click on ok button', async () => {
    const onCancel = jest.fn();
    const onOk = jest.fn();
    open({
      onCancel,
      onOk,
    });
    await sleep();
    // second Modal
    $$('.ant-btn-primary')[0].click();
    expect(onCancel.mock.calls.length).toBe(0);
    expect(onOk.mock.calls.length).toBe(1);
  });

  it('should allow Modal.comfirm without onCancel been set', async () => {
    open();
    await sleep();
    // Third Modal
    $$('.ant-btn')[0].click();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('should allow Modal.comfirm without onOk been set', async () => {
    open();
    await sleep();
    // Fourth Modal
    $$('.ant-btn-primary')[0].click();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('ok only', async () => {
    open({ okCancel: false });
    await sleep();
    expect($$('.ant-btn')).toHaveLength(1);
    expect($$('.ant-btn')[0].innerHTML).toContain('OK');
  });

  it('allows extra props on buttons', async () => {
    open({
      okButtonProps: { disabled: true },
      cancelButtonProps: { 'data-test': 'baz' },
    });
    await sleep();
    expect($$('.ant-btn')).toHaveLength(2);
    expect($$('.ant-btn')[0].attributes['data-test'].value).toBe('baz');
    expect($$('.ant-btn')[1].disabled).toBe(true);
  });

  it('trigger onCancel once when click on cancel button', async () => {
    const onCancel = jest.fn();
    const onOk = jest.fn();
    await open({
      title: 'title',
      content: 'content',
      onCancel,
      onOk,
    });
    await sleep();
    $$('.ant-btn')[0].click();
    expect(onCancel.mock.calls.length).toBe(1);
    expect(onOk.mock.calls.length).toBe(0);
  });
});
