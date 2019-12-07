<cn>
#### 联动
省市联动是典型的例子。
推荐使用 [Cascader](/components/cascader-cn/) 组件。
</cn>

<us>
#### coordinate
Coordinating the selection of provinces and cities is a common use case and demonstrates how selection can be coordinated.
Using the [Cascader](/components/cascader) component is strongly recommended instead as it is more flexible and capable.
</us>

```tpl
<template>
  <div>
    <a-select :defaultValue="provinceData[0]" style="width: 120px" @change="handleProvinceChange">
      <a-select-option v-for="province in provinceData" :key="province"
        >{{province}}</a-select-option
      >
    </a-select>
    <a-select v-model="secondCity" style="width: 120px">
      <a-select-option v-for="city in cities" :key="city">{{city}}</a-select-option>
    </a-select>
  </div>
</template>
<script>
  const provinceData = ['Zhejiang', 'Jiangsu'];
  const cityData = {
    Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
    Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
  };
  export default {
    data() {
      return {
        provinceData,
        cityData,
        cities: cityData[provinceData[0]],
        secondCity: cityData[provinceData[0]][0],
      };
    },
    methods: {
      handleProvinceChange(value) {
        this.cities = cityData[value];
        this.secondCity = cityData[value][0];
      },
    },
  };
</script>
```
