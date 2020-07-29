<template>
  <div>
    <sticky-top>
      <div class="title">
        <span>{{ title[this.id ? 0 : 1] }}</span>
        <span v-if="this.id" class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
      </div>
    </sticky-top>
    <div class="container">
      <div class="wrap">
        <el-row>
          <el-col :lg="24" :md="24" :sm="24" :xs="24">
            <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
              <el-row>
                <el-col :lg="12">
                  <el-form-item label="标题">
                    <el-input size="medium" v-model="form.title"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :lg="12">
                  <el-form-item label>
                    <!-- v-if="form.id != null" -->
                    <el-link type="primary" :href="`${USER_URL}#post/${form.id}`" target="_blank">查看文章</el-link>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="6">
                  <el-form-item label="分类专栏">
                    <el-select v-model="form.category" filterable default-first-option>
                      <el-option
                        v-for="item in categories"
                        :key="item.id"
                        :label="item.category_name"
                        :value="item.category_name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :lg="6">
                  <el-form-item label="文章类型">
                    <el-select v-model="form.post_type" filterable default-first-option>
                      <el-option
                        v-for="item in article_types"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :lg="6">
                  <el-form-item label="标签" prop="source">
                    <el-select
                      style="width:100%;"
                      v-model="form.tags"
                      multiple
                      allow-create
                      filterable
                      :loading="loading"
                      default-first-option
                    >
                      <el-option
                        v-for="item in tags"
                        :key="item.id"
                        :label="item.tag_name"
                        :value="item.tag_name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="12">
                  <el-form-item label="关键字">
                    <el-input size="medium" v-model="form.keyword" placeholder="请填写关键字"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label="来源">
                    <el-input size="medium" v-model="form.source" placeholder="请填写来源"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="6">
                  <el-form-item label="封面">
                    <upload-imgs ref="thumbnail" :multiple="false" :value="thumbnailPreview" :max-num="1" />
                  </el-form-item>
                </el-col>
                <el-col :lg="6">
                  <el-form-item label="是否推荐">
                    <el-switch v-model="form.recommend" active-color="#3963bc"></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label="摘要">
                    <el-input
                      size="medium"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 8 }"
                      placeholder="请输入摘要"
                      v-model="form.introduction"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="24">
                  <div class="mavon-editor">
                    <!--                       @change="change"
                    @imgAdd="imgAdd"-->
                    <mavonEditor
                      ref="md"
                      v-model="form.content"
                      :ishljs="true"
                      codeStyle="atom-one-dark"
                      class="editor"
                    />
                    <!-- <mavon-editor
                      v-model="form.content"
                      id="mavon-editor"
                      ref="mavon"
                      :toolbarsFlag="false"
                      :editable="false"
                      :readModel="true"
                      defaultOpen="preview"
                      :subfield="false"
                      :boxShadow="false"
                      previewBackground="#fff"
                      :navigation="false"
                    />-->
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="12">
                  <el-form-item label="状态" prop="is_audit">
                    <el-radio v-model="form.is_audit" :label="true">审核通过</el-radio>
                    <el-radio v-model="form.is_audit" :label="false">拉黑</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :lg="12"></el-col>
              </el-row>
              <el-form-item class="submit">
                <el-button type="primary" @click="confirmEdit('form')">保 存</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import UploadImgs from '@/component/base/upload-image'
import articleApi from '../../model/article'
import categoryApi from '../blog/models/category'
import tagApi from '../blog/models/tag'

export default {
  name: 'ArticleForm',
  data() {
    return {
      title: ['编辑文章', '添加文章'],
      form: {
        is_audit: true,
      },
      thumbnailPreview: [],
      categories: [],
      tags: [],
      article_types: [
        {
          label: '原创',
          value: 0,
        },
        {
          label: '转载',
          value: 1,
        },
      ],
      loading: false,
      USER_URL: process.env.VUE_APP_USER_URL,
    }
  },
  props: {
    id: {
      type: String,
    },
  },
  components: {
    mavonEditor,
    UploadImgs,
  },
  async mounted() {
    // console.log(this.id)
    console.log(this.user)
    await this.setForm()
  },
  methods: {
    async setForm() {
      // if (this.id) {
      const cat = await categoryApi.getCategorys()
      const tag = await tagApi.getTags()
      this.categories = cat.categorys
      this.tags = tag.items
      if (this.id) {
        const res = await articleApi.getArticle(this.id)
        this.form = res.article
      }
    },
    async confirmEdit() {
      // 获取图片信息赋值给Form
      const thumbnail = await this.$refs.thumbnail.getValue()
      if (thumbnail.length > 0) {
        this.form.banner = thumbnail[0].display
      } else {
        this.form.thumbnail = ''
      }
      if (this.id) {
        this.form.author_id = this.user.user_id
        console.log(this.form)
        const res = await articleApi.editArticle(this.id, this.form)
        if (res.error_code === 200) {
          this.$message.success(`${res.msg}`)
          this.$emit('editClose')
        }
      } else {
        this.form.author_id = this.user.user_id
        const res = await articleApi.addArticle(this.form)
        if (res.error_code === 200) {
          this.$message.success(`${res.msg}`)
          this.$emit('editClose')
        }
      }
      // const res = await articleApi.addArticle(this.form)
      // if (res.error_code === 200) {
      //   this.$message.success(`${res.msg}`)
      //   this.$emit('editClose')
      // }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form.content = ''
      this.$refs.thumbnail.clear()
    },
    back() {
      this.$emit('editClose')
    },
  },
  computed: {
    ...mapGetters(['user']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/form.scss';
.mavon-editor /deep/ .v-note-wrapper {
  margin: 10px 30px;
  height: 600px;
  z-index: 8;
}
</style>
