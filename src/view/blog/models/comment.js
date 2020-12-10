/* eslint-disable */
import { post, get, put, _delete } from '@/lin/plugin/axios'

class commentApi {
  async getCommentList (params) {
    const result = await get('/cms/comment/list', params)
    return result
  }
  async editComment (params) {
    const result = await put(`/cms/comment/${params._id}`, {
      _id: params._id,
      text: params.text,
      status: params.status
    })
    return result
  }
}

export default new commentApi()
