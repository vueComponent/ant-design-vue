<cn>
#### 弹出层中的新建表单
当用户访问一个展示了某个列表的页面，想新建一项但又不想跳转页面时，可以用 Modal 弹出一个表单，用户填写必要信息后创建新的项。
</cn>

<us>
#### Form in Modal to Create
When user visit a page with a list of items, and want to create a new item. The page can popup a form in Modal, then let user fill in the form to create an item.
</us>

```html
<script>
import { Form } from 'vue-antd-ui'

const CollectionCreateForm = Form.create()(
  {
    props: ['visible'],
    render () {
      const { visible, form } = this
      const { getFieldDecorator } = form
      return (
        <a-modal
          visible={visible}
          title='Create a new collection'
          okText='Create'
          onCancel={() => { this.$emit('cancel') }}
          onOk={() => { this.$emit('create') }}
        >
          <a-form layout='vertical'>
            <a-form-item label='Title'>
              {getFieldDecorator('title', {
                rules: [{ required: true, message: 'Please input the title of collection!' }],
              })(
                <a-input />
              )}
            </a-form-item>
            <a-form-item label='Description'>
              {getFieldDecorator('description')(<a-input type='textarea' />)}
            </a-form-item>
            <a-form-item className='collection-create-form_last-form-item'>
              {getFieldDecorator('modifier', {
                initialValue: 'public',
              })(
                <a-radio-group>
                  <a-radio value='public'>Public</a-radio>
                  <a-radio value='private'>Private</a-radio>
                </a-radio-group>
              )}
            </a-form-item>
          </a-form>
        </a-modal>
      )
    },
  }
)

export default {
  data () {
    return {
      visible: false,
    }
  },
  methods: {
    showModal () {
      this.visible = true
    },
    handleCancel  () {
      this.visible = false
    },
    handleCreate  () {
      const form = this.formRef.form
      form.validateFields((err, values) => {
        if (err) {
          return
        }

        console.log('Received values of form: ', values)
        form.resetFields()
        this.visible = false
      })
    },
    saveFormRef  (formRef) {
      this.formRef = formRef
    },
  },

  render () {
    return (
      <div>
        <a-button type='primary' onClick={this.showModal}>New Collection</a-button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    )
  },
}
</script>
```



