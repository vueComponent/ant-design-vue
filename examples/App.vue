<template>
  <div>
    <a-affix class="red"></a-affix>
    <a-alert class="red"></a-alert>
    <a-anchor class="red">
      <a-anchor-link class="red" href="#components-anchor-demo-basic" title="Basic demo" />
    </a-anchor>
    <a-auto-complete :dataSource="[]" class="red"></a-auto-complete>
    <a-avatar class="red"></a-avatar>
    <a-back-top class="red">jjj</a-back-top>
    <a-badge class="red"></a-badge>
    <a-breadcrumb class="red">
      <a-breadcrumb-item class="red">Home</a-breadcrumb-item>
    </a-breadcrumb>
    <a-button class="red"></a-button>
    <a-calendar class="red"></a-calendar>
    <a-card class="red"></a-card>
    <a-carousel class="red">
      <div>
        <h3>1</h3>
      </div>
    </a-carousel>
    <a-checkbox class="red">Checkbox</a-checkbox>
    <a-checkbox-group class="red"></a-checkbox-group>
    <a-collapse class="red">
      <a-collapse-panel class="red" key="1" header="This is panel header 1">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="This is panel header 2" :disabled="false">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="This is panel header 3" disabled>
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>
    <a-date-picker class="red"></a-date-picker>
    <br />
    <a-month-picker class="red" placeholder="Select month" />
    <br />
    <a-range-picker class="red" />
    <br />
    <a-week-picker class="red" placeholder="Select week" />

    <a-descriptions title="User Info" class="red">
      <a-descriptions-item label="Address" class="red"
        >No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China</a-descriptions-item
      >
    </a-descriptions>
    <a-drawer class="red" style="margin-top: 10px"></a-drawer>>
    <a-dropdown class="red">
      <a>ssss</a>
    </a-dropdown>
    <a-dropdown-button class="red"></a-dropdown-button>
  </div>
</template>
<style scoped>
.red {
  color: red;
}</style
>>
