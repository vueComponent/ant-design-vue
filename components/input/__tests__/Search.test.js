import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Input from '../index';
import Button from '../../button';
import focusTest from '../../../tests/shared/focusTest';

const { Search } = Input;
describe('Input.Search', () => {
  focusTest(Search);

  it('should support custom button', async () => {
    const wrapper = mount(
      {
        render() {
          return <Search enterButton={<button type="button">ok</button>} />;
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('should support custom Button', async () => {
    const wrapper = mount(
      {
        render() {
          return <Search enterButton={<Button>ok</Button>} />;
        },
      },
      { sync: false },
    );
    await asyncExpect(() => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
  it('should support VueNode suffix without error', () => {
    const fn = () => {
      mount({
        render() {
          return <Search suffix={<div>ok</div>} />;
        },
      });
    };
    expect(fn).not.toThrow();
  });
  it('should disable enter button when disabled prop is true', () => {
    const wrapper = mount({
      render() {
        return <Search placeholder="input search text" enterButton disabled />;
      },
    });
    expect(wrapper.findAll('.ant-btn-primary[disabled]')).toHaveLength(1);
  });

  // it('should trigger onSearch when click search icon', () => {
  //   const onSearch = jest.fn();
  //   const wrapper = mount(
  //     <Search defaultValue="search text" onSearch={onSearch} />
  //   );
  //   wrapper.find('.anticon-search').simulate('click');
  //   expect(onSearch).toHaveBeenCalledTimes(1);
  //   expect(onSearch).toBeCalledWith('search text', expect.objectContaining({
  //     type: 'click',
  //     preventDefault: expect.any(Function),
  //   }));
  // });

  // it('should trigger onSearch when click search button', () => {
  //   const onSearch = jest.fn();
  //   const wrapper = mount(
  //     <Search defaultValue="search text" enterButton onSearch={onSearch} />
  //   );
  //   wrapper.find('Button').simulate('click');
  //   expect(onSearch).toHaveBeenCalledTimes(1);
  //   expect(onSearch).toBeCalledWith('search text', expect.objectContaining({
  //     type: 'click',
  //     preventDefault: expect.any(Function),
  //   }));
  // });

  // it('should trigger onSearch when click search button with text', () => {
  //   const onSearch = jest.fn();
  //   const wrapper = mount(
  //     <Search defaultValue="search text" enterButton="button text" onSearch={onSearch} />
  //   );
  //   wrapper.find('Button').simulate('click');
  //   expect(onSearch).toHaveBeenCalledTimes(1);
  //   expect(onSearch).toBeCalledWith('search text', expect.objectContaining({
  //     type: 'click',
  //     preventDefault: expect.any(Function),
  //   }));
  // });

  // it('should trigger onSearch when click search button with customize button', () => {
  //   const onSearch = jest.fn();
  //   const wrapper = mount(
  //     <Search defaultValue="search text" enterButton={<Button>antd button</Button>} onSearch={onSearch} />
  //   );
  //   wrapper.find('Button').simulate('click');
  //   expect(onSearch).toHaveBeenCalledTimes(1);
  //   expect(onSearch).toBeCalledWith('search text', expect.objectContaining({
  //     type: 'click',
  //     preventDefault: expect.any(Function),
  //   }));
  // });

  // it('should trigger onSearch when click search button of native', () => {
  //   const onSearch = jest.fn();
  //   const wrapper = mount(
  //     <Search defaultValue="search text" enterButton={<button type="button">antd button</button>} onSearch={onSearch} />
  //   );
  //   wrapper.find('button').simulate('click');
  //   expect(onSearch).toHaveBeenCalledTimes(1);
  //   expect(onSearch).toBeCalledWith('search text', expect.objectContaining({
  //     type: 'click',
  //     preventDefault: expect.any(Function),
  //   }));
  // });

  // it('should trigger onSearch when press enter', () => {
  //   const onSearch = jest.fn();
  //   const wrapper = mount(
  //     <Search defaultValue="search text" onSearch={onSearch} />
  //   );
  //   wrapper.find('input').simulate('keydown', { key: 'Enter', keyCode: 13 });
  //   expect(onSearch).toHaveBeenCalledTimes(1);
  //   expect(onSearch).toBeCalledWith('search text', expect.objectContaining({
  //     type: 'keydown',
  //     preventDefault: expect.any(Function),
  //   }));
  // });
});
