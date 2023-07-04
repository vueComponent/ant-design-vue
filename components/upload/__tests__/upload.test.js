import { mount } from '@vue/test-utils';
import Upload from '..';
import { getFileItem, removeFileItem } from '../utils';
import PropsTypes from '../../_util/vue-types';
import { uploadListProps } from '../interface';
import { setup, teardown } from './mock';

uploadListProps.items = PropsTypes.any;

describe('Upload', () => {
  beforeEach(() => setup());
  afterEach(() => teardown());
  it('should get refs inside Upload in componentDidMount', () => {
    let ref = null;
    const APP = {
      mounted() {
        ref = this.$refs.input;
      },
      render() {
        return (
          <Upload supportServerRender={false} action="">
            <input ref="input" />
          </Upload>
        );
      },
    };
    mount(APP);
    expect(ref).toBeDefined();
  });

  xit('return promise in beforeUpload', done => {
    const data = jest.fn();
    const props = {
      props: {
        action: 'http://upload.com',
        beforeUpload: () => new Promise(resolve => setTimeout(() => resolve('success'), 100)),
        data,
      },
      listeners: {
        change: ({ file }) => {
          if (file.status !== 'uploading') {
            expect(data).toBeCalled();
            done();
          }
        },
      },
      slots: {
        default: () => <button>upload</button>,
      },
      sync: false,
    };
    const wrapper = mount(Upload, props);
    setTimeout(() => {
      wrapper.findComponent('ajaxUploader').vm.onChange({
        target: {
          files: [{ file: 'foo.png' }],
        },
      });
    }, 0);
  });

  xit('upload promise return file in beforeUpload', done => {
    const data = jest.fn();
    const props = {
      action: 'http://upload.com',
      beforeUpload: file =>
        new Promise(resolve =>
          setTimeout(() => {
            const result = file;
            result.name = 'test.png';
            resolve(result);
          }, 100),
        ),
      data,
      onChange: ({ file }) => {
        if (file.status !== 'uploading') {
          expect(data).toBeCalled();
          expect(file.name).toEqual('test.png');
          done();
        }
      },
      slots: {
        default: () => <button>upload</button>,
      },
      sync: false,
    };

    const wrapper = mount(Upload, props);

    setTimeout(() => {
      wrapper.find({ name: 'ajaxUploader' }).vm.onChange({
        target: {
          files: [{ file: 'foo.png' }],
        },
      });
    }, 0);
  });

  xit('should not stop upload when return value of beforeUpload is false', done => {
    const data = jest.fn();
    const props = {
      action: 'http://upload.com',
      beforeUpload: () => false,
      data,
      onChange: ({ file }) => {
        expect(file instanceof File).toBe(true);
        expect(data).not.toBeCalled();
        done();
      },
      slots: {
        default: () => <button>upload</button>,
      },
      sync: false,
    };
    const wrapper = mount(Upload, props);
    setTimeout(() => {
      const mockFile = new File(['foo'], 'foo.png', {
        type: 'image/png',
      });
      wrapper.find({ name: 'ajaxUploader' }).vm.onChange({
        target: {
          files: [mockFile],
        },
      });
    }, 0);
  });

  xit('should increase percent automaticly when call autoUpdateProgress in IE', done => {
    let uploadInstance;
    let lastPercent = -1;
    const props = {
      props: {
        action: 'http://upload.com',
      },
      listeners: {
        change: ({ file }) => {
          if (file.percent === 0 && file.status === 'uploading') {
            // manually call it
            uploadInstance.autoUpdateProgress(0, file);
          }
          if (file.status === 'uploading') {
            expect(file.percent).toBeGreaterThan(lastPercent);
            lastPercent = file.percent;
          }
          if (file.status === 'done' || file.status === 'error') {
            done();
          }
        },
      },
      slots: {
        default: '<button>upload</button>',
      },
      sync: false,
    };
    const wrapper = mount(Upload, props);
    setTimeout(() => {
      const mockFile = new File(['foo'], 'foo.png', {
        type: 'image/png',
      });
      wrapper.find({ name: 'ajaxUploader' }).vm.onChange({
        target: {
          files: [mockFile],
        },
      });
      uploadInstance = wrapper.vm;
    }, 0);
  });
  xit('should not stop upload when return value of beforeUpload is not false', done => {
    const data = jest.fn();
    const props = {
      props: {
        action: 'http://upload.com',
        beforeUpload() {},
        data,
      },
      listeners: {
        change: () => {
          expect(data).toBeCalled();
          done();
        },
      },
      slots: {
        default: '<button>upload</button>',
      },
      sync: false,
    };

    const wrapper = mount(Upload, props);
    setTimeout(() => {
      const mockFile = new File(['foo'], 'foo.png', {
        type: 'image/png',
      });
      wrapper.find({ name: 'ajaxUploader' }).vm.onChange({
        target: {
          files: [mockFile],
        },
      });
    }, 0);
  });

  describe('util', () => {
    it('should be able to get fileItem', () => {
      const file = { uid: '-1', name: 'item.jpg' };
      const fileList = [
        {
          uid: '-1',
          name: 'item.jpg',
        },
      ];
      const targetItem = getFileItem(file, fileList);
      expect(targetItem).toBe(fileList[0]);
    });

    it('should be able to remove fileItem', () => {
      const file = { uid: '-1', name: 'item.jpg' };
      const fileList = [
        {
          uid: '-1',
          name: 'item.jpg',
        },
        {
          uid: '-2',
          name: 'item2.jpg',
        },
      ];
      const targetItem = removeFileItem(file, fileList);
      expect(targetItem).toEqual(fileList.slice(1));
    });

    it('should not be able to remove fileItem', () => {
      const file = { uid: '-3', name: 'item.jpg' };
      const fileList = [
        {
          uid: '-1',
          name: 'item.jpg',
        },
        {
          uid: '-2',
          name: 'item2.jpg',
        },
      ];
      const targetItem = removeFileItem(file, fileList);
      expect(targetItem).toBe(null);
    });
  });

  it('should support linkProps as object', () => {
    const fileList = [
      {
        uid: '-1',
        name: 'foo.png',
        status: 'done',
        url: 'http://www.baidu.com/xxx.png',
        linkProps: {
          download: 'image',
          rel: 'noopener',
        },
      },
    ];
    const props = {
      props: {
        fileList,
      },
      sync: false,
    };
    const wrapper = mount(Upload, props);
    setTimeout(() => {
      const linkNode = wrapper.find('a.ant-upload-list-item-name');
      expect(linkNode.props().download).toBe('image');
      expect(linkNode.props().rel).toBe('noopener');
    }, 0);
  });

  it('should support linkProps as json stringify', () => {
    const linkPropsString = JSON.stringify({
      download: 'image',
      rel: 'noopener',
    });
    const fileList = [
      {
        uid: '-1',
        name: 'foo.png',
        status: 'done',
        url: 'http://www.baidu.com/xxx.png',
        linkProps: linkPropsString,
      },
    ];
    const props = {
      props: {
        fileList,
      },
      sync: false,
    };
    const wrapper = mount(Upload, props);
    setTimeout(() => {
      const linkNode = wrapper.find('a.ant-upload-list-item-name');
      expect(linkNode.props().download).toBe('image');
      expect(linkNode.props().rel).toBe('noopener');
    }, 0);
  });
});
