<cn>
#### 异步加载
匹配内容列表为异步返回时。
</cn>

<us>
#### Asynchronous loading
async.
</us>

```vue
<template>
  <a-mentions :loading="loading" @search="onSearch">
    <a-mentions-option
      v-for="({ login, avatar_url: avatar }) in users"
      :key="login"
      :value="login"
    >
      <img :src="avatar" :alt="login" style="width: 20px; margin-right: 8px;">
      <span>{{ login }}</span>
    </a-mentions-option>
  </a-mentions>
</template>

<script>
import debounce from 'lodash/debounce';
export default {
  data() {
    return {
      loading: false,
      users: [],
    };
  },
  mounted() {
    this.loadGithubUsers = debounce(this.loadGithubUsers, 800);
  },
  methods: {
    onSearch(search) {
      this.search = search;
      this.loading = !!search;
      console.log(!!search);
      this.users = [];
      console.log('Search:', search);
      this.loadGithubUsers(search);
    },
    loadGithubUsers(key) {
      if (!key) {
        this.users = [];
        return;
      }
      fetch(`https://api.github.com/search/users?q=${key}`)
        .then(res => res.json())
        .then(({ items = [] }) => {
          const { search } = this;
          if (search !== key) return;

          this.users = items.slice(0, 10);
          this.loading = false;
        });
      },
  },
};
</script>
<style>
```
