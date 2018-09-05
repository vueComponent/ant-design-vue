<cn>
#### 对象编辑
用于承载编辑相关操作，需要点击关闭按钮关闭。
</cn>

<us>
#### Edit item in drawer
A drawer containing an editable form which needs to be collapsed by clicking the close button.
</us>

```html
<template>
  <div>
    <a-button type="primary" @click="showDrawer">
      Open
    </a-button>
    <a-drawer
      title="Create"
      width=720
      placement="right"
      :closable="false"
      @close="onClose"
      :visible="visible"
      style="height: calc(100% - 55px);overflow: 'auto';paddingBottom: 53px"
    >
      <a-form layout="vertical" hideRequiredMark>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Name" :fieldDecoratorOptions="{ rules: [{ required: true, message: 'please enter user name' }]}">
              <a-input placeholder="please enter user name" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Url" :fieldDecoratorOptions="{ rules: [{ required: true, message: 'please enter url' }]}">
              <a-input
                  style="width: 100%"
                  addonBefore="http://"
                  addonAfter=".com"
                  placeholder="please enter url"
                />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Owner" :fieldDecoratorOptions="{ rules: [{ required: true, message: 'Please select an owner' }]}">
              <a-select placeholder="Please a-s an owner">
                <a-select-option value="xiao">Xiaoxiao Fu</a-select-option>
                <a-select-option value="mao">Maomao Zhou</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Type" :fieldDecoratorOptions="{ rules: [{ required: true, message: 'Please choose the type' }]}">
              <a-select placeholder="Please choose the type">
                <a-select-option value="private">Private</a-select-option>
                <a-select-option value="public">Public</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Approver" :fieldDecoratorOptions="{ rules: [{ required: true, message: 'Please choose the approver' }]}">
              <a-select placeholder="Please choose the approver">
                  <a-select-option value="jack">Jack Ma</a-select-option>
                  <a-select-option value="tom">Tom Liu</a-select-option>
                </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="DateTime" :fieldDecoratorOptions="{ rules: [{ required: true, message: 'Please choose the dateTime' }]}">
              <a-date-picker
                style="width: 100%"
                :getPopupContainer="trigger => trigger.parentNode"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Description" :fieldDecoratorOptions="{ rules: [{ required: true, message: 'please enter url description' }]}">
              <a-textarea :rows="4" placeholder="please enter url description" />
            </a-form-item>
          </a-col>
        </a-row>
      </Form>
      <div
        :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }"
      >
        <a-button
          :style="{
            marginRight: 8,
          }"
          @click="onClose"
        >
          Cancel
        </a-button>
        <a-button @click="onClose" type="primary">Submit</a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
  },
}
</script>
```
