<template>
  <div class="container">
    <div class="header">
      <div class="title">用户列表</div>
      <!-- 分组选择下拉框 -->
      <el-select size="medium" filterable v-model="group" placeholder="请选择分组" @change="handleChange" clearable>
        <el-option v-for="(r, i) in role" :key="i" :label="r" :value="i" />
      </el-select>
    </div>
    <div v-if="userList.length > 0" class="user-list">
      <div v-for="item in userList" :key="item.id" class="user-item">
        <el-card>
          <div slot="header" class="clearfix">
            <span>{{ item.username }}</span>
          </div>
          <img :src="item.avatar" alt class="avatar" />
          <div class="user-info">
            <p>
              用户名：
              <span>{{ item.username }}</span>
            </p>
            <p>
              电子邮箱：
              <span v-if="item.email">{{ item.email }}</span>
              <span v-else>-</span>
            </p>
            <p>
              注册时间：
              <span>{{ item.create_time }}</span>
            </p>
            <p>
              用户角色：
              <span>{{ role[item.role] }}</span>
            </p>
            <p>
              用户IP：
              <span v-if="item.ip">{{ item.ip }}</span>
              <span v-else>-</span>
            </p>
            <p>
              操作：
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                plain
                round
                @click="handleEdit(item)"
                v-permission="{ permission: '编辑用户', type: 'disabled' }"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                plain
                round
                @click="handleDelete(item)"
                v-permission="{ permission: '删除用户', type: 'disabled' }"
                >删除</el-button
              >
            </p>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 表格 -->
    <!-- <lin-table
      :tableColumn="tableColumn"
      :tableData="tableData"
      :operate="operate"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @row-click="rowClick"
      v-loading="loading"
    >
      <template v-slot:avatar="scope">
        <img style="width:50px;height:50px;" :src="scope.row.avatar" />
      </template>
    </lin-table>-->
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :background="true"
        :page-size="pageCount"
        :current-page="currentPage"
        v-if="refreshPagination"
        layout="prev, pager, next, jumper"
        :total="total_nums"
      ></el-pagination>
    </div>
    <!-- 弹窗 -->
    <el-dialog :append-to-body="true" :before-close="handleClose" :visible.sync="dialogFormVisible">
      <div style="margin-top:-25px;">
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane label="修改信息" name="修改信息">
            <user-info
              ref="userInfo"
              v-if="dialogFormVisible"
              @handleInfoResult="handleInfoResult"
              labelPosition="right"
              pageType="edit"
              :id="id"
              :info="form"
              :submit="false"
              class="info"
            />
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="修改密码">
            <user-password @handlePasswordResult="handlePasswordResult" ref="password" :id="id" class="password" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 按键操作 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
        <el-button @click="resetForm">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Admin from '@/lin/model/admin'
// import LinTable from '@/component/base/table/lin-table'
import UserInfo from './user-info'
import UserPassword from './user-password'

