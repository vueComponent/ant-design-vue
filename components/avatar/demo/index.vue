<script>
import Basic from './basic'
import Badge from './badge'
import Type from './type'
import Dynamic from './dynamic'
import CN from '../index.zh-CN.md'
import US from '../index.en-US.md'

const md = {
  cn: `# Avatar头像
          用来代表用户或事物，支持图片、图标或字符展示。
          ## 代码演示`,
  us: `# Avatar
          Avatars can be used to represent people or objects. It supports images, 'Icon's, or letters.
          `,
}

const UserList = ['U', 'Lucy', 'Tom', 'Edward']
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']
export default {
  data () {
    return {
      avatarValue: UserList[0],
      color: colorList[0],
    }
  },
  methods: {
    changeValue () {
      const index = UserList.indexOf(this.avatarValue)
      this.avatarValue = index < UserList.length - 1 ? UserList[index + 1] : UserList[0]
      this.color = index < colorList.length - 1 ? colorList[index + 1] : colorList[0]
    },
  },
  render () {
    return (
      <div>
        <md cn={md.cn} us={md.us}/>
        <Basic/>
        <br/>
        <Badge/>
        <br/>
        <Type/>
        <br/>
        <api>
          <template slot='cn'>
            <CN/>
          </template>
          <US/>
        </api>
      </div>
    )
  },
}
</script>
