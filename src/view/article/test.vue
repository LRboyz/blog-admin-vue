<template>
  <div>
    <sticky-top>
      <div class="title">
        <span>{{ title[this.id == 0 ? 0 : 1] }}</span>
        <span class="back" @click="back">
          <i class="iconfont icon-fanhui"></i> 返回
        </span>
      </div>
    </sticky-top>
    <div class="container">
      <div class="wrap">
        <el-row>
          <el-col :lg="24" :md="24" :sm="24" :xs="24">
            <el-form
              :model="form"
              status-icon
              ref="form"
              label-width="100px"
              @submit.native.prevent
            >
              <el-row>
                <el-col :lg="12">
                  <el-form-item label="标题" prop="title">
                    <el-input size="medium" v-model="form.title"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :lg="12">
                  <el-form-item label prop="title">
                    <!-- v-if="form.id != null" -->
                    <el-link
                      type="primary"
                      :href="`${USER_URL}#post/${form.id}`"
                      target="_blank"
                    >查看文章</el-link>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="6">
                  <el-form-item label="分类专栏" prop="classify_id">
                    <span>{{ form.classify_name }}</span>
                  </el-form-item>
                </el-col>
                <el-col :lg="6">
                  <el-form-item label="文章类型" prop="excerpt">
                    <el-select v-model="form.article_type" filterable default-first-option>
                      <el-option
                        v-for="item in article_types"
                        :key="Number(item.item_code)"
                        :label="item.item_name"
                        :value="Number(item.item_code)"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label="标签" prop="source">
                    <el-select
                      style="width:100%;"
                      v-model="form.tag_ids"
                      multiple
                      filterable
                      :loading="loading"
                      default-first-option
                    >
                      <el-option
                        v-for="item in form.tags"
                        :key="item.id"
                        :label="item.tag_name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="12">
                  <el-form-item label="关键字" prop="keywords">
                    <el-input size="medium" v-model="form.keywords" placeholder="请填写关键字"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label="来源" prop="source">
                    <el-input size="medium" v-model="form.source" placeholder="请填写来源"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="12">
                  <el-form-item label="封面">
                    <upload-imgs
                      ref="thumbnail"
                      :multiple="false"
                      :value="thumbnailPreview"
                      :max-num="1"
                    />
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label="摘要" prop="excerpt">
                    <el-input
                      size="medium"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 8 }"
                      placeholder="请输入摘要"
                      v-model="form.excerpt"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="24">
                  <div class="mavon-editor">
                    <mavonEditor
                      ref="md"
                      @change="change"
                      @imgAdd="imgAdd"
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
// import baseApi from '@/plugin/base/model/base'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import UploadImgs from '@/component/base/upload-image'
import articleApi from '../../model/article'
// import classifyApi from '../../model/classify'
import tagApi from '../blog/models/tag'
export default {
  name: 'ArticleForm',
  data () {
    return {
      title: ['添加文章', '审核文章'],
      form: {
        is_audit: false,
        classify_name: '',
        tags: [],
      },
      thumbnailPreview: [],
      classifys: [],
      article_types: [],
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
  async mounted () {
    console.log('begin mounted')
    await this.setForm()
    console.log('end mounted')
  },
  async created () {
    console.log('begin created')
    this.classifys = await classifyApi.getClassifies()
    this.article_types = await baseApi.getItems({
      typeCode: 'Article.Type',
    })
    console.log('end created')
  },
  methods: {
    async setForm () {
      if (this.id) {
        let res = await articleApi.getArticle(this.id)
        if (res.classify != null) {
          res.classify_name = res.classify.classify_name
        }
        this.form = res
        this.thumbnailPreview.length = 0
        if (res.thumbnail) {
          this.thumbnailPreview.push({
            id: res.id,
            display: res.thumbnail_display,
            src: res.thumbnail,
            imgId: res.id,
          })
        }
      }
    },
    async confirmEdit (formName) {
      const res = await articleApi.auditArticle(this.id, this.form.is_audit)
      if (res.code === 0) {
        this.$message.success(`${res.message}`)
        this.$emit('editClose')
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.form.content = ''
      this.$refs['thumbnail'].clear()
    },
    back () {
      this.$emit('editClose')
    },
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