export default {
  components: { UserInfo, UserPassword }, // LinTable,
  inject: ['eventBus'],
  data() {
    return {
      id: 0, // 用户id
      // is_admin: '',
      group: '',
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      editIndex: null, // 编辑的行
      total_nums: 0, // 分组内的用户总数
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 8, // 每页10条数据
      userList: [], // 用户列表信息
      // tableData: [], // 表格数据
      // tableColumn: [], // 表头数据
      // operate: [], // 表格按键操作区
      dialogFormVisible: false, // 控制弹窗显示
      activeTab: '修改信息',
      form: {
        // 表单信息
        username: '',
        password: '',
        role: '',
        confirm_password: '',
        email: '',
      },
      loading: false,
    }
  },
  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getAdminUsers(role) {
      let res
      const currentPage = this.currentPage - 1
      try {
        this.loading = true
        res = await Admin.getAdminUsers({ count: this.pageCount, page: currentPage }, role) // eslint-disable-line
        this.loading = false
        this.userList = [...res.items]
        // this.tableData = [...res.items]
        this.total_nums = res.total
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 获取所拥有的权限并渲染  由子组件提供
    async handleEdit(val) {
      // console.log(val)
      // this.editIndex = val.index
      // let selectedData
      // // 单击 编辑按键
      // if (val.index >= 0) {
      //   selectedData = val.row
      // } else {
      //   // 单击 table row
      //   selectedData = val
      // }
      this.id = val.user_id
      // this.is_admin = selectedData.admin
      this.form.username = val.username
      this.form.email = val.email
      this.form.role = val.role
      this.dialogFormVisible = true
      // console.log(this.id)
    },
    // 下拉框选择分组
    async handleChange(role) {
      console.log(role)
      this.currentPage = 1
      this.loading = true
      await this.getAdminUsers(role)
      this.loading = false
    },
    // 切换table页
    async handleCurrentChange(val) {
      console.log(val)
      this.currentPage = val
      this.loading = true
      await this.getAdminUsers()
      this.loading = false
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await Admin.deleteOneUser(val.user_id)
        } catch (e) {
          this.loading = false
          console.log(e)
        }
        if (res.error_code === 200) {
          this.loading = false
          if (this.total_nums % this.pageCount === 1 && this.currentPage !== 1) {
            // 判断删除的是不是每一页的最后一条数据
            this.currentPage--
          }
          await this.getAdminUsers()
          this.$message({
            type: 'success',
            message: `${res.msg}`,
          })
        } else {
          this.loading = false
          this.$message.error(`${res.msg}`)
        }
      })
    },
    // 提交表单信息
    async confirmEdit() {
      if (this.activeTab === '修改信息') {
        await this.$refs.userInfo.submitForm('form')
      } else {
        await this.$refs.password.submitForm('form')
      }
    },
    // 重置
    resetForm() {
      if (this.activeTab === '修改信息') {
        this.$refs.userInfo.resetForm('form')
      } else {
        this.$refs.password.resetForm('form')
      }
    },
    // 双击 table ro
    rowClick(row) {
      this.handleEdit(row)
    },
    // 弹框 右上角 X
    handleClose(done) {
      this.dialogFormVisible = false
      done()
    },
    // 切换tab栏
    handleClick(tab) {
      console.log(tab)
      this.activeTab = tab.name
    },
    // 监听子组件更新用户信息是否成功
    async handleInfoResult(flag) {
      this.dialogFormVisible = false
      if (flag === true) {
        this.getAdminUsers()
      }
    },
    // 监听子组件更新密码是否成功
    handlePasswordResult(result) {
      if (result === true) {
        this.dialogFormVisible = false
      }
    },
    // 监听添加用户是否成功
    async addUser(flag) {
      if (flag === true) {
        if (this.total_nums % this.pageCount === 0) {
          // 判断当前页的数据是不是满了，需要增加新的页码
          this.currentPage++
        }
        await this.getAdminUsers()
        this.refreshPagination = false // 刷新pagination组件
        this.$nextTick(() => {
          this.refreshPagination = true
        })
      }
    },
  },
  computed: {
    ...mapGetters(['role']),
  },
  async created() {
    await this.getAdminUsers()
    // this.getAllGroups()
    // this.tableColumn = [
    //   { prop: 'username', label: '用户名' },
    //   { prop: 'nickname', label: '昵称' },
    //   { prop: 'email', label: '邮箱' },
    //   { prop: 'avatar', label: '用户头像', scopedSlots: { customRender: 'avatar' } },
    //   { prop: 'create_time', label: '创建时间' },
    // ] // 设置表头信息
    // this.operate = [
    //   { name: '编辑', func: 'handleEdit', type: 'primary' },
    //   { name: '删除', func: 'handleDelete', type: 'danger' },
    // ]
    this.eventBus.$on('addUser', this.addUser)
  },
  beforeDestroy() {
    this.eventBus.$off('addUser', this.addUser)
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }
  .user-list {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-evenly;
    .user-item {
      margin: 20px 20px 0 0;
      flex-basis: 23%;
      .avatar {
        display: block;
        margin: 0 auto;
        width: 60px;
        height: 60px;
      }
      .user-info p {
        color: #3963bc;
        cursor: pointer;
        margin-top: 10px;
        font-size: 14px;
        line-height: 30px;
        span {
          color: teal;
        }
      }
      .user-info p:hover {
        color: #6183c9;
      }
    }
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
.info {
  margin-left: -55px;
  // margin-bottom: -30px;
}
.password {
  margin-top: 20px;
  margin-left: -55px;
  margin-bottom: -20px;
}
</style>
