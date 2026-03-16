<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">摘要</label>
        <el-input v-model="query.comment" clearable placeholder="摘要" style="width: 100px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">类型</label>
        <el-select
          v-model="query.direction"
          clearable
          placeholder="请选择"
          style="width: 100px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        >
          <el-option
            v-for="item in dict.transaction_direction"
            :key="item.id"
            :label="item.label"
            :value="parseInt(item.value)"
          />
        </el-select>
        <label v-if="summaryCrud==null" class="el-form-item-label">父科目编号</label>
        <el-select
          v-if="summaryCrud==null"
          v-model="query.parentAccountNumber"
          placeholder="请选择父科目编号"
          filterable
          clearable
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        >
          <el-option
            v-for="item in parentAccounts"
            :key="item.accountNumber"
            :label="item.accountNumber+'-'+item.description"
            :value="item.accountNumber"
          >
            <span style="float: left">{{ item.accountNumber }}</span>
            <span style="float: left; color: #8492a6">{{ item.description }}</span>
          </el-option>
        </el-select>
        <label v-if="summaryCrud==null" class="el-form-item-label">科目编号</label>
        <el-select
          v-if="summaryCrud==null"
          v-model="query.accountNumber"
          placeholder="请选择科目编号"
          filterable
          clearable
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        >
          <el-option
            v-for="item in allAccounts"
            :key="item.accountNumber"
            :label="item.accountNumber+'-'+item.description"
            :value="item.accountNumber"
          >
            <span style="float: left">{{ item.accountNumber }}</span>
            <span style="float: left; color: #8492a6">{{ item.description }}</span>
          </el-option>
        </el-select>
        <label v-if="summaryCrud==null" class="el-form-item-label">银行账号编号</label>
        <el-select
          v-if="summaryCrud==null"
          v-model="query.bankNumber"
          placeholder="请选择银行科目编号"
          filterable
          clearable
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        >
          <el-option
            v-for="item in bankAccounts"
            :key="item.accountNumber"
            :label="item.accountNumber+'-'+item.description"
            :value="item.accountNumber"
          >
            <span style="float: left">{{ item.accountNumber }}</span>
            <span style="float: left; color: #8492a6">{{ item.description }}</span>
          </el-option>
        </el-select>
        <label class="el-form-item-label">记账凭证编号</label>
        <el-input v-model="query.certificateNumber" clearable placeholder="记账凭证编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">交易时间</label>
        <date-range-picker v-model="query.transactionTime" style="width: 185px;" class="filter-item" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="摘要" prop="comment">
            <el-input v-model="form.comment" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="金额" prop="amount">
            <money-input v-model="form.amount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="交易类型" prop="direction">
            <el-select v-model="form.direction" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.transaction_direction"
                :key="item.id"
                :label="item.label"
                :value="parseInt(item.value)" />
            </el-select>
          </el-form-item>
          <el-form-item label="科目编号" prop="accountNumber">
            <el-select
              v-model="form.accountNumber"
              placeholder="请选择科目编号"
              filterable
            >
              <el-option
                v-for="item in allAccounts"
                :key="item.accountNumber"
                :label="item.accountNumber+'-'+item.description"
                :value="item.accountNumber"
              >
                <span style="float: left">{{ item.accountNumber }}</span>
                <span style="float: left; color: #8492a6">{{ item.description }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="银行账号编号" prop="bankNumber">
            <el-select
              v-model="form.bankNumber"
              placeholder="请选择银行科目编号"
              filterable
            >
              <el-option
                v-for="item in bankAccounts"
                :key="item.accountNumber"
                :label="item.accountNumber+'-'+item.description"
                :value="item.accountNumber"
              >
                <span style="float: left">{{ item.accountNumber }}</span>
                <span style="float: left; color: #8492a6">{{ item.description }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="记账凭证编号" prop="certificateNumber">
            <el-input v-model="form.certificateNumber" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="交易时间" prop="transactionTime">
            <el-date-picker v-model="form.transactionTime" type="datetime" />
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
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="comment" label="摘要" />
        <el-table-column prop="amount" label="金额" :formatter="currencyFormatter" />
        <el-table-column prop="direction" label="交易类型">
          <template slot-scope="scope">
            {{ dict.label.transaction_direction[scope.row.direction] }}
          </template>
        </el-table-column>
        <el-table-column label="科目信息">
          <template #default="{ row }">
            <div>{{ row.accountNumber }}</div>
            <div style="color: #8492a6; font-size: 12px; margin-top: 4px">
              {{ allAccountsMap[row.accountNumber] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="银行科目号编号">
          <template #default="{ row }">
            <div>{{ row.bankNumber }}</div>
            <div style="color: #8492a6; font-size: 12px; margin-top: 4px">
              {{ allAccountsMap[row.bankNumber] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="certificateNumber" label="记账凭证编号" />
        <el-table-column prop="transactionTime" label="交易时间" />
        <el-table-column prop="createBy" label="创建人" />
        <el-table-column prop="updateBy" label="修改人" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="修改时间" />
        <el-table-column v-if="checkPer(['admin','sysProjectTransaction:edit','sysProjectTransaction:del'])&&summaryCrud==null" label="操作" width="150px" align="center">
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
import crudSysProjectTransaction from '@/api/keyuan/sysProjectTransaction'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import MoneyInput from '@/views/components/MoneyInput'
import DateRangePicker from '@/components/DateRangePicker'
import { formatCurrency } from '@/api/keyuan/formatter'
import { getAccounts } from '@/api/keyuan/sysProjectAccount'

const defaultForm = { id: null, comment: null, amount: null, direction: null, accountNumber: null, bankNumber: null, certificateNumber: null, transactionTime: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'SysProjectTransaction',
  components: { MoneyInput, pagination, crudOperation, rrOperation, udOperation, DateRangePicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['transaction_direction'],
  props: {
    summaryCrud: {
      type: Object,
      default: null
    }
  },
  cruds() {
    if (this.propsData.summaryCrud != null) {
      return this.propsData.summaryCrud
    }
    return CRUD({
      title: '项目收支信息',
      url: 'api/sysProjectTransaction',
      idField: 'id',
      sort: 'transactionTime,desc',
      crudMethod: { ...crudSysProjectTransaction }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'sysProjectTransaction:add'],
        edit: ['admin', 'sysProjectTransaction:edit'],
        del: ['admin', 'sysProjectTransaction:del']
      },
      rules: {
        comment: [
          { required: true, message: '摘要不能为空', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '金额不能为空', trigger: 'blur' }
        ],
        direction: [
          { required: true, message: '交易类型不能为空', trigger: 'blur' }
        ],
        accountNumber: [
          { required: true, message: '科目编号（关联业务人、部门）不能为空', trigger: 'blur' }
        ],
        bankNumber: [
          { required: true, message: '银行账号编号（关联银行账户）不能为空', trigger: 'blur' }
        ],
        certificateNumber: [
          { required: true, message: '记账凭证编号不能为空', trigger: 'blur' }
        ],
        transactionTime: [
          { required: true, message: '交易时间不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'comment', display_name: '摘要' },
        { key: 'direction', display_name: '交易类型' },
        { key: 'accountNumber', display_name: '科目编号（关联业务人、部门）' },
        { key: 'bankNumber', display_name: '银行账号编号（关联银行账户）' },
        { key: 'certificateNumber', display_name: '记账凭证编号' }
      ],
      allAccounts: [], // 仅子科目，暂未改名
      parentAccounts: [],
      bankAccounts: [],
      allAccountsMap: {}
    }
  },
  created() {
    getAccounts({ queryAll: true }).then(res => {
      // 仅保留叶子节点
      this.allAccounts = res.content.slice().filter(e => !e.hasChildren && String(e.accountNumber).startsWith('1001'))
      this.parentAccounts = res.content.slice().filter(e => e.hasChildren)
      this.bankAccounts = res.content.slice().filter(e => !e.hasChildren && String(e.accountNumber).startsWith('9001'))
      this.allAccountsMap = res.content.slice().reduce(function(map, obj) {
        map[obj.accountNumber] = obj.description
        return map
      }, {})
    })
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    currencyFormatter(row, column, value) {
      return formatCurrency(value)
    }
  }
}
</script>

<style scoped>

</style>
