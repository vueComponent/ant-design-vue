<template>
  <a-flex gap="middle" vertical>
    <label>
      Select axis:
      <select v-model="axis">
        <option v-for="item in axisOptions" :key="item">{{ item }}</option>
      </select>
    </label>
    <a-flex :vertical="axis === 'vertical'">
      <div
        v-for="(item, index) in new Array(4)"
        :key="item"
        :style="{ ...baseStyle, background: `${index % 2 ? '#1677ff' : '#1677ffbf'}` }"
      />
    </a-flex>
    <hr/>
    <label>
      Select justify:
      <select v-model="justify">
        <option v-for="item in justifyOptions" :key="item">{{ item }}</option>
      </select>
    </label>
    <label>
      Select align:
      <select v-model="align">
        <option v-for="item in alignOptions" :key="item">{{ item }}</option>
      </select>
    </label>
    <a-flex :style="{ ...boxStyle }" :justify="justify" :align="align">
      <a-button variant="solid">Primary</a-button>
      <a-button variant="solid">Primary</a-button>
      <a-button variant="solid">Primary</a-button>
      <a-button variant="solid">Primary</a-button>
    </a-flex>
    <hr/>
    <a-flex gap="middle" vertical>
      <label>
        Select gap size:
        <select v-model="gapSize">
          <option v-for="item in gapSizeOptions" :key="item">{{ item }}</option>
        </select>
      </label>
      <a-flex :gap="gapSize">
        <a-button variant="solid">Primary</a-button>
        <a-button>Default</a-button>
        <a-button variant="dashed">Dashed</a-button>
        <a-button variant="link">Link</a-button>
      </a-flex>
    </a-flex>
    <hr/>
    <label>
      Auto wrap:
    </label>
    <a-flex wrap="wrap" gap="small">
      <a-button v-for="item in new Array(24)" :key="item" variant="solid">Button</a-button>
    </a-flex>
  </a-flex>
</template>

<script setup lang="ts">
  import type { CSSProperties } from 'vue';
  import { ref, reactive } from 'vue';

  const baseStyle: CSSProperties = {
    width: '25%',
    height: '54px',
  };
  const boxStyle: CSSProperties = {
    width: '100%',
    height: '120px',
    borderRadius: '6px',
    border: '1px solid #40a9ff',
  };

  const axisOptions = reactive(['horizontal', 'vertical']);
  const axis = ref(axisOptions[0]);

  const justifyOptions = reactive([
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
  ]);
  const justify = ref(justifyOptions[0]);

  const alignOptions = reactive(['flex-start', 'center', 'flex-end']);
  const align = ref(alignOptions[0]);

  const gapSizeOptions = reactive(['small', 'middle', 'large']);
  const gapSize = ref(gapSizeOptions[0]);
</script>
