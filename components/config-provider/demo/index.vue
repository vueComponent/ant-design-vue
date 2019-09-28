<script>
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';

const md = {
  cn: `# ConfigProvider 全局化配置
为组件提供统一的全局化配置。`,
  us: `# ConfigProvider
\`ConfigProvider\` provides a uniform configuration support for components.
`,
};
export default {
  category: 'Components',
  subtitle: '全局化配置',
  cols: 1,
  type: '其他',
  title: 'ConfigProvider',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <api>
          <template slot="cn">
            <CN />
          </template>
          <US />
        </api>
      </div>
    );
  },
};
</script>
