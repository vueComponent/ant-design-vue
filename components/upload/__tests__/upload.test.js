import { mount } from '@vue/test-utils'
import Upload from '..'
import { fileToObject } from '../utils'
import PropsTypes from '../../_util/vue-types'
import { UploadListProps } from '../interface'

UploadListProps.items = PropsTypes.any

describe('Upload', () => {
  it('should get refs inside Upload in componentDidMount', () => {
    let ref = null
    const APP = {
      mounted () {
        ref = this.$refs.input
      },
      render () {
        return (
          <Upload supportServerRender={false} action=''>
            <input ref='input' />
          </Upload>
        )
      },
    }
    mount(APP)
    expect(ref).toBeDefined()
  })

  it('return promise in beforeUpload', (done) => {
    const data = jest.fn()
    const props = {
      propsData: {
        action: 'http://jsonplaceholder.typicode.com/posts/',
        beforeUpload: () => new Promise(resolve =>
          setTimeout(() => resolve('success'), 100)
        ),
        data,
      },
      listeners: {
        change: ({ file }) => {
          if (file.status !== 'uploading') {
            expect(data).toBeCalled()
            done()
          }
        },
      },
      slots: {
        default: '<button>upload</button>',
      },
      sync: false,
    }
    Upload.props
    const wrapper = mount(Upload, props)
    setTimeout(() => {
      const mockFile = new File(['foo'], 'foo.png', {
        type: 'image/png',
      })
      wrapper.find({ name: 'ajaxUploader' }).vm.onChange({
        target: {
          files: [mockFile],
        },
      })
    }, 0)
  })

  it('should not stop upload when return value of beforeUpload is false', (done) => {
    const data = jest.fn()
    const props = {
      propsData: {
        action: 'http://jsonplaceholder.typicode.com/posts/',
        beforeUpload: () => false,
        data,
      },
      listeners: {
        change: ({ file }) => {
          expect(file instanceof File).toBe(true)
          expect(data).not.toBeCalled()
          done()
        },
      },
      slots: {
        default: '<button>upload</button>',
      },
      sync: false,
    }
    const wrapper = mount(Upload, props)
    setTimeout(() => {
      const mockFile = new File(['foo'], 'foo.png', {
        type: 'image/png',
      })
      wrapper.find({ name: 'ajaxUploader' }).vm.onChange({
        target: {
          files: [mockFile],
        },
      })
    }, 0)
  })

  it('should increase percent automaticly when call autoUpdateProgress in IE', (done) => {
    let uploadInstance
    let lastPercent = -1
    const props = {
      propsData: {
        action: 'http://jsonplaceholder.typicode.com/posts/',
      },
      listeners: {
        change: ({ file }) => {
          if (file.percent === 0 && file.status === 'uploading') {
            // manually call it
            uploadInstance.autoUpdateProgress(0, file)
          }
          if (file.status === 'uploading') {
            expect(file.percent).toBeGreaterThan(lastPercent)
            lastPercent = file.percent
          }
          if (file.status === 'done' || file.status === 'error') {
            done()
          }
        },
      },
      slots: {
        default: '<button>upload</button>',
      },
      sync: false,
    }
    const wrapper = mount(Upload, props)
    setTimeout(() => {
      const mockFile = new File(['foo'], 'foo.png', {
        type: 'image/png',
      })
      wrapper.find({ name: 'ajaxUploader' }).vm.onChange({
        target: {
          files: [mockFile],
        },
      })
      uploadInstance = wrapper.vm
    }, 0)
  })
  it('should not stop upload when return value of beforeUpload is not false', (done) => {
    const data = jest.fn()
    const props = {
      propsData: {
        action: 'http://jsonplaceholder.typicode.com/posts/',
        beforeUpload () {},
        data,
      },
      listeners: {
        change: () => {
          expect(data).toBeCalled()
          done()
        },
      },
      slots: {
        default: '<button>upload</button>',
      },
      sync: false,
    }

    const wrapper = mount(Upload, props)
    setTimeout(() => {
      const mockFile = new File(['foo'], 'foo.png', {
        type: 'image/png',
      })
      wrapper.find({ name: 'ajaxUploader' }).vm.onChange({
        target: {
          files: [mockFile],
        },
      })
    }, 0)
  })

  describe('util', () => {
    it('should be able to copy file instance', () => {
      const file = new File([], 'aaa.zip')
      const copiedFile = fileToObject(file);
      ['uid', 'lastModified', 'lastModifiedDate', 'name', 'size', 'type'].forEach((key) => {
        expect(key in copiedFile).toBe(true)
      })
    })
  })
})
