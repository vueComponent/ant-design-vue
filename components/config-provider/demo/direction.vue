<docs>
---
order: 2
title:
  zh-CN: 方向
  en-US: Direction
---

## zh-CN

这里列出了支持 `rtl` 方向的组件，您可以在演示中切换方向。

## en-US

Components which support rtl direction are listed here, you can toggle the direction in the demo.

</docs>

<template>
  <span style="margin-right: 16px">Change direction of components:</span>
  <a-radio-group v-model:value="state.direction">
    <a-radio-button value="ltr">LTR</a-radio-button>
    <a-radio-button value="rtl">RTL</a-radio-button>
  </a-radio-group>
  <a-divider />
  <a-config-provider :direction="state.direction">
    <div class="direction-components">
      <a-row>
        <a-col :span="24">
          <a-divider orientation="left">Cascader example</a-divider>
          <a-cascader
            :options="cascaderOptions"
            placeholder="یک مورد انتخاب کنید"
            :placement="state.popupPlacement"
            @change="onCascaderChange"
          >
            <template #suffixIcon><SearchIcon /></template>
          </a-cascader>
          &nbsp;&nbsp;&nbsp;&nbsp; With search:
          <a-cascader
            :options="cascaderOptions"
            placeholder="Select an item"
            :placement="state.popupPlacement"
            :show-search="{ filter: cascaderFilter }"
            @change="onCascaderChange"
          >
            <template #suffixIcon><SmileOutlined /></template>
          </a-cascader>
        </a-col>
      </a-row>
      <br />
      <a-row>
        <a-col :span="12">
          <a-divider orientation="left">Switch example</a-divider>
          &nbsp;&nbsp;
          <a-switch default-checked />
          &nbsp;&nbsp;
          <a-switch loading default-checked />
          &nbsp;&nbsp;
          <a-switch size="small" loading />
        </a-col>
        <a-col :span="12">
          <a-divider orientation="left">Radio Group example</a-divider>

          <a-radio-group default-value="c" button-style="solid">
            <a-radio-button value="a">تهران</a-radio-button>
            <a-radio-button value="b" disabled>اصفهان</a-radio-button>
            <a-radio-button value="c">فارس</a-radio-button>
            <a-radio-button value="d">خوزستان</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
      <br />
      <a-row>
        <a-col :span="12">
          <a-divider orientation="left">Button example</a-divider>
          <div class="button-demo">
            <a-button type="primary">
              <template #icon><DownloadOutlined /></template>
            </a-button>
            <a-button type="primary" shape="circle">
              <template #icon><DownloadOutlined /></template>
            </a-button>
            <a-button type="primary" shape="round">
              <template #icon><DownloadOutlined /></template>
            </a-button>
            <a-button type="primary" shape="round">
              <template #icon><DownloadOutlined /></template>
              Download
            </a-button>
            <a-button type="primary">
              <template #icon><DownloadOutlined /></template>
              Download
            </a-button>
            <br />
            <a-button-group>
              <a-button type="primary">
                <LeftOutlined />
                Backward
              </a-button>
              <a-button type="primary">
                Forward
                <RightOutlined />
              </a-button>
            </a-button-group>
            <a-button type="primary" loading>Loading</a-button>
            <a-button type="primary" size="small" loading>Loading</a-button>
          </div>
        </a-col>
        <a-col :span="12">
          <a-divider orientation="left">Tree example</a-divider>
          <a-tree
            v-model:expandedKeys="expandedKeys"
            v-model:selectedKeys="selectedKeys"
            v-model:checkedKeys="checkedKeys"
            show-line
            checkable
            :tree-data="treeData"
          >
            <template #title="{ title, key }">
              <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
              <template v-else>{{ title }}</template>
            </template>
          </a-tree>
        </a-col>
      </a-row>
      <br />
      <a-row>
        <a-col :span="24">
          <a-divider orientation="left">Input (Input Group) example</a-divider>
          <a-input-group size="large">
            <a-row :gutter="8">
              <a-col :span="5">
                <a-input default-value="0571" />
              </a-col>
              <a-col :span="8">
                <a-input default-value="26888888" />
              </a-col>
            </a-row>
          </a-input-group>
          <br />
          <a-input-group compact>
            <a-input style="width: 20%" default-value="0571" />
            <a-input style="width: 30%" default-value="26888888" />
          </a-input-group>
          <br />
          <a-input-group compact>
            <a-select default-value="Option1">
              <a-select-option value="Option1">Option1</a-select-option>
              <a-select-option value="Option2">Option2</a-select-option>
            </a-select>
            <a-input style="width: 50%" default-value="input content" />
            <a-inputNumber />
          </a-input-group>
          <br />
          <a-input-search placeholder="input search text" enter-button="Search" size="large" />
          <br />
          <br />
          <div style="margin-bottom: 16px">
            <a-input default-value="mysite">
              <template #selectBefore>
                <a-select default-value="Http://" style="width: 90px">
                  <a-select-option value="Http://">Http://</a-select-option>
                  <a-select-option value="Https://">Https://</a-select-option>
                </a-select>
              </template>
              <template #selectAfter>
                <a-select default-value=".com" style="width: 80px">
                  <a-select-option value=".com">.com</a-select-option>
                  <a-select-option value=".jp">.jp</a-select-option>
                  <a-select-option value=".cn">.cn</a-select-option>
                  <a-select-option value=".org">.org</a-select-option>
                </a-select>
              </template>
            </a-input>
          </div>
          <br />
          <a-row>
            <a-col :span="12">
              <a-divider orientation="left">Select example</a-divider>
              <a-select mode="multiple" default-value="مورچه" style="width: 120px">
                <a-select-option value="jack">Jack</a-select-option>
                <a-select-option value="مورچه">مورچه</a-select-option>
                <a-select-option value="disabled" disabled>Disabled</a-select-option>
                <a-select-option value="Yiminghe">yiminghe</a-select-option>
              </a-select>
              <a-select default-value="مورچه" style="width: 120px" disabled>
                <a-select-option value="مورچه">مورچه</a-select-option>
              </a-select>
              <a-select default-value="مورچه" style="width: 120px" loading>
                <a-select-option value="مورچه">مورچه</a-select-option>
              </a-select>
              <a-select
                show-search
                style="width: 200px"
                placeholder="Select a person"
                option-filter-prop="children"
                :filter-option="
                  (input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                "
              >
                <a-select-option value="jack">Jack</a-select-option>
                <a-select-option value="سعید">سعید</a-select-option>
                <a-select-option value="tom">Tom</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="12">
              <a-divider orientation="left">TreeSelect example</a-divider>
              <div>
                <a-tree-select
                  show-search
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="Please select"
                  allow-clear
                  tree-default-expand-all
                  :tree-data="treeSelectData"
                ></a-tree-select>
              </div>
            </a-col>
          </a-row>
          <br />
          <a-row>
            <a-col :span="24">
              <a-divider orientation="left">Modal example</a-divider>
              <div>
                <a-button type="primary" @click="showModal">Open Modal</a-button>
                <a-modal v-model:visible="state.modalVisible" title="پنچره ساده">
                  <p>نگاشته‌های خود را اینجا قراردهید</p>
                  <p>نگاشته‌های خود را اینجا قراردهید</p>
                  <p>نگاشته‌های خود را اینجا قراردهید</p>
                </a-modal>
              </div>
            </a-col>
          </a-row>
          <br />
          <a-row>
            <a-col :span="24">
              <a-divider orientation="left">Steps example</a-divider>
              <div>
                <a-steps progress-dot :current="state.currentStep">
                  <a-step title="Finished" description="This is a description." />
                  <a-step title="In Progress" description="This is a description." />
                  <a-step title="Waiting" description="This is a description." />
                </a-steps>
                <br />
                <a-steps :current="state.currentStep" @change="onStepsChange">
                  <a-step title="Step 1" description="This is a description." />
                  <a-step title="Step 2" description="This is a description." />
                  <a-step title="Step 3" description="This is a description." />
                </a-steps>
              </div>
            </a-col>
          </a-row>
          <br />
          <a-row>
            <a-col :span="12">
              <a-divider orientation="left">Rate example</a-divider>
              <div>
                <a-rate v-model:value="rateValue" />
                <br />
                <strong>* Note:</strong>
                Half star not implemented in RTL direction.
              </div>
            </a-col>
            <a-col :span="12">
              <a-divider orientation="left">Badge example</a-divider>
              <div>
                <div>
                  <a-badge :count="state.badgeCount">
                    <a href="#" class="head-example" />
                  </a-badge>
                  <a-button-group>
                    <a-button @click="declineBadge">
                      <MinusOutlined />
                    </a-button>
                    <a-button @click="increaseBadge">
                      <PlusOutlined />
                    </a-button>
                  </a-button-group>
                </div>
                <div style="margin-top: 10px">
                  <a-badge :dot="state.showBadge">
                    <a href="#" class="head-example" />
                  </a-badge>
                  <a-switch :checked="state.showBadge" @change="onChangeBadge" />
                </div>
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>

      <br />
      <br />
      <a-row>
        <a-col :span="24">
          <a-divider orientation="left">Pagination example</a-divider>
          <a-pagination show-size-changer :default-current="3" :total="500" />
        </a-col>
      </a-row>
      <br />
      <a-row>
        <a-col :span="24">
          <a-divider orientation="left">Grid System example</a-divider>
          <div class="grid-demo">
            <div class="code-box-demo">
              <p>
                <strong>* Note:</strong>
                Every calculation in RTL grid system is from right side (offset, push, etc.)
              </p>
              <a-row>
                <a-col :span="8">col-8</a-col>
                <a-col :span="8" :offset="8">col-8</a-col>
              </a-row>
              <a-row>
                <a-col :span="6" :offset="6">col-6 col-offset-6</a-col>
                <a-col :span="6" :offset="6">col-6 col-offset-6</a-col>
              </a-row>
              <a-row>
                <a-col :span="12" :offset="6">col-12 col-offset-6</a-col>
              </a-row>
              <a-row>
                <a-col :span="18" :push="6">col-18 col-push-6</a-col>
                <a-col :span="6" :pull="18">col-6 col-pull-18</a-col>
              </a-row>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-config-provider>
</template>
<script lang="ts">
import { defineComponent, reactive, watch, ref } from 'vue';

import {
  SearchOutlined as SearchIcon,
  SmileOutlined,
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';
import type { TreeProps, TreeSelectProps, CascaderProps } from 'ant-design-vue';

export default defineComponent({
  components: {
    SmileOutlined,
    DownloadOutlined,
    LeftOutlined,
    RightOutlined,
    MinusOutlined,
    PlusOutlined,
    SearchIcon,
  },
  setup() {
    const state = reactive({
      currentStep: 0,
      modalVisible: false,

      badgeCount: 5,
      showBadge: true,
      direction: 'ltr' as 'ltr' | 'rtl',
      popupPlacement: 'bottomLeft' as CascaderProps['placement'],
    });
    const expandedKeys = ref<string[]>(['0-0-0', '0-0-1']);
    const selectedKeys = ref<string[]>(['0-0-0', '0-0-1']);
    const checkedKeys = ref<string[]>(['0-0-0', '0-0-1']);

    const treeData: TreeProps['treeData'] = [
      {
        title: 'parent 1',
        key: '0-0',
        children: [
          {
            title: 'parent 1-0',
            key: '0-0-0',
            disabled: true,
            children: [
              { title: 'leaf', key: '0-0-0-0', disableCheckbox: true },
              { title: 'leaf', key: '0-0-0-1' },
            ],
          },
          {
            title: 'parent 1-1',
            key: '0-0-1',
            children: [{ key: '0-0-1-0', title: 'sss' }],
          },
        ],
      },
    ];

    const treeSelectData = ref<TreeSelectProps['treeData']>([
      {
        title: 'parent 1',
        value: 'parent 1',
        children: [
          {
            title: 'parent 1-0',
            value: 'parent 1-0',
            children: [
              {
                title: 'my leaf',
                value: 'leaf1',
              },
              {
                title: 'your leaf',
                value: 'leaf2',
              },
            ],
          },
          {
            title: 'parent 1-1',
            value: 'parent 1-1',
          },
        ],
      },
    ]);
    watch(
      () => state.direction,
      directionValue => {
        if (directionValue === 'rtl') {
          state.popupPlacement = 'bottomRight';
        } else {
          state.popupPlacement = 'bottomLeft';
        }
      },
    );
    const cascaderOptions = [
      {
        value: 'tehran',
        label: 'تهران',
        children: [
          {
            value: 'tehran-c',
            label: 'تهران',
            children: [
              {
                value: 'saadat-abad',
                label: 'سعادت آیاد',
              },
            ],
          },
        ],
      },
      {
        value: 'ardabil',
        label: 'اردبیل',
        children: [
          {
            value: 'ardabil-c',
            label: 'اردبیل',
            children: [
              {
                value: 'primadar',
                label: 'پیرمادر',
              },
            ],
          },
        ],
      },
      {
        value: 'gilan',
        label: 'گیلان',
        children: [
          {
            value: 'rasht',
            label: 'رشت',
            children: [
              {
                value: 'district-3',
                label: 'منطقه ۳',
              },
            ],
          },
        ],
      },
    ];

    // ==== Cascader ====
    const cascaderFilter = (inputValue, path) =>
      path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);

    const onCascaderChange = value => {
      console.log(value);
    };
    // ==== End Cascader ====

    // ==== Modal ====
    const showModal = () => {
      state.modalVisible = true;
    };

    // ==== End Modal ====

    const onStepsChange = currentStep => {
      console.log('onChange:', currentStep);
      state.currentStep = currentStep;
    };

    // ==== Badge ====

    const increaseBadge = () => {
      const badgeCount = state.badgeCount + 1;
      state.badgeCount = badgeCount;
    };

    const declineBadge = () => {
      let badgeCount = state.badgeCount - 1;
      if (badgeCount < 0) {
        badgeCount = 0;
      }
      state.badgeCount = badgeCount;
    };

    const onChangeBadge = showBadge => {
      state.showBadge = showBadge;
    };
    return {
      state,
      cascaderOptions,
      cascaderFilter,
      onCascaderChange,
      showModal,
      onStepsChange,
      increaseBadge,
      declineBadge,
      onChangeBadge,
      expandedKeys,
      selectedKeys,
      checkedKeys,
      treeData,
      treeSelectData,
      rateValue: ref(2),
    };
  },
});
</script>
<style lang="less">
.direction-components {
  .button-demo .ant-btn,
  .button-demo .ant-btn-group {
    margin-right: 8px;
    margin-bottom: 12px;
  }
  .button-demo .ant-btn-group > .ant-btn,
  .button-demo .ant-btn-group > span > .ant-btn {
    margin-right: 0;
    margin-left: 0;
  }

  .head-example {
    display: inline-block;
    width: 42px;
    height: 42px;
    vertical-align: middle;
    background: #eee;
    border-radius: 4px;
  }

  .ant-badge:not(.ant-badge-not-a-wrapper) {
    margin-right: 20px;
  }
  .ant-badge-rtl:not(.ant-badge-not-a-wrapper) {
    margin-right: 0;
    margin-left: 20px;
  }
}

[data-theme='dark'] .head-example {
  background: rgba(255, 255, 255, 0.12);
}
</style>
