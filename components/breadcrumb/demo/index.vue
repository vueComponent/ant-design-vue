<script>
import Basic from './basic.md';
import WithIcon from './withIcon.md';
import Separator from './separator.md';
import Router from './router';

import US from './../index.en-US.md';
import CN from './../index.zh-CN.md';

const md = {
  cn: `# Breadcrumb面包屑
           显示当前页面在系统层级结构中的位置，并能向上返回。
         ## 何时使用
         - 当系统拥有超过两级以上的层级结构时；
         - 当需要告知用户『你在哪里』时；
         -  当需要向上导航的功能时。
         ## 代码演示
        `,
  us: `# Breadcrumb
         A breadcrumb displays the current location within a hierarchy. It allows going back to states higher up in the hierarchy.
         ## When to use
         - When the system has more than two layers in a hierarchy.
         - When you need to inform the user of where they are.
         - When the user may need to navigate back to a higher level.
         - When the application has multi-layer architecture.
         ## Examples
        `,
};

export default {
  category: 'Components',
  subtitle: '面包屑',
  type: 'Navigation',
  zhType: '导航',
  title: 'Breadcrumb',
  render() {
    return (
      <div>
        <md cn={md.cn} us={md.us} />
        <Basic />
        <WithIcon />
        <Separator />
        <Router />
        <api>
          <CN slot="cn" />
          <US />
        </api>
      </div>
    );
  },
};
</script>
