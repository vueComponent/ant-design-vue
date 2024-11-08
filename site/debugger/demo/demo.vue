<template>
  <a-button type="primary">Tooltip will show when mouse enter.</a-button>
  <a-config-provider
    :theme="{
      cssVar: {
        key: 'test',
      },
      components: {
        Button: {
          colorPrimary: '#123456',
        },
      },
    }"
  >
    <a-button type="primary">Tooltip will show when mouse enter.</a-button>
  </a-config-provider>
</template>
