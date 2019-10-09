<cn>
#### 可搜索
可搜索的树。
</cn>

<us>
#### Searchable
Searchable Tree.
</us>

```tpl
<template>
  <div>
    <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" />
    <a-tree
      @expand="onExpand"
      :expandedKeys="expandedKeys"
      :autoExpandParent="autoExpandParent"
      :treeData="gData"
    >
      <template slot="title" slot-scope="{title}">
        <span v-if="title.indexOf(searchValue) > -1">
          {{title.substr(0, title.indexOf(searchValue))}}
          <span style="color: #f50">{{searchValue}}</span>
          {{title.substr(title.indexOf(searchValue) + searchValue.length)}}
        </span>
        <span v-else>{{title}}</span>
      </template>
    </a-tree>
  </div>
</template>

<script>
  const x = 3;
  const y = 2;
  const z = 1;
  const gData = [];

  const generateData = (_level, _preKey, _tns) => {
    const preKey = _preKey || '0';
    const tns = _tns || gData;

    const children = [];
    for (let i = 0; i < x; i++) {
      const key = `${preKey}-${i}`;
      tns.push({ title: key, key, scopedSlots: { title: 'title' } });
      if (i < y) {
        children.push(key);
      }
    }
    if (_level < 0) {
      return tns;
    }
    const level = _level - 1;
    children.forEach((key, index) => {
      tns[index].children = [];
      return generateData(level, key, tns[index].children);
    });
  };
  generateData(z);

  const dataList = [];
  const generateList = data => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const key = node.key;
      dataList.push({ key, title: key });
      if (node.children) {
        generateList(node.children, node.key);
      }
    }
  };
  generateList(gData);

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };
  export default {
    data() {
      return {
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        gData,
      };
    },
    methods: {
      onExpand(expandedKeys) {
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false;
      },
      onChange(e) {
        const value = e.target.value;
        const expandedKeys = dataList
          .map(item => {
            if (item.key.indexOf(value) > -1) {
              return getParentKey(item.key, gData);
            }
            return null;
          })
          .filter((item, i, self) => item && self.indexOf(item) === i);
        Object.assign(this, {
          expandedKeys,
          searchValue: value,
          autoExpandParent: true,
        });
      },
    },
  };
</script>
```
