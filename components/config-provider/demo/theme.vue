<docs>
---
order: 5
version: 3.0
title:
  zh-CN: 全局样式
  en-US: Global Theme
---

## zh-CN

通过 css variable 修改全局主题色（你可以切换到组件页面查看更详细的样式展示）。自动生成的变量可能会根据设计调整，请勿直接依赖。详细配置请[点击查看](/docs/vue/customize-theme-variable)。

## en-US

Modify global theme color by css variable. Css variable depends on the design, it may adjust so please do not directly use it. You can go to other components page for more detail style. [Check this](/docs/vue/customize-theme-variable) to view detail.

</docs>

<template>
  <a-row :gutter="16" :wrap="false">
    <a-col flex="none">
      <a-space direction="vertical" align="center">
        <!-- Primary Color -->
        <input
          type="color"
          :value="colorState.primaryColor"
          @input="e => onColorChange('primaryColor', e)"
        />

        <span style="color: var(--ant-primary-color)">var(`--ant-primary-color`)</span>

        <!-- Error Color -->
        <input
          type="color"
          :value="colorState.errorColor"
          @input="e => onColorChange('errorColor', e)"
        />

        <span style="color: var(--ant-error-color)">var(`--ant-error-color`)</span>

        <!-- Warning Color -->
        <input
          type="color"
          :value="colorState.warningColor"
          @input="e => onColorChange('warningColor', e)"
        />

        <span style="color: var(--ant-warning-color)">var(`--ant-warning-color`)</span>

        <!-- Success Color -->
        <input
          type="color"
          :value="colorState.successColor"
          @input="e => onColorChange('successColor', e)"
        />

        <span style="color: var(--ant-success-color)">var(`--ant-success-color`)</span>

        <!-- Info Color -->
        <input
          type="color"
          :value="colorState.infoColor"
          @input="e => onColorChange('infoColor', e)"
        />
        <span style="color: var(--ant-info-color)">var(`--ant-info-color`)</span>
      </a-space>
    </a-col>

    <a-col flex="auto">
      <a-space direction="vertical" style="width: 100%" :size="0">
        <template #split><a-divider /></template>
        <!-- Primary Button -->
        <SplitSpace>
          <a-button type="primary">Primary</a-button>
          <a-button>Default</a-button>
          <a-button type="dashed">Dashed</a-button>
          <a-button type="text">Text</a-button>
          <a-button type="link">Link</a-button>
        </SplitSpace>

        <!-- Danger Button -->
        <SplitSpace>
          <a-button danger type="primary">Primary</a-button>
          <a-button danger>Default</a-button>
          <a-button danger type="dashed">Dashed</a-button>
          <a-button danger type="text">Text</a-button>
          <a-button danger type="link">Link</a-button>
        </SplitSpace>

        <!-- Ghost Button -->
        <SplitSpace style="background: rgb(190, 200, 200)">
          <a-button type="primary" ghost>Primary</a-button>
          <a-button ghost>Default</a-button>
          <a-button type="dashed" ghost>Dashed</a-button>
          <a-button type="primary" ghost danger>Primary</a-button>
          <a-button ghost danger>Default</a-button>
          <a-button type="dashed" ghost danger>Dashed</a-button>
        </SplitSpace>

        <!-- Typography -->
        <SplitSpace>
          <a-typography-text type="success">Text (success)</a-typography-text>
          <a-typography-text type="warning">Text(warning)</a-typography-text>
          <a-typography-text type="danger">Text(danger)</a-typography-text>
          <a-typography-link href="https://ant.design" target="_blank">Link</a-typography-link>
          <a-typography-text copyable>Text</a-typography-text>

          <!-- Dropdown -->
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item>1st menu item</a-menu-item>
                <a-menu-item danger>a danger item</a-menu-item>
              </a-menu>
            </template>
            <a class="ant-dropdown-link" @click.prevent>
              Hover me
              <DownOutlined />
            </a>
          </a-dropdown>

          <!-- Spin -->
          <a-spin />
        </SplitSpace>

        <!-- Menu - horizontal -->
        <a-row :gutter="16">
          <a-col :span="12">
            <a-menu v-model:selectedKeys="selectedKeys" mode="horizontal">
              <a-menu-item key="mail">
                Mail
                <template #icon>
                  <MailOutlined />
                </template>
              </a-menu-item>
              <a-sub-menu key="SubMenu" title="Submenu">
                <template #icon><SettingOutlined /></template>
                <a-menu-item-group title="Item 1">
                  <a-menu-item key="setting:1">Option 1</a-menu-item>
                  <a-menu-item key="setting:2">Option 2</a-menu-item>
                </a-menu-item-group>
              </a-sub-menu>
            </a-menu>
          </a-col>
          <a-col :span="12">
            <a-menu v-model:selectedKeys="selectedKeys" mode="horizontal" theme="dark">
              <a-menu-item key="mail">
                <template #icon><SettingOutlined /></template>
                Mail
              </a-menu-item>
              <a-sub-menu key="SubMenu" title="Submenu">
                <template #icon><SettingOutlined /></template>
                <a-menu-item-group title="Item 1">
                  <a-menu-item key="setting:1">Option 1</a-menu-item>
                  <a-menu-item key="setting:2">Option 2</a-menu-item>
                </a-menu-item-group>
              </a-sub-menu>
            </a-menu>
          </a-col>
        </a-row>

        <!-- Menu - vertical -->
        <a-row :gutter="16">
          <a-col :span="12">
            <a-menu v-model:selectedKeys="selectedKeys" mode="inline">
              <a-menu-item key="mail">
                <template #icon><MailOutlined /></template>
                Mail
              </a-menu-item>
              <a-sub-menu key="SubMenu" title="Submenu">
                <template #icon><SettingOutlined /></template>
                <a-menu-item-group title="Item 1">
                  <a-menu-item key="setting:1">Option 1</a-menu-item>
                  <a-menu-item key="setting:2">Option 2</a-menu-item>
                </a-menu-item-group>
              </a-sub-menu>
            </a-menu>
          </a-col>
          <a-col :span="12">
            <a-menu v-model:selectedKeys="selectedKeys" mode="vertical" theme="dark">
              <a-menu-item key="mail">
                <template #icon><MailOutlined /></template>
                Mail
              </a-menu-item>
              <a-sub-menu key="SubMenu" title="Submenu">
                <template #icon><SettingOutlined /></template>
                <a-menu-item-group title="Item 1">
                  <a-menu-item key="setting:1">Option 1</a-menu-item>
                  <a-menu-item key="setting:2">Option 2</a-menu-item>
                </a-menu-item-group>
              </a-sub-menu>
            </a-menu>
          </a-col>
        </a-row>

        <!-- Pagination -->
        <a-pagination show-quick-jumper :default-current="2" :total="500" />

        <!-- Steps -->
        <a-steps :current="1" :percent="60">
          <a-step title="Finished" description="This is a description." />
          <a-step
            title="In Progress"
            sub-title="Left 00:00:08"
            description="This is a description."
          />
          <a-step title="Waiting" description="This is a description." />
        </a-steps>

        <!-- Steps - dot -->
        <a-steps :current="2" status="error" progress-dot>
          <a-step title="Finished" description="You can hover on the dot." />
          <a-step title="In Progress" description="You can hover on the dot." />
          <a-step title="Error" description="You can hover on the dot." />
          <a-step title="Waiting" description="You can hover on the dot." />
        </a-steps>

        <!-- Form - Input -->
        <a-form>
          <SplitSpace>
            <a-form-item>
              <a-input v-bind="inputProps" />
            </a-form-item>
            <a-form-item has-feedback validate-status="success">
              <a-input v-bind="inputProps" />
            </a-form-item>
            <a-form-item has-feedback validate-status="warning">
              <a-input v-bind="inputProps" />
            </a-form-item>
            <a-form-item has-feedback validate-status="error">
              <a-input v-bind="inputProps" />
            </a-form-item>
            <a-form-item has-feedback validate-status="validating">
              <a-input v-bind="inputProps" />
            </a-form-item>
          </SplitSpace>
        </a-form>

        <!-- Form - Select -->
        <a-form>
          <SplitSpace>
            <a-form-item>
              <a-select v-bind="selectProps" />
            </a-form-item>
            <a-form-item has-feedback validate-status="success">
              <a-select v-bind="selectProps" />
            </a-form-item>
            <a-form-item has-feedback validate-status="warning">
              <a-select v-bind="selectProps" />
            </a-form-item>
            <a-form-item has-feedback validate-status="error">
              <a-select v-bind="selectProps" />
            </a-form-item>
            <a-form-item has-feedback validate-status="validating">
              <a-select v-bind="selectProps" />
            </a-form-item>
          </SplitSpace>
        </a-form>

        <!-- Form - TreeSelect -->
        <a-form>
          <SplitSpace>
            <a-form-item>
              <a-tree-select v-bind="treeSelectProps" />
            </a-form-item>
            <a-form-item has-feedback validate-status="success">
              <a-tree-select v-bind="treeSelectProps" />
            </a-form-item>
            <a-form-item has-feedback validate-status="warning">
              <a-tree-select v-bind="treeSelectProps" />
            </a-form-item>
            <a-form-item has-feedback validate-status="error">
              <a-tree-select v-bind="treeSelectProps" />
            </a-form-item>
            <a-form-item has-feedback validate-status="validating">
              <a-tree-select v-bind="treeSelectProps" />
            </a-form-item>
          </SplitSpace>
        </a-form>

        <!-- Form - InputNumber -->
        <a-form>
          <SplitSpace>
            <a-form-item>
              <a-input-number />
            </a-form-item>
            <a-form-item has-feedback validate-status="success">
              <a-input-number />
            </a-form-item>
            <a-form-item has-feedback validate-status="warning">
              <a-input-number />
            </a-form-item>
            <a-form-item has-feedback validate-status="error">
              <a-input-number />
            </a-form-item>
            <a-form-item has-feedback validate-status="validating">
              <a-input-number />
            </a-form-item>
          </SplitSpace>
        </a-form>

        <!-- Form - DatePicker -->
        <a-form>
          <SplitSpace>
            <a-form-item>
              <a-date-picker />
            </a-form-item>
            <a-form-item has-feedback validate-status="success">
              <a-date-picker />
            </a-form-item>
            <a-form-item has-feedback validate-status="warning">
              <a-date-picker />
            </a-form-item>
            <a-form-item has-feedback validate-status="error">
              <a-date-picker />
            </a-form-item>
            <a-form-item has-feedback validate-status="validating">
              <a-date-picker />
            </a-form-item>
          </SplitSpace>
        </a-form>

        <SplitSpace>
          <a-checkbox>Checkbox</a-checkbox>

          <a-radio-group default-value="bamboo">
            <a-radio value="bamboo">Bamboo</a-radio>
            <a-radio value="light">Light</a-radio>
            <a-radio value="little">Little</a-radio>
          </a-radio-group>

          <a-mentions placeholder="Mention by @">
            <a-mentions-option value="afc163">afc163</a-mentions-option>
            <a-mentions-option value="zombieJ">zombieJ</a-mentions-option>
            <a-mentions-option value="yesmeck">yesmeck</a-mentions-option>
          </a-mentions>

          <a-slider :default-value="30" style="width: 100px" />

          <a-switch default-checked />
        </SplitSpace>

        <SplitSpace>
          <a-range-picker />
          <a-time-range-picker />
        </SplitSpace>

        <a-row :gutter="16">
          <a-col :span="8">
            <!-- Card -->
            <a-card style="width: 100%" :tab-list="carTabListNoTitle">
              <template #tabBarExtraContent>
                <a href="#">More</a>
              </template>
            </a-card>
          </a-col>
          <a-col :span="8">
            <!-- Table -->
            <a-table
              size="small"
              bordered
              :row-selection="{}"
              :columns="[
                {
                  title: 'Key',
                  dataIndex: 'key',
                  filters: [
                    {
                      text: 'Little',
                      value: 'little',
                    },
                  ],
                  sorter: (a, b) => a.key.length - b.key.length,
                },
              ]"
              :data-source="[
                {
                  key: 'Bamboo',
                },
                {
                  key: 'Light',
                },
                {
                  key: 'Little',
                },
              ]"
            />
          </a-col>
          <a-col :span="8">
            <!-- Table -->
            <a-tabs default-active-key="1">
              <a-tab-pane key="1" tab="Tab 1">Content of Tab Pane 1</a-tab-pane>
              <a-tab-pane key="2" tab="Tab 2">Content of Tab Pane 2</a-tab-pane>
              <a-tab-pane key="3" tab="Tab 3">Content of Tab Pane 3</a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>

        <SplitSpace>
          <a-tag color="success">success</a-tag>
          <a-tag color="processing">processing</a-tag>
          <a-tag color="error">error</a-tag>
          <a-tag color="warning">warning</a-tag>
          <a-tag color="default">default</a-tag>
          <a-checkable-tag checked>CheckableTag</a-checkable-tag>
        </SplitSpace>

        <a-row :gutter="16">
          <a-col :span="16">
            <a-timeline mode="alternate">
              <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
              <a-timeline-item color="gray">
                Solve initial network problems 2015-09-01
              </a-timeline-item>
              <a-timeline-item>
                <template #dot>
                  <ClockCircleOutlined style="font-size: 16px" />
                </template>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </a-timeline-item>
            </a-timeline>
          </a-col>

          <a-col :span="8">
            <a-tree :tree-data="treeData" :height="200" default-expand-all checkable />
          </a-col>
        </a-row>

        <!-- Alert -->
        <a-row :gutter="16">
          <a-col :span="6">
            <a-alert show-icon message="Success Text" type="success" />
          </a-col>
          <a-col :span="6">
            <a-alert show-icon message="Info Text" type="info" />
          </a-col>
          <a-col :span="6">
            <a-alert show-icon message="Warning Text" type="warning" />
          </a-col>
          <a-col :span="6">
            <a-alert show-icon message="Error Text" type="error" />
          </a-col>
        </a-row>

        <!-- Progress -->
        <a-row :gutter="16">
          <a-col flex="auto">
            <a-progress :percent="30" />
            <a-progress :percent="70" status="exception" />
            <a-progress :percent="100" />
          </a-col>
          <a-col flex="none">
            <a-progress type="circle" :percent="75" />
            <a-progress type="circle" :percent="70" status="exception" />
            <a-progress type="circle" :percent="100" />
          </a-col>
        </a-row>

        <a-transfer :data-source="transferData" :target-keys="['18']" :selected-keys="['3']">
          <template #render="item">{{ item.title }}</template>
        </a-transfer>
      </a-space>
    </a-col>
  </a-row>
