<template>
  <a-upload
    :action="action"
    :list-type="listType"
    :file-list="defaultFileList"
    @selectPreview="handleSelect"
    @change="handleChange"
    :itemRender="itemRender"
  />
</template>
<script>
import Icon from '../components/icon';
export default {
  data() {
    return {
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      listType: 'picture-card',
      dirName: '',
      select: '0',
      defaultFileList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-2',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-3',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-4',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-5',
          name: 'image.png',
          status: 'error',
        },
      ],
    };
  },
  methods: {
    itemRender(file) {
      return (
        <div
          onClick={e => this.handleSelect(file, e)}
          style={file.select === 'select' ? 'border-color:#1890ff;' : ''}
        >
          <Icon type="delete" title="随便" onClick={() => this.handleAction(file)} />
          <Icon type="delete" title="随便" onClick={() => this.handleAction(file)} />
        </div>
        // <div
        //   onClick={e => this.handleSelect(file, e)}
        //   style={file.select === 'select' ? 'border-color:#1890ff;' : ''}
        // >
        // </div>
      );
    },
    close() {
      this.visible = false;
    },
    handleCancel() {
      this.visible = false;
    },
    handleSelect(file) {
      if (file.uid && file.status === 'done') {
        this.select = file.uid;
        this.defaultFileList.map(item => {
          if (item.uid === this.select) {
            if (item.select === 'select') {
              this.$set(item, 'select', 'UnSelect');
              this.select = '0';
            } else this.$set(item, 'select', 'select');
          } else {
            item.select === 'select' && this.$set(item, 'select', 'UnSelect');
          }
        });
        // console.log('this.select==>', this.select);
      }
    },
    handleChange(info) {
      this.defaultFileList = info.fileList;
    },
    handleAction(file) {
      console.log('actions works==>', file);
    },
  },
};
</script>
