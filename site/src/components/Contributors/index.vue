<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { REPO_PATH } from './constants';
import dayjs from 'dayjs';

defineProps({
  isZn: Boolean,
});

const route = useRoute();
const contributors = ref([]);
const lastCommitTime = ref(0);

const filterData = data => {
  const arr = [];
  data.forEach(item => {
    if (!!item.author?.login || !!item.author?.html_url || !!item.author?.avatar_url) {
      lastCommitTime.value = Math.max(lastCommitTime.value, +new Date(item.commit.author.date));

      arr.push({
        login: item.author.login,
        url: item.author.html_url,
        avatar: item.author.avatar_url,
      });
    }
  });
  contributors.value = arr.reduce((acc, curr) => {
    if (!acc.find(item => item.login === curr.login)) {
      acc.push(curr);
    }
    return acc;
  }, []);
};
const getContributors = async () => {
  const path = route.path;
  const parts = path.split('/');
  const name = parts[2];
  const componentName = name.includes('-') ? name.replace('-cn', '') : name;
  const url = `https://api.github.com/repos/${REPO_PATH}/commits?path=/components/${componentName}`;
  try {
    const req = await fetch(url);
    const res = await req.json();
    filterData(res);
  } catch (e) {
    return null;
  }
};
watchEffect(() => {
  getContributors();
});
</script>

<template>
  <div v-if="contributors.length > 0" class="contributors-list">
    <ul class="acss-1ppw8kl">
      <li v-for="item in contributors" :key="item.login">
        <a-tooltip :title="`${isZn ? '文档贡献者：' : 'Contributor: '}${item.login}`">
          <a :href="item.url" target="_blank">
            <a-avatar :src="item.avatar" size="small" />
          </a>
        </a-tooltip>
      </li>
    </ul>
    <span>
      {{ isZn ? '最后更新' : 'Last updated' }} : {{ dayjs(lastCommitTime).format('YYYY/MM/DD') }}
    </span>
  </div>
</template>

<style scoped>
.contributors-list {
  margin-top: 120px !important;
  display: flex;
  gap: 8px;
}

.contributors-list span {
  color: var(--primary-color);
}

.acss-1ppw8kl {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  clear: both;
  flex: 1;
}

.acss-1ppw8kl li {
  height: 24px;
}

.acss-1ppw8kl li,
.acss-1ppw8kl .ant-avatar + .ant-avatar {
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  -webkit-margin-end: -8px;
  margin-inline-end: -8px;
}

.acss-1ppw8kl:hover li,
.acss-1ppw8kl:hover .ant-avatar {
  -webkit-margin-end: 0;
  margin-inline-end: 0;
}
</style>
