<script>
import Basic from './basic';
import All from './all';
import CN from '../index.zh-CN.md';
import US from '../index.en-US.md';
const md = {
  cn: `## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| locale | 语言包配置，语言包可到 \`antd/lib/locale-provider/\` 目录下寻找 | object | - |
`,
  us: `## API

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| locale | language package setting, you can find the packages in this path: \`antd/lib/locale-provider/\` | object | - |
`,
};
export default {
  category: 'Components',
  subtitle: '国际化',
  cols: 1,
  type: 'Other',
  title: 'LocaleProvider',
  render() {
    return (
      <div>
        <api>
          <CN slot="cn" />
          <US />
        </api>
        <Basic />
        <All />
        <md cn={md.cn} us={md.us} />
      </div>
    );
  },
};
</script>
