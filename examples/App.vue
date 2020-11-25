<template>
  <div>
    <a-cascader :options="options"/>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [
        {
          value: '0',
          label: '0',
          children: [
            {
              value: '0-0',
              label: '0-0',
              children: [
                {
                  value: '0-0-0',
                  label: '0-0-0',
                  children: [],
                }],
            }],
        },
      ],
    };
  },
};
</script>
