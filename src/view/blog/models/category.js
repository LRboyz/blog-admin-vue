/* eslint-disable */
import { post, get, put, _delete } from '@/lin/plugin/axios'

class category {
  async addCategory(params) {
    const res = await post('category/add/', params)
    return res
  }

  async getCategory(id) {
    const res = await get(`category/${id}/`)
    return res
  }

  async editCategory(id, data) {
    const res = await put(`category/edit/${id}/`, data)
    return res
  }

  async deleteCategory(id) {
    const res = await _delete(`category/${id}/`)
    return res
  }

  async getCategorys(params) {
    const res = await get('category/list/', params)
    return res
  }
}

export default new category()
