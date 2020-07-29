// eslint-disable-next-line object-curly-newline
import {
  post,
  get,
  put,
  _delete,
  // eslint-disable-next-line object-curly-newline
} from '@/lin/plugin/axios'

export default class Admin {
  constructor(uPage = 0, uCount = 10, gPage = 0, gCount = 5) {
    this.uPage = uPage
    this.uCount = uCount
    this.lPage = gPage
    this.gCount = gCount
  }

  async increseUpage() {
    this.uPage += 1
  }

  async increseGpage() {
    this.lPage += 1
  }

  async decreseUpage() {
    this.uPage -= 1
    if (this.uPage < 0) {
      this.uPage = 0
    }
  }

  async decreseGpage() {
    this.lPage -= 1
    if (this.lPage < 0) {
      this.lPage = 0
    }
  }

  static getAllPermissions() {
    return get('admin/authority')
  }

  static async getAdminUsers({ count = this.uCount, page = this.uPag }, role) {
    const res = await get('admin/users', {
      count,
      page,
      role,
    })
    return res
  }

  async nextUsersPage() {
    await this.increseUpage()
    return this.getAdminUsers({})
  }

  async preUsersPage() {
    await this.decreseUpage()
    return this.getAdminUsers({})
  }

  // async getGroupsWithAuths({
  //   count = this.uCount,
  //   page = this.uPag
  // }) {
  //   const res = await get('cms/admin/groups', {
  //     count,
  //     page,
  //   })
  //   return res
  // }

  // async nextGroupsPage() {
  //   await this.increseGpage()
  //   return this.getGroupsWithAuths({})
  // }

  // async preGroupsPage() {
  //   await this.decreseGpage()
  //   return this.getGroupsWithAuths({})
  // }

  // static async getAllGroups() {
  //   const groups = await get('admin/group/all') // cms/admin/group/all
  //   return groups
  // }

  // static async getOneGroup(id) {
  //   const group = await get(`cms/admin/group/${id}`)
  //   return group
  // }

  // static async createOneGroup(name, info, auths) {
  //   const res = await post('admin/group', {
  //     name,
  //     info,
  //     auths,
  //   })
  //   return res
  // }

  // static async updateOneGroup(name, info, id) {
  //   const res = await put(`cms/admin/group/${id}`, {
  //     name,
  //     info,
  //   })
  //   return res
  // }

  // static async deleteOneGroup(id) {
  //   const res = await _delete(`cms/admin/group/${id}`)
  //   return res
  // }

  static async deleteOneUser(uid) {
    const res = await _delete(`/admin/${uid}`)
    return res
  }

  static async updateOneUser(email, role, uid) {
    const res = await put(`/admin/${uid}`, {
      email,
      role,
      uid,
    })
    return res
  }

  static async dispatchAuths(auths) {
    const res = await post('cms/admin/dispatch/patch', {
      auths,
    })
    return res
  }

  static async changePassword(new_password, confirm_password, id) {
    const res = await put(`/admin/password/${id}`, {
      new_password,
      confirm_password,
    })
    return res
  }

  static async removeAuths(auths) {
    const res = await post('cms/admin/remove', {
      auths,
    })
    return res
  }
  // eslint-disable-next-line eol-last
}
