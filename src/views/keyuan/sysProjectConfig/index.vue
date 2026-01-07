<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">配置键</label>
        <el-input v-model="query.configKey" clearable placeholder="配置键" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="配置键" prop="configKey">
            <el-input v-model="form.configKey" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="配置值" prop="configValue">
            <el-input v-model="form.configValue" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="configKey" label="配置键" />
        <el-table-column prop="configValue" label="配置值" :show-overflow-tooltip="true">
          <template #default="{ row }">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="flex: 1; overflow: hidden; text-overflow: ellipsis;">{{ row.configValue }}</span>
              <el-button
                size="mini"
                icon="el-icon-copy-document"
                circle
                style="margin-left: 8px;"
                @click="copyText(row.configValue)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="修改时间" />
        <el-table-column v-if="checkPer(['admin','sysProjectConfig:edit','sysProjectConfig:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudSysProjectConfig from '@/api/keyuan/sysProjectConfig'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, configKey: null, configValue: null, description: null, createTime: null, updateTime: null }
export default {
  name: 'SysProjectConfig',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '项目收支信息', url: 'api/sysProjectConfig', idField: 'id', sort: 'id,desc', crudMethod: { ...crudSysProjectConfig }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'sysProjectConfig:add'],
        edit: ['admin', 'sysProjectConfig:edit'],
        del: ['admin', 'sysProjectConfig:del']
      },
      rules: {
        configKey: [
          { required: true, message: '配置键不能为空', trigger: 'blur' }
        ],
        configValue: [
          { required: true, message: '配置值不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'configKey', display_name: '配置键' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    copyText(text) {
      navigator.clipboard.writeText(text).then(() =>
        this.$message.success('复制成功')
      ).catch(e => {
        this.$message.error('复制失败')
        console.error('复制失败:', e)
      })
    }
  }
}
</script>

<style scoped>

</style>
