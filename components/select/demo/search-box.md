<cn>
#### 搜索框
搜索和远程数据结合。
</cn>

<us>
#### Search Box
Search with remote data.
</us>

```tpl
<template>
  <a-select
    showSearch
    :value="value"
    placeholder="input search text"
    style="width: 200px"
    :defaultActiveFirstOption="false"
    :showArrow="false"
    :filterOption="false"
    @search="handleSearch"
    @change="handleChange"
    :notFoundContent="null"
  >
    <a-select-option v-for="d in data" :key="d.value">{{d.text}}</a-select-option>
  </a-select>
</template>
<script>
  import jsonp from 'fetch-jsonp';
  import querystring from 'querystring';

  let timeout;
  let currentValue;

  function fetch(value, callback) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;

    function fake() {
      const str = querystring.encode({
        code: 'utf-8',
        q: value,
      });
      jsonp(`https://suggest.taobao.com/sug?${str}`)
        .then(response => response.json())
        .then(d => {
          if (currentValue === value) {
            const result = d.result;
            const data = [];
            result.forEach(r => {
              data.push({
                value: r[0],
                text: r[0],
              });
            });
            callback(data);
          }
        });
    }

    timeout = setTimeout(fake, 300);
  }
  export default {
    data() {
      return {
        data: [],
        value: undefined,
      };
    },
    methods: {
      handleSearch(value) {
        fetch(value, data => (this.data = data));
      },
      handleChange(value) {
        console.log(value);
        this.value = value;
        fetch(value, data => (this.data = data));
      },
    },
  };
</script>
```
