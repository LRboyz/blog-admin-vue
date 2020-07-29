/* eslint-disable */
import { post, get, put, _delete } from '@/lin/plugin/axios'

class Tag {
  async addTag(params) {
    const res = await post('tag/add/', params, {
      handleError: true,
    })
    return res
  }

  async getTag(id) {
    const res = await get(`tag/${id}/`)
    return res
  }

  async editTag(id, data) {
    const res = await put(`tag/edit/${id}/`, data)
    return res
  }

  async correctTagCount(id) {
    const res = await put(`tag/correct/${id}/`)
    return res
  }

  async deleteTag(id) {
    const res = await _delete(`tag/${id}/`)
    return res
  }

  async getTags(params) {
    const res = await get('tag/list/', params)
    return res
  }
}

export default new Tag()
