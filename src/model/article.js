/* eslint-disable */
import { post, get, put, _delete } from '@/lin/plugin/axios'

// 我们通过 class 这样的语法糖使模型这个概念更加具象化，其优点：耦合性低、可维护性。
class Article {
  // constructor() {}

  // 类中的方法可以代表一个用户行为
  // 类中的方法可以代表一个用户行为
  async addArticle(info) {
    const res = await post('post/add/', info, {
      handleError: true,
    })
    return res
  }

  // 在这里通过 async await 语法糖让代码同步执行
  // 1. await 一定要搭配 async 来使用
  // 2. await 后面跟的是一个 Promise 对象
  async getArticle(id) {
    const res = await get(`post/${id}/`)
    return res
  }

  async editArticle(id, data) {
    const res = await put(`post/edit/${id}/`, data)
    return res
  }

  async delectArticle(id) {
    const res = await _delete(`post/${id}/`)
    return res
  }

  async getArticles(params) {
    const res = await get('post/list/', params)
    return res
  }
}

export default new Article()
