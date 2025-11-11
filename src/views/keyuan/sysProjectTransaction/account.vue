<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">科目编号</label>
        <el-input v-model="query.accountNumber" clearable placeholder="科目编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">科目含义</label>
        <el-input v-model="query.description" clearable placeholder="科目含义" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">上级科目</label>
        <el-input v-model="query.parent" clearable placeholder="上级科目" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="科目编号" prop="accountNumber">
            <el-input v-model="form.accountNumber" style="width: 370px;" :disabled="disableEdit"/>
          </el-form-item>
          <el-form-item label="科目含义" prop="description">
            <el-input v-model="form.description" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="上级科目" prop="parent">
            <el-select
              v-model="form.parent"
              placeholder="请选择上级科目"
              filterable
              clearable
            >
              <el-option
                v-for="item in allAccounts"
                :key="item.accountNumber"
                :label="item.accountNumber"
                :value="item.accountNumber"
              >
                <span style="float: left">{{ item.accountNumber }}</span>
                <span style="float: left; color: #8492a6">{{ item.description }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="初始余额" prop="initialAmount">
            <money-input v-model="form.initialAmount" />
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
        <el-table-column prop="accountNumber" label="科目编号" />
        <el-table-column prop="description" label="科目含义" />
        <el-table-column prop="parent" label="上级科目" />
        <el-table-column prop="initialAmount" label="初始余额" :formatter="currencyFormatter"/>
        <el-table-column prop="createBy" label="创建人" />
        <el-table-column prop="updateBy" label="修改人" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="修改时间" />
        <el-table-column v-if="checkPer(['admin','sysProjectAccount:edit','sysProjectAccount:del'])" label="操作" width="150px" align="center">
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
import crudSysProjectAccount, { getAllAccounts } from '@/api/keyuan/sysProjectAccount'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import moneyInput from '@/views/components/MoneyInput'
import { formatCurrency } from '@/api/keyuan/formatter'

const defaultForm = { accountNumber: null, description: null, parent: null, initialAmount: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'SysProjectAccount',
  components: { pagination, crudOperation, rrOperation, udOperation, moneyInput },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '项目科目信息', url: 'api/sysProjectAccount', idField: 'accountNumber', sort: 'accountNumber,desc', crudMethod: { ...crudSysProjectAccount }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'sysProjectAccount:add'],
        edit: ['admin', 'sysProjectAccount:edit'],
        del: ['admin', 'sysProjectAccount:del']
      },
      rules: {
        accountNumber: [
          { required: true, message: '科目编号不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '科目含义不能为空', trigger: 'blur' }
        ],
        initialAmount: [
          { required: true, message: '初始余额不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'accountNumber', display_name: '科目编号' },
        { key: 'description', display_name: '科目含义' },
        { key: 'parent', display_name: '上级科目' }
      ],
      allAccounts: [], disableEdit: false
    }
  },
  async created() {
    getAllAccounts().then(res => {
      this.allAccounts = res.content.slice()
    })
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.beforeToEdit]() {
      this.disableEdit = true
    },
    [CRUD.HOOK.beforeToAdd]() {
      this.disableEdit = false
    },
    [CRUD.HOOK.afterSubmit]() {
      getAllAccounts().then(res => {
        this.allAccounts = res.content.slice()
      })
    },
    currencyFormatter(row, column, value) {
      return formatCurrency(value)
    }
  }
}
</script>

<style scoped>

</style>
