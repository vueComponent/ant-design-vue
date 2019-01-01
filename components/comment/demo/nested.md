<cn>
#### 嵌套评论
评论可以嵌套。
</cn>

<us>
#### Nested comments
Comments can be nested.
</us>

```html
<template>
  <a-comment>
    <template slot="actions">
      <span>Reply to</span>
    </template>
    <template slot="author">
      <a>Han Solo</a>
    </template>
    <template slot="avatar">
      <a-avatar
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        alt="Han Solo"
      />
    </template>
    <p slot="content">We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure).</p>
    <a-comment>
      <template slot="actions">
        <span>Reply to</span>
      </template>
      <template slot="author">
        <a>Han Solo</a>
      </template>
      <template slot="avatar">
        <a-avatar
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          alt="Han Solo"
        />
      </template>
      <p slot="content">We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure).</p>
      <a-comment>
        <template slot="actions">
          <span>Reply to</span>
        </template>
        <template slot="author">
          <a>Han Solo</a>
        </template>
        <template slot="avatar">
          <a-avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt="Han Solo"
          />
        </template>
        <p slot="content">We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure).</p>
      </a-comment>
      <a-comment>
        <template slot="actions">
          <span>Reply to</span>
        </template>
        <template slot="author">
          <a>Han Solo</a>
        </template>
        <template slot="avatar">
          <a-avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt="Han Solo"
          />
        </template>
        <p slot="content">We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure).</p>
      </a-comment>
    </a-comment>
  </a-comment>
</template>
```
