<template>
  <div>
    <sticky-top>
      <div class="title">
        <span>{{ title[this.id == 0 ? 0 : 1] }}</span>
        <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
      </div>
    </sticky-top>
    <div class="container">
      <div class="wrap">
        <el-row>
          <el-col :lg="16" :md="20" :sm="24" :xs="24">
            <el-form
              status-icon
              ref="form"
              label-width="120px"
              :model="form"
              label-position="labelPosition"
              :rules="rules"
              style="margin-left:-35px;margin-bottom:-35px;margin-top:15px;"
            >
              <el-form-item label="专栏名称" prop="category_name">
                <el-input size="medium" clearable v-model="form.category_name"></el-input>
              </el-form-item>
              <el-form-item label="封面" prop="thumbnail">
                <upload-imgs ref="thumbnail" :multiple="false" :value="thumbnailPreview" :max-num="1" />
              </el-form-item>
              <el-form-item class="submit">
                <el-button type="primary" @click="confirmEdit('form')">保 存</el-button>
                <el-button @click="resetForm('form')">重 置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import categoryApi from '../../models/category'
import UploadImgs from '@/component/base/upload-image'

export default {
  name: 'categoryForm',
  components: { UploadImgs },
  props: {
    id: {
      type: [String, Number],
    },
  },
  data() {
    return {
      title: ['新增分类专栏', '编辑分类专栏'],
      loading: false,
      form: {
        category_name: '',
        thumbnail: '',
      },
      thumbnailPreview: [],
      rules: {
        category_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        thumbnail: [{ required: true, message: '请上传封面', trigger: 'blur' }],
      },
    }
  },
  async mounted() {
    console.log(this.id)
    this.show(this.id)
  },
  methods: {
    async show(id) {
      console.log(id)
      if (id !== 0) {
        const category = await categoryApi.getCategory(id)
        console.log(category.cat)
        this.form = category
        this.thumbnailPreview.length = 0
        if (category.thumbnail) {
          this.thumbnailPreview.push({
            id: category.id,
            display: category.thumbnail,
            src: category.thumbnail,
            imgId: category.id,
          })
        }
      } else {
        Object.assign(this.form, {
          category_name: '',
        })
      }
    },
    async submitForm() {
      if (this.id === 0) {
        // eslint-disable-next-line no-return-await
        return await categoryApi.addCategory(this.form)
        // eslint-disable-next-line no-else-return
      } else {
        // eslint-disable-next-line no-return-await
        const res = await categoryApi.editCategory(this.id, this.form)
        console.log(res)
        return res
      }
    },
    async confirmEdit(formName) {
      // eslint-disable-next-line dot-notation
      const thumbnail = await this.$refs['thumbnail'].getValue()
      // console.log(thumbnail)
      if (thumbnail.length > 0) {
        this.form.thumbnail = thumbnail[0].display
      } else {
        this.form.thumbnail = ''
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res
          this.loading = true
          // eslint-disable-next-line prefer-const
          res = await this.submitForm().finally(() => {
            this.loading = false
          })
          this.$message.success(`${res.msg}`)
          this.$emit('editClose')
        } else {
          this.$message.error('请填写正确的信息')
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    back() {
      this.$emit('editClose')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/form.scss';
</style>
