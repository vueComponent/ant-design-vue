<cn>
#### 基本评论
一个基本的评论组件，带有作者、头像、时间和操作。
</cn>

<us>
#### Basic comment
A basic comment with author, avatar, time and actions.
</us>

```tpl
<template>
  <a-comment>
    <template slot="actions">
      <span>
        <a-tooltip title="Like">
          <a-icon type="like" :theme="action === 'liked' ? 'filled' : 'outlined'" @click="like" />
        </a-tooltip>
        <span style="padding-left: '8px';cursor: 'auto'">
          {{likes}}
        </span>
      </span>
      <span>
        <a-tooltip title="Dislike">
          <a-icon
            type="dislike"
            :theme="action === 'disliked' ? 'filled' : 'outlined'"
            @click="dislike"
          />
        </a-tooltip>
        <span style="padding-left: '8px';cursor: 'auto'">
          {{dislikes}}
        </span>
      </span>
      <span>Reply to</span>
    </template>
    <a slot="author">Han Solo</a>
    <a-avatar
      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
      alt="Han Solo"
      slot="avatar"
    />
    <p slot="content">
      We supply a series of design principles, practical patterns and high quality design resources
      (Sketch and Axure), to help people create their product prototypes beautifully and
      efficiently.
    </p>
    <a-tooltip slot="datetime" :title="moment().format('YYYY-MM-DD HH:mm:ss')">
      <span>{{moment().fromNow()}}</span>
    </a-tooltip>
  </a-comment>
</template>
<script>
  import moment from 'moment';
  export default {
    data() {
      return {
        likes: 0,
        dislikes: 0,
        action: null,
        moment,
      };
    },
    methods: {
      like() {
        this.likes = 1;
        this.dislikes = 0;
        this.action = 'liked';
      },
      dislike() {
        this.likes = 0;
        this.dislikes = 1;
        this.action = 'disliked';
      },
    },
  };
</script>
```
