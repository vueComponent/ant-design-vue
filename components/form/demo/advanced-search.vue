<cn>
#### 高级搜索
三列栅格式的表单排列方式，常用于数据表格的高级搜索。
有部分定制的样式代码，由于输入标签长度不确定，需要根据具体情况自行调整。
</cn>

<us>
#### Advanced search
Three columns layout is often used for advanced searching of data table.
Because the width of label is not fixed, you may need to adjust it by customizing its style.
</us>


<script>
import { Form } from 'vue-antd-ui'

const AdvancedSearchForm = {
  data () {
    return {
      expand: false,
    }
  },
  methods: {
    handleSearch  (e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        console.log('error', error)
        console.log('Received values of form: ', values)
      })
    },

    handleReset () {
      this.form.resetFields()
    },

    toggle  () {
      this.expand = !this.expand
    },

    // To generate mock Form.Item
    getFields () {
      const count = this.expand ? 10 : 6
      const { getFieldDecorator } = this.form
      const children = []
      for (let i = 0; i < 10; i++) {
        children.push(
          <a-col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
            <a-form-item label={`Field ${i}`}>
              {getFieldDecorator(`field-${i}`, {
                rules: [{
                  required: true,
                  message: 'Input something!',
                }],
              })(
                <a-input placeholder='placeholder' />
              )}
            </a-form-item>
          </a-col>
        )
      }
      return children
    },
  },

  render () {
    return (
      <a-form
        class='ant-advanced-search-form'
        onSubmit={this.handleSearch}
      >
        <a-row gutter={24}>{this.getFields()}</a-row>
        <a-row>
          <a-col span={24} style={{ textAlign: 'right' }}>
            <a-button type='primary' htmlType='submit'>Search</a-button>
            <a-button style={{ marginLeft: '8px' }} onClick={this.handleReset}>
              Clear
            </a-button>
            <a style={{ marginLeft: '8px', fontSize: '12px' }} onClick={this.toggle}>
              Collapse <a-icon type={this.expand ? 'up' : 'down'} />
            </a>
          </a-col>
        </a-row>
      </a-form>
    )
  },
}

const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm)

export default {
  methods: {
    saveFormRef (inst) {
      this.formRef = inst
    },
  },
  render () {
    return (
      <div id='components-form-demo-advanced-search'>
        <WrappedAdvancedSearchForm wrappedComponentRef={(inst) => this.saveFormRef(inst)}/>
        <div class='search-result-list'>Search Result List</div>
      </div>
    )
  },
}

</script>
<style>
.ant-advanced-search-form {
  padding: 24px;
  background: #fbfbfb;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}

#components-form-demo-advanced-search .ant-form {
  max-width: none;
}
#components-form-demo-advanced-search .search-result-list {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
}
</style>




