<template>
  <div>
    <template v-for="(tag, index) in tags">
      <Tooltip v-if="tag.length > 20" :key="tag" :title="tag">
        <Tag :key="tag" :closable="index !== 0" @after-close="() => handleClose(tag)">
          {{`${tag.slice(0, 20)}...`}}
        </Tag>
      </Tooltip>
      <Tag v-else :key="tag" :closable="index !== 0" @after-close="() => handleClose(tag)">
        {{tag}}
      </Tag>
    </template>
    <Input
      v-if="inputVisible"
      ref="input"
      type="text"
      size="small"
      :style="{ width: 78 }"
      :value="inputValue"
      @change="handleInputChange"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
    />
    <Tag v-else @click="showInput" style="background: #fff; borderStyle: dashed;">
      <Icon type="plus" /> New Tag
    </Tag>
  </div>
</template>
<script>
import { Tag, Tooltip, Icon } from 'antd'
export default {
  data () {
    return {
      tags: ['Unremovable', 'Tag 2', 'Tag 3Tag 3Tag 3Tag 3Tag 3Tag 3Tag 3'],
      inputVisible: false,
      inputValue: '',
    }
  },
  methods: {
    handleClose (removedTag) {
      const tags = this.tags.filter(tag => tag !== removedTag)
      console.log(tags)
      this.tags = tags
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(function () {
        this.$refs.input.focus()
      })
    },

    handleInputChange (e) {
      this.inputValue = e.target.value
    },

    handleInputConfirm () {
      const inputValue = this.inputValue
      let tags = this.tags
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue]
      }
      console.log(tags)
      Object.assign(this, {
        tags,
        inputVisible: false,
        inputValue: '',
      })
    },
  },
  components: {
    Tag,
    Tooltip,
    Icon,
  },
}
</script>
