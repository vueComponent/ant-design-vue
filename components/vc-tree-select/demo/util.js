/* eslint no-loop-func: 0, no-console: 0 */

export function generateData(x = 3, y = 2, z = 1, gData = []) {
  // x：每一级下的节点总数。y：每级节点里有y个节点、存在子节点。z：树的level层级数（0表示一级）
  function _loop(_level, _preKey, _tns) {
    const preKey = _preKey || '0';
    const tns = _tns || gData;

    const children = [];
    for (let i = 0; i < x; i++) {
      const key = `${preKey}-${i}`;
      tns.push({
        label: `${key}-label`,
        value: `${key}-value`,
        key,
        disabled: key === '0-0-0-1' || false,
      });
      if (i < y) {
        children.push(key);
      }
    }
    if (_level < 0) {
      return tns;
    }
    const __level = _level - 1;
    children.forEach((key, index) => {
      tns[index].children = [];
      return _loop(__level, key, tns[index].children);
    });

    return null;
  }
  _loop(z);
  return gData;
}
export function calcTotal(x = 3, y = 2, z = 1) {
  /* eslint no-param-reassign:0 */
  const rec = n => (n >= 0 ? x * y ** n-- + rec(n) : 0);
  return rec(z + 1);
}
console.log('总节点数（单个tree）：', calcTotal());
export const gData = generateData();

export function generateTreeNodes(treeNode) {
  const arr = [];
  const key = treeNode.eventKey;
  for (let i = 0; i < 3; i++) {
    arr.push({ label: `${key}-${i}-label`, value: `${key}-${i}-value`, key: `${key}-${i}` });
  }
  return arr;
}

function setLeaf(treeData, curKey, level) {
  const loopLeaf = (data, lev) => {
    const l = lev - 1;
    data.forEach(item => {
      if (
        item.key.length > curKey.length
          ? item.key.indexOf(curKey) !== 0
          : curKey.indexOf(item.key) !== 0
      ) {
        return;
      }
      if (item.children) {
        loopLeaf(item.children, l);
      } else if (l < 1) {
        item.isLeaf = true;
      }
    });
  };
  loopLeaf(treeData, level + 1);
}

export function getNewTreeData(treeData, curKey, child, level) {
  const loop = data => {
    if (level < 1 || curKey.length - 3 > level * 2) return;
    data.forEach(item => {
      if (curKey.indexOf(item.key) === 0) {
        if (item.children) {
          loop(item.children);
        } else {
          item.children = child;
        }
      }
    });
  };
  loop(treeData);
  setLeaf(treeData, curKey, level);
}

function loopData(data, callback) {
  const loop = (d, level = 0) => {
    d.forEach((item, index) => {
      const pos = `${level}-${index}`;
      if (item.children) {
        loop(item.children, pos);
      }
      callback(item, index, pos);
    });
  };
  loop(data);
}

function isPositionPrefix(smallPos, bigPos) {
  if (bigPos.length < smallPos.length) {
    return false;
  }
  // attention: "0-0-1" "0-0-10"
  if (bigPos.length > smallPos.length && bigPos.charAt(smallPos.length) !== '-') {
    return false;
  }
  return bigPos.substr(0, smallPos.length) === smallPos;
}
// console.log(isPositionPrefix("0-1", "0-10-1"));

export function getFilterValue(val, sVal, delVal) {
  const allPos = [];
  const delPos = [];
  loopData(gData, (item, index, pos) => {
    if (sVal.indexOf(item.value) > -1) {
      allPos.push(pos);
    }
    if (delVal.indexOf(item.value) > -1) {
      delPos.push(pos);
    }
  });
  const newPos = [];
  delPos.forEach(item => {
    allPos.forEach(i => {
      if (isPositionPrefix(item, i) || isPositionPrefix(i, item)) {
        // 过滤掉 父级节点 和 所有子节点。
        // 因为 node节点 不选时，其 父级节点 和 所有子节点 都不选。
        return;
      }
      newPos.push(i);
    });
  });
  const newVal = [];
  if (newPos.length) {
    loopData(gData, (item, index, pos) => {
      if (newPos.indexOf(pos) > -1) {
        newVal.push(item.value);
      }
    });
  }
  return newVal;
}
