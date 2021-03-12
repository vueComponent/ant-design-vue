<cn>
#### 自定义尺寸
自定义尺寸，适应在各种容器中展示。
</cn>

<us>
#### Custom size
Custom sizes to fit in a variety of containers.
</us>

```vue
<template>
  <div>
    <a-radio-group v-model="size" @change="onChange">
      <a-radio value="default">
        default
      </a-radio>
      <a-radio value="middle">
        middle
      </a-radio>
      <a-radio value="small">
        small
      </a-radio>
    </a-radio-group>
    <br />
    <br />
    <a-descriptions bordered title="Custom Size" :size="size">
      <a-descriptions-item label="Product">
        Cloud Database
      </a-descriptions-item>
      <a-descriptions-item label="Billing">
        Prepaid
      </a-descriptions-item>
      <a-descriptions-item label="Time">
        18:00:00
      </a-descriptions-item>
      <a-descriptions-item label="Amount">
        $80.00
      </a-descriptions-item>
      <a-descriptions-item label="Discount">
        $20.00
      </a-descriptions-item>
      <a-descriptions-item label="Official">
        $60.00
      </a-descriptions-item>
      <a-descriptions-item label="Config Info">
        Data disk type: MongoDB
        <br />
        Database version: 3.4
        <br />
        Package: dds.mongo.mid
        <br />
        Storage space: 10 GB
        <br />
        Replication factor: 3
        <br />
        Region: East China 1<br />
      </a-descriptions-item>
    </a-descriptions>
    <br />
    <br />
    <a-descriptions title="Custom Size" :size="size">
      <a-descriptions-item label="Product">
        Cloud Database
      </a-descriptions-item>
      <a-descriptions-item label="Billing">
        Prepaid
      </a-descriptions-item>
      <a-descriptions-item label="Time">
        18:00:00
      </a-descriptions-item>
      <a-descriptions-item label="Amount">
        $80.00
      </a-descriptions-item>
      <a-descriptions-item label="Discount">
        $20.00
      </a-descriptions-item>
      <a-descriptions-item label="Official">
        $60.00
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>
<script>
export default {
  data() {
    return {
      size: 'default',
    };
  },
  methods: {
    onChange(e) {
      console.log('size checked', e.target.value);
      this.size = e.target.value;
    },
  },
};
</script>
```
