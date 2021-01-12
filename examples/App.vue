<template>
  <div>
    <a-collapse :accordion="true" default-active-key="2" :bordered="false">
      <a-collapse-panel key="1" header="This is panel header 1">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="This is panel header 2" :disabled="false">
        <p>{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="This is panel header 3">
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>

    <a-divider orientation="left">Examples</a-divider>

    <a-tooltip title="Tooltip Disabled" disabled placement="top">
      <a-button disabled>Tooltip Disabled</a-button>
    </a-tooltip>
    <a-tooltip title="Tooltip Enabled" placement="top">
      <a-button>Tooltip Enabled</a-button>
    </a-tooltip>

    <a-divider></a-divider>

    <a-popconfirm placement="top" disabled ok-text="Yes" cancel-text="No">
      <template slot="title">
        <p>Popconfirm Disabled</p>
      </template>
      <a-button disabled>Popconfirm Disabled</a-button>
    </a-popconfirm>
    <a-popconfirm placement="top" ok-text="Yes" cancel-text="No">
      <template slot="title">
        <p>Popconfirm Enabled</p>
      </template>
      <a-button>Popconfirm Enabled</a-button>
    </a-popconfirm>

    <a-divider></a-divider>

    <a-popover title="Popover Disabled" disabled>
      <template slot="content">
        <p>Popover Disabled</p>
      </template>
      <a-button disabled>Popover Disabled</a-button>
    </a-popover>
    <a-popover title="Popover Enabled">
      <template slot="content">
        <p>Popover Enabled</p>
      </template>
      <a-button>Popover Enabled</a-button>
    </a-popover>
  </div>
</template>
<script>
export default {
  data() {
    return {
      text: `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`,
    };
  },
};
</script>
