<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="header-left">
          <div class="title">标签管理</div>
        </div>
        <div class="header-right">
          <el-input
            size="medium"
            style="margin-right: 30px;"
            v-model="pagination.tag_name"
            placeholder="标签名"
          ></el-input>
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="
              () => {
                this.showEdit = true
                this.id = 0
              }
            "
            >新增标签</el-button
          >
          <el-button type="default" icon="el-icon-search" @click="refresh">刷新</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <lin-table
        :tableColumn="tableColumn"
        :tableData="tableData"
        :operate="operate"
        :operateWidth="230"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        v-loading="loading"
        :pagination="pagination"
        :current-page="pagination.currentPage"
        @currentChange="handleCurrentChange"
      >
        <template v-slot:status="scope">
          <el-tag size="small" v-if="scope.row.status == true" type="success">启用</el-tag>
          <el-tag size="small" v-else type="danger">禁用</el-tag>
        </template>
        <template v-slot:thumbnail="scope">
          <div class="thumb" :style="'background-image: url(' + scope.row.thumbnail + ');'"></div>
        </template>
      </lin-table>
      <!--表格结束-->
    </div>
    <tag-form v-else :id="id" ref="tagForm" @editClose="editClose"></tag-form>
  </div>
</template>

<script>
// import Vue from 'vue'
import tagApi from '../../models/tag'
import LinTable from '@/component/base/table/lin-table'
import TagForm from './TagForm'

export default {
  name: 'TagList',
  components: { LinTable, TagForm },
  inject: ['eventBus'],
  data() {
    return {
      id: 0,
      showEdit: false,
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      loading: false,
      pagination: {
        pageSize: 10,
        pageTotal: 0,
        currentPage: 1, // 默认获取第一页的数据
      },
    }
  },
  methods: {
    async getTags() {
      const currentPage = this.pagination.currentPage - 1
      this.loading = true
      const res = await tagApi
        .getTags({
          count: this.pagination.pageSize,
          page: currentPage,
          tag_name: this.pagination.tag_name,
        })
        .finally(() => {
          this.loading = false
        })
      this.tableData = [...res.items]
      this.pagination.pageTotal = res.total
    },
    async handleEdit(val) {
      this.showEdit = true
      this.id = val.row.id
    },
    async handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.loading = true
      await this.getTags()
      this.loading = false
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该标签项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await tagApi.deleteTag(val.row.id)
        } catch (e) {
          this.loading = false
        }
        if (res.error_code === 200) {
          this.loading = false
          await this.getTags()
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
    async refresh() {
      await this.getTags()
    },
    // 下拉框选择分组
    async handleChange() {
      this.currentPage = 1
      this.loading = true
      await this.getTags()
      this.loading = false
    },
    async editClose() {
      this.showEdit = false
      await this.getTags()
    },
    // async handleCorrect(val) {
    //   await tagApi.correctTagCount(val.row.id)
    //   await this.getTags()
    // },
  },
  async created() {
    this.tableColumn = [
      { prop: 'tag_name', label: '名称', width: '200' },
      { prop: 'article_count', label: '文章数量', width: '100' },
      {
        prop: 'status',
        label: '状态',
        scopedSlots: { customRender: 'status' },
      },
      {
        prop: 'thumbnail',
        label: '封面',
        scopedSlots: { customRender: 'thumbnail' },
      },
      {
        prop: 'pub_time',
        label: '创建时间',
        scope: 'pub_time',
        // customRender(row, column) {
        //   return Vue.filter('filterTimeYmdHms')(column)
        // },
      },
    ]
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary', auth: '编辑标签' },
      { name: '删除', func: 'handleDelete', type: 'danger', auth: '删除标签' },
    ]
    await this.getTags()
  },
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
      float: left;

      .title {
        height: 59px;
        line-height: 59px;
        color: $parent-title-color;
        font-size: 16px;
        font-weight: 500;

        .back {
          float: right;
          margin-right: 40px;
          cursor: pointer;
        }
      }
    }

    .header-right {
      float: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .wrap {
    padding: 20px;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }

  .submit {
    float: left;
  }

  .thumb {
    background-size: contain;
    width: 100%;
    height: 32px;
    background-repeat: no-repeat;
  }
}
</style>
