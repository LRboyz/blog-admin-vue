<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="header-left">
          <div class="title">分类专栏列表</div>
        </div>

        <div class="header-right">
          <div style="margin-right: 10px;">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="
                () => {
                  this.showEdit = true
                  this.id = 0
                }
              "
              >新增分类</el-button
            >
          </div>
          <el-input
            size="medium"
            style="margin-right: 10px;"
            v-model="pagination.category_name"
            placeholder="分类专栏"
          ></el-input>
          <el-button type="default" icon="el-icon-search" @click="refresh">查询</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        v-loading="loading"
        :pagination="pagination"
        :current-page="pagination.currentPage"
        @currentChange="handleCurrentChange"
      >
        <template v-slot:thumbnail="scope">
          <div class="thumb" :style="'background-image: url(' + scope.row.thumbnail + ');'"></div>
        </template>
      </lin-table>
      <!--表格结束-->
    </div>
    <category-form v-else @editClose="editClose" :id="id"></category-form>
  </div>
</template>

<script>
// import Vue from 'vue'
import categoryApi from '../../models/category'
import LinTable from '@/component/base/table/lin-table'
import CategoryForm from './CategoryForm'

export default {
  name: 'ClassifyList',
  components: { LinTable, CategoryForm },
  inject: ['eventBus'],
  data() {
    return {
      id: 0,
      showEdit: false,
      editIndex: null, // 编辑的行
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      loading: false,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1, // 默认获取第一页的数据
        category_name: '',
      },
    }
  },
  methods: {
    async getCategorys() {
      this.loading = true
      const currentPage = this.pagination.currentPage - 1
      const res = await categoryApi
        .getCategorys({
          count: this.pagination.pageSize,
          page: currentPage,
          category_name: this.pagination.category_name,
        })
        .finally(() => {
          this.loading = false
        })
      // console.log(res.categorys)
      this.tableData = [...res.categorys]
      this.pagination.pageTotal = res.categorys.total
    },
    async handleEdit(val) {
      console.log(val, val.row.id)
      this.showEdit = true
      this.id = val.row.id
    },
    // 切换table页
    async handleCurrentChange(val) {
      console.log(val)
      this.pagination.currentPage = val
      this.loading = true
      await this.getCategorys()
      this.loading = false
    },
    handleDelete(val) {
      console.log(val)
      let res
      this.$confirm('此操作将永久删除该分类专栏项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this.loading = true
        res = await categoryApi.deleteCategory(val.row.id)
        if (res.error_code === 200) {
          this.loading = false
          this.$message({
            type: 'success',
            message: `${res.msg}`,
          })
          await this.getCategorys()
        } else {
          this.loading = false
          this.$message.error(`${res.msg}`)
        }
      })
    },
    refresh() {
      this.getCategorys()
    },
    async editClose() {
      this.showEdit = false
      await this.getCategorys()
    },
  },
  created() {
    this.tableColumn = [
      { prop: 'category_name', label: '分类专栏' },
      {
        prop: 'thumbnail',
        label: '封面图',
        scopedSlots: { customRender: 'thumbnail' },
      },
      {
        prop: 'pub_time',
        label: '创建时间',
        scope: 'create_time',
        // customRender(row, column) {
        //   return Vue.filter('filterTimeYmdHms')(column)
        // },
      },
    ]
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'success', auth: '编辑标签' },
      { name: '删除', func: 'handleDelete', type: 'danger', auth: '删除标签' },
    ]
    this.getCategorys()
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/list.scss';
</style>
