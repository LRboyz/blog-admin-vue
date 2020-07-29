/* eslint-disable */
const articleRouter = {
  route: null,
  name: null,
  title: '文章管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/book/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '添加文章',
      type: 'view',
      name: 'ArticleAdd',
      route: '/article/create',
      filePath: 'view/article/articleForm.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '编辑文章',
      type: 'view',
      name: 'ArticleEdit',
      route: '/article/edit/:id',
      filePath: 'view/article/articleForm.vue',
      inNav: false,
      props: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '文章列表',
      type: 'view',
      name: 'ArticleAdd',
      route: '/article/list',
      filePath: 'view/article/articleList.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default articleRouter
