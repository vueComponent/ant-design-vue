<cn>
#### 国际化
此处列出 Ant Design Vue 中需要国际化支持的组件，你可以在演示里切换语言。
</cn>

<us>
#### Locale
Components which need localization support are listed here, you can toggle the language in the demo.
</us>

```vue
<template>
  <div>
    <div class="change-locale">
      <span style="margin-right: 16px">Change locale of components: </span>
      <a-radio-group :value="locale" @change="changeLocale">
        <a-radio-button key="en" :value="enUS">
          English
        </a-radio-button>
        <a-radio-button key="cn" :value="zhCN">
          中文
        </a-radio-button>
      </a-radio-group>
    </div>
    <a-config-provider :locale="locale">
      <div :key="locale ? locale.locale : 'en'" class="locale-components">
        <div class="example">
          <a-pagination :default-current="1" :total="50" show-size-changer />
        </div>
        <div class="example">
          <a-select show-search style="width: 200px">
            <a-select-option value="jack">
              jack
            </a-select-option>
            <a-select-option value="lucy">
              lucy
            </a-select-option>
          </a-select>
          <a-date-picker />
          <a-time-picker />
          <a-range-picker style="width: 200px" />
        </div>
        <div class="example">
          <a-button type="primary" @click="visible = true">
            Show Modal
          </a-button>
          <a-button @click="info">
            Show info
          </a-button>
          <a-button @click="confirm">
            Show confirm
          </a-button>
          <a-popconfirm title="Question?">
            <a href="#">Click to confirm</a>
          </a-popconfirm>
        </div>
        <div class="example">
          <a-transfer
            :data-source="[]"
            show-search
            :target-keys="[]"
            :render="item => item.title"
          />
        </div>
        <div style="width: 319px; border: 1px solid #d9d9d9; border-radius: 4px">
          <a-calendar :fullscreen="false" :value="moment()" />
        </div>
        <div class="example">
          <a-table :data-source="[]" :columns="columns" />
        </div>
        <a-modal v-model="visible" title="Locale Modal">
          <p>Locale Modal</p>
        </a-modal>
      </div>
    </a-config-provider>
  </div>
</template>
<script>
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
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
      columns,
      visible: false,
      locale: enUS,
      moment,
      enUS,
      zhCN,
    };
  },
  methods: {
    changeLocale(e) {
      const localeValue = e.target.value;
      this.locale = localeValue;
      if (!localeValue) {
        moment.locale('en');
      } else {
        moment.locale('zh-cn');
      }
    },
    info() {
      this.$info({
        title: 'some info',
        content: 'some info',
      });
    },
    confirm() {
      this.$confirm({
        title: 'some info',
        content: 'some info',
      });
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
