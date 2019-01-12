const traverseFileTree = (files, callback, isAccepted) => {
  const _traverseFileTree = (item, path) => {
    path = path || '';
    if (item.isFile) {
      item.file(file => {
        if (isAccepted(file)) {
          callback([file]);
        }
      });
    } else if (item.isDirectory) {
      const dirReader = item.createReader();

      dirReader.readEntries(entries => {
        for (const entrieItem of entries) {
          _traverseFileTree(entrieItem, `${path}${item.name}/`);
        }
      });
    }
  };
  for (const file of files) {
    _traverseFileTree(file.webkitGetAsEntry());
  }
};

export default traverseFileTree;
