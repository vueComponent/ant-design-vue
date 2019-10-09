<cn>
#### 所有组件
此处列出 Ant Design 中需要国际化支持的组件，你可以在演示里切换语言。
</cn>

<us>
#### All components
Components which need localization support are listed here, you can toggle the language in the demo.
</us>

```tpl
<template>
  <div>
    <div class="change-locale">
      <span :style="{ marginRight: '16px' }">Change locale of components: </span>
      <a-radio-group :defaultValue="null" @change="changeLocale">
        <a-radio-button key="en" :value="null">English</a-radio-button>
        <a-radio-button key="cn" :value="zhCN">中文</a-radio-button>
      </a-radio-group>
    </div>
    <a-locale-provider :locale="locale">
      <div class="locale-components" :key="(!!locale).toString()">
        <!-- HACK: just refresh in production environment-->
        <div class="example">
          <a-pagination :defaultCurrent="1" :total="50" showSizeChanger />
        </div>
        <div class="example">
          <a-select showSearch style="width: 200px">
            <a-select-option value="jack">jack</a-select-option>
            <a-select-option value="lucy">lucy</a-select-option>
          </a-select>
          <a-date-picker />
          <a-time-picker />
          <a-range-picker style=" width: 200px " />
        </div>
        <div class="example">
          <a-button type="primary" @click="showModal">Show Modal</a-button>
          <a-button @click="info">Show info</a-button>
          <a-button @click="confirm">Show confirm</a-button>
          <a-popconfirm title="Question?">
            <a href="#">Click to confirm</a>
          </a-popconfirm>
        </div>
        <div className="example">
          <a-transfer :dataSource="[]" showSearch :targetKeys="[]" :render="item => item.title" />
        </div>
        <div :style="{ width: '319px', border: '1px solid #d9d9d9', borderRadius: '4px' }">
          <a-calendar :fullscreen="false" :value="moment()" />
        </div>
        <a-modal title="Locale Modal" v-model="visible">
          <p>Locale Modal</p>
        </a-modal>
      </div>
    </a-locale-provider>
  </div>
</template>
<script>
  // you should use import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import zhCN from 'ant-design-vue/locale-provider/zh_CN';
  import { Modal } from 'ant-design-vue';
  import moment from 'moment';
  import 'moment/locale/zh-cn';
  moment.locale('en');
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      filters: [
        {
          text: 'filter1',
          value: 'filter1',
        },
      ],
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
  ];
  export default {
    data() {
      return {
        visible: false,
        locale: null,
        zhCN,
      };
    },
    methods: {
      moment,
      showModal() {
        this.visible = true;
      },
      hideModal() {
        this.visible = false;
      },
      info() {
        Modal.info({
          title: 'some info',
          content: 'some info',
        });
      },
      confirm() {
        Modal.confirm({
          title: 'some info',
          content: 'some info',
        });
      },
      changeLocale(e) {
        const localeValue = e.target.value;
        this.locale = localeValue;
        if (!localeValue) {
          moment.locale('en');
        } else {
          moment.locale('zh-cn');
        }
      },
    },
  };
</script>

<style scoped>
  .locale-components {
    border-top: 1px solid #d9d9d9;
    padding-top: 16px;
  }

  .example {
    margin: 16px 0;
  }

  .example > * {
    margin-right: 8px;
  }

  .change-locale {
    margin-bottom: 16px;
  }
</style>
```