</template>
<script lang="ts">
import { defineComponent, h, reactive, ref } from 'vue';
import { ConfigProvider, Space, Divider } from 'ant-design-vue';
import type { TreeSelectProps } from 'ant-design-vue';
import {
  DownOutlined,
  MailOutlined,
  SettingOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons-vue';
export default defineComponent({
  components: {
    DownOutlined,
    MailOutlined,
    SettingOutlined,
    ClockCircleOutlined,
    SplitSpace: (props, { slots }) =>
      h(Space, { size: 4, ...props }, { ...slots, split: () => h(Divider, { type: 'vertical' }) }),
  },
  setup() {
    const inputProps = {
      style: { width: '128px' },
    };

    const selectProps = {
      ...inputProps,
      options: [
        { value: 'light', label: 'Light' },
        { value: 'bamboo', label: 'Bamboo' },
        { value: 'little', label: 'Little' },
      ],
    };

    const treeData = [
      {
        value: 'little',
        key: 'little',
        label: 'Little',
        title: 'Little',
        children: [
          { value: 'light', key: 'light', label: 'Light', title: 'Light' },
          { value: 'bamboo', key: 'bamboo', label: 'Bamboo', title: 'Bamboo' },
        ],
      },
    ];

    const treeSelectProps: TreeSelectProps = {
      ...inputProps,
      treeCheckable: true,
      maxTagCount: 'responsive',
      treeData,
    };

    const carTabListNoTitle = [
      {
        key: 'article',
        tab: 'article',
      },
      {
        key: 'app',
        tab: 'app',
      },
      {
        key: 'project',
        tab: 'project',
      },
    ];

    const transferData = [];

    for (let i = 0; i < 20; i++) {
      transferData.push({
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
      });
    }

    const colorState = reactive({
      primaryColor: '#1890ff',
      errorColor: '#ff4d4f',
      warningColor: '#faad14',
      successColor: '#52c41a',
      infoColor: '#1890ff',
    });

    const onColorChange = (type: string, e: any) => {
      Object.assign(colorState, { [type]: e.target.value });
      ConfigProvider.config({
        theme: colorState,
      });
    };
    return {
      selectProps,
      carTabListNoTitle,
      onColorChange,
      treeData,
      treeSelectProps,
      transferData,
      colorState,
      inputProps,
      selectedKeys: ref(['mail']),
    };
  },
});
</script>
