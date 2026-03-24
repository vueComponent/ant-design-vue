<script setup lang="ts">
import { ref } from 'vue'

const checked1 = ref(true)
const checked2 = ref(false)
const checked3 = ref(true)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <a-switch v-model:checked="checked1">
      <template #checkedChildren>开启</template>
      <template #unCheckedChildren>关闭</template>
    </a-switch>

    <a-switch v-model:checked="checked2">
      <template #checkedChildren>1</template>
      <template #unCheckedChildren>0</template>
    </a-switch>

    <a-switch v-model:checked="checked3">
      <template #checkedChildren>
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          aria-hidden="true"
          style="display: block; width: 1em; height: 1em; fill: currentcolor"
        >
          <path
            d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"
          />
        </svg>
      </template>
      <template #unCheckedChildren>
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          aria-hidden="true"
          style="display: block; width: 1em; height: 1em; fill: currentcolor"
        >
          <path
            fill-rule="evenodd"
            d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"
          />
        </svg>
      </template>
    </a-switch>
  </div>
</template>
