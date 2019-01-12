export function flatArray(data = [], childrenName = 'children') {
  const result = [];
  const loop = array => {
    array.forEach(item => {
      if (item[childrenName]) {
        const newItem = { ...item };
        delete newItem[childrenName];
        result.push(newItem);
        if (item[childrenName].length > 0) {
          loop(item[childrenName]);
        }
      } else {
        result.push(item);
      }
    });
  };
  loop(data);
  return result;
}

export function treeMap(tree, mapper, childrenName = 'children') {
  return tree.map((node, index) => {
    const extra = {};
    if (node[childrenName]) {
      extra[childrenName] = treeMap(node[childrenName], mapper, childrenName);
    }
    return {
      ...mapper(node, index),
      ...extra,
    };
  });
}

export function flatFilter(tree, callback) {
  return tree.reduce((acc, node) => {
    if (callback(node)) {
      acc.push(node);
    }
    if (node.children) {
      const children = flatFilter(node.children, callback);
      acc.push(...children);
    }
    return acc;
  }, []);
}

// export function normalizeColumns (elements) {
//   const columns = []
//   React.Children.forEach(elements, (element) => {
//     if (!React.isValidElement(element)) {
//       return
//     }
//     const column = {
//       ...element.props,
//     }
//     if (element.key) {
//       column.key = element.key
//     }
//     if (element.type && element.type.__ANT_TABLE_COLUMN_GROUP) {
//       column.children = normalizeColumns(column.children)
//     }
//     columns.push(column)
//   })
//   return columns
// }
