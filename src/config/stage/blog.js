/* eslint-disable */
const blogRouter = {
  route: null,
  name: null,
  title: '博客管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/blog/',
  order: null,
  inNav: true,
  children: [
    {
      name: null,
      title: '技术频道管理',
      type: 'view',
      name: 'ClassifyList',
      route: '/classify/list',
      filePath: 'view/blog/views/classify/ClassifyList.vue',
      inNav: true,
    },
    {
      name: null,
      title: '分类专栏频道',
      type: 'view',
      name: 'CategoryList',
      route: '/category/list',
      filePath: 'view/blog/views/category/CategoryList.vue',
      inNav: true,
      // permission: ['技术频道'],
    },
    {
      name: null,
      title: '标签管理',
      type: 'view',
      name: 'TagList',
      route: '/tag/list',
      filePath: 'view/blog/views/tag/TagList.vue',
      inNav: true,
      // permission: ['所有标签'],
    },

    {
      name: 'CommentList',
      title: '评论管理',
      type: 'view',
      route: '/comment/list',
      filePath: 'view/blog/views/comment/CommentList.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
      // permission: ['评论列表'],
    },
  ],
}

export default blogRouter
