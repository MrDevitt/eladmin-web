<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">项目名</label>
        <el-input v-model="query.projectName" clearable placeholder="项目名" style="width: 185px;" class="filter-item"
                  @keyup.enter.native="crud.toQuery"
        />
        <label class="el-form-item-label">业务人员</label>
        <el-select
          v-model="query.salesPerson"
          filterable
          clearable
          style="width: 178px"
          placeholder="业务人员"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        >
          <el-option
            v-for="item in projectPersons"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
            <span style="float: left">{{ item.name }}</span>
            <span style="float: left; color: #8492a6">{{ item.phoneNumber }}</span>
          </el-option>
        </el-select>
        <!--        <el-input v-model="query.salesPerson" clearable placeholder="业务人员" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
        <rrOperation :crud="crud"/>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="1000px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="项目类型" prop="projectType">
            <el-select
              v-model="form.projectType"
              style="width: 178px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in projectTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="项目名" prop="projectName">
            <el-input v-model="form.projectName" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="项目地址" prop="projectRegion">
            <el-select
              v-model="form.projectRegion"
              filterable
              style="width: 178px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in projectRegions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="甲方名称" prop="partyA">
            <el-input v-model="form.partyA" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="乙方名称" prop="partyB">
            <el-input v-model="form.partyB" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="合同编号" prop="contractNumber">
            <el-input v-model="form.contractNumber" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="合同金额" prop="contractAmount">
            <el-input-number v-model="form.contractAmount" :precision="2" :step="0.1"></el-input-number>
          </el-form-item>
          <el-form-item label="签订时间" prop="contractTime">
            <el-date-picker
              v-model="form.contractTime"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="开工时间">
            <el-date-picker
              v-model="form.projectStartTime"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="竣工时间">
            <el-date-picker
              v-model="form.projectFinishTime"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="业务人员" prop="salesPerson">
            <el-select
              v-model="form.salesPerson"
              filterable
              style="width: 178px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in projectPersons"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                <span style="float: left">{{ item.name }}</span>
                <span style="float: left; color: #8492a6">{{ item.phoneNumber }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="技术人员" prop="technicalPerson">
            <el-select
              v-model="form.technicalPerson"
              filterable
              style="width: 178px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in projectPersons"
                :key="item.phoneNumber"
                :label="item.name"
                :value="item.id"
              >
                <span style="float: left">{{ item.name }}</span>
                <span style="float: left; color: #8492a6">{{ item.phoneNumber }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="甲方负责人">
            <el-select
              v-model="form.partyAPerson"
              filterable
              style="width: 178px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in projectPersons"
                :key="item.phoneNumber"
                :label="item.name"
                :value="item.id"
              >
                <span style="float: left">{{ item.name }}</span>
                <span style="float: left; color: #8492a6">{{ item.phoneNumber }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="甲方领导">
            <el-select
              v-model="form.partyALeader"
              filterable
              style="width: 178px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in projectPersons"
                :key="item.phoneNumber"
                :label="item.name"
                :value="item.id"
              >
                <span style="float: left">{{ item.name }}</span>
                <span style="float: left; color: #8492a6">{{ item.phoneNumber }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发票类型" prop="invoiceType">
            <el-select
              v-model="form.invoiceType"
              style="width: 178px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in [{invoiceType:0,label:'专票'},{invoiceType:1,label:'普票'}]"
                :key="item.invoiceType"
                :label="item.label"
                :value="item.invoiceType"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="业务中心百分比" prop="salesPercent">
            <el-input-number v-model="form.salesPercent" :min="1" :max="100" :step="5" label="请输入"/>
          </el-form-item>
          <el-form-item label="技术中心百分比" prop="technicalPercent">
            <el-input-number
              v-model="form.technicalPercent"
              :min="1"
              :max="100"
              :step="5"
              label="请输入"
            />
          </el-form-item>
          <el-form-item label="管理中心百分比" prop="managementPercent">
            <el-input-number
              v-model="form.managementPercent"
              :min="1"
              :max="100"
              :step="5"
              label="请输入"
            />
          </el-form-item>
          <el-form-item label="总裁办百分比" prop="presidentPercent">
            <el-input-number
              v-model="form.presidentPercent"
              :min="1"
              :max="100"
              :step="5"
              label="请输入"
            />
          </el-form-item>
          <el-form-item label="收款情况">
            <sys-project-receive :project-id="currentProjectId" :project-receives="projectReceives"
            ></sys-project-receive>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        size="small"
        style="width: 100%;"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="id" label="id"/>
        <el-table-column prop="projectType" label="项目类型" :formatter="formatProjectType"/>
        <el-table-column prop="projectName" label="项目名"/>
        <el-table-column prop="projectRegion" label="项目地址"/>
        <el-table-column prop="partyA" label="甲方名称"/>
        <el-table-column prop="partyB" label="乙方名称"/>
        <el-table-column prop="contractNumber" label="合同编号"/>
        <el-table-column prop="contractTime" label="签订时间"/>
        <el-table-column prop="contractAmount" label="合同金额" :formatter="formatPrice"/>
        <el-table-column prop="receiveAmount" label="收款金额" :formatter="formatPrice"/>
        <el-table-column prop="projectStartTime" label="开工时间"/>
        <el-table-column prop="projectFinishTime" label="竣工时间"/>
        <el-table-column prop="salesPerson" label="业务人员" :formatter="formatProjectPerson"/>
        <el-table-column prop="technicalPerson" label="技术人员" :formatter="formatProjectPerson"/>
        <el-table-column prop="partyAPerson" label="甲方负责人" :formatter="formatProjectPerson"/>
        <el-table-column prop="partyALeader" label="甲方领导" :formatter="formatProjectPerson"/>
        <el-table-column prop="invoiceType" label="发票类型" :formatter="formatInvoiceType"/>
        <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true"/>
        <el-table-column prop="salesPercent" label="业务中心百分比"/>
        <el-table-column prop="technicalPercent" label="技术中心百分比"/>
        <el-table-column prop="managementPercent" label="管理中心百分比"/>
        <el-table-column prop="presidentPercent" label="总裁办百分比"/>
        <el-table-column prop="createTime" label="创建时间"/>
        <el-table-column prop="updateTime" label="更新时间"/>
        <el-table-column
          v-if="checkPer(['admin','sysProjectDetail:edit','sysProjectDetail:del'])"
          label="操作"
          width="150px"
          align="center"
        >
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
  </div>
</template>

<script>
import crudSysProjectDetail from '@/api/keyuan/sysProjectDetail'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getAllProjectPerson } from '@/api/keyuan/sysProjectPerson'
import SysProjectReceive from '@/views/keyuan/sysProjectDetail/receive'
import { getReceivesByProjectId } from '@/api/keyuan/sysProjectReceive'

const defaultForm = {
  id: null,
  projectType: null,
  projectName: null,
  partyA: null,
  partyB: null,
  contractNumber: null,
  contractAmount: null,
  contractTime: null,
  projectStartTime: null,
  projectFinishTime: null,
  salesPerson: null,
  technicalPerson: null,
  partyAPerson: null,
  partyALeader: null,
  invoiceType: null,
  remark: null,
  salesPercent: 30,
  technicalPercent: 30,
  managementPercent: 20,
  presidentPercent: 20,
  receiveAmount: null,
  isDeleted: null,
  createTime: null,
  updateTime: null
}
export default {
  name: 'SysProjectDetail',
  components: { SysProjectReceive, pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '项目明细',
      url: 'api/sysProjectDetail',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudSysProjectDetail }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'sysProjectDetail:add'],
        edit: ['admin', 'sysProjectDetail:edit'],
        del: ['admin', 'sysProjectDetail:del']
      },
      rules: {
        projectType: [
          { required: true, message: '项目类型 0-检测，1-监理，2-设计不能为空', trigger: 'blur' }
        ],
        projectName: [
          { required: true, message: '项目名不能为空', trigger: 'blur' }
        ],
        projectRegion: [
          { required: true, message: '项目地址不能为空', trigger: 'blur' }
        ],
        partyA: [
          { required: true, message: '甲方名称不能为空', trigger: 'blur' }
        ],
        partyB: [
          { required: true, message: '乙方名称不能为空', trigger: 'blur' }
        ],
        contractNumber: [
          { required: true, message: '合同编号不能为空', trigger: 'blur' }
        ],
        contractAmount: [
          { required: true, message: '合同金额不能为空', trigger: 'blur' }
        ],
        contractTime: [
          { required: true, message: '签订时间不能为空', trigger: 'blur' }
        ],
        salesPerson: [
          { required: true, message: '业务人员不能为空', trigger: 'blur' }
        ],
        technicalPerson: [
          { required: true, message: '技术人员不能为空', trigger: 'blur' }
        ],
        invoiceType: [
          { required: true, message: '发票类型 0-专票，1-普票不能为空', trigger: 'blur' }
        ],
        salesPercent: [
          { required: true, message: '业务中心百分比不能为空', trigger: 'blur' }
        ],
        technicalPercent: [
          { required: true, message: '技术中心百分比不能为空', trigger: 'blur' }
        ],
        managementPercent: [
          { required: true, message: '管理中心百分比不能为空', trigger: 'blur' }
        ],
        presidentPercent: [
          { required: true, message: '总裁办百分比不能为空', trigger: 'blur' }
        ]
      },
      projectTypes: [
        { value: 0, label: '检测' },
        { value: 1, label: '监理' },
        { value: 2, label: '设计' },
        { value: 3, label: '其他' }
      ],
      projectPersons: [], projectPersonNameMap: null, currentProjectId: null, projectReceives: null,
      projectRegions: ['日喀则', '拉萨', '阿里', '日喀则市区', '吉隆', '白朗', '聂拉木', '岗巴', '定日', '萨嘎', '仁布', '江孜', '康马']
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      this.getProjectPersons(true)
      return true
    },
    [CRUD.HOOK.beforeToCU]() {
      this.getProjectPersons()
      this.form.contractAmount /= 100
    },
    [CRUD.HOOK.beforeToEdit]() {
      this.currentProjectId = this.form.id
      getReceivesByProjectId(this.currentProjectId).then(res => {
        console.log(res)
        this.projectReceives = res.content.slice()
      })
    },
    [CRUD.HOOK.beforeToAdd]() {
      this.currentProjectId = null
      this.projectReceives = null
    },
    [CRUD.HOOK.beforeSubmit]() {
      this.form.contractAmount = Math.floor(this.form.contractAmount * 100)
      console.log(this.form)
    },
    getProjectPersons(refresh = false) {
      getAllProjectPerson().then(res => {
        this.projectPersons = res.content.slice()
        if (refresh) {
          this.projectPersonNameMap = this.projectPersons.reduce(function(map, obj) {
            map[obj.id] = obj.name
            return map
          }, {})
        }
      }).catch(() => {
      })
    },
    formatProjectType(row, column, id) {
      switch (id) {
        case 0:
          return '检测'
        case 1:
          return '监理'
        case 2:
          return '设计'
        case 3:
          return '其他'
        default:
          return 'unknown'
      }
    },
    formatInvoiceType(row, column, id) {
      switch (id) {
        case 0:
          return '专票'
        case 1:
          return '普票'
        default:
          return 'unknown'
      }
    },
    formatProjectPerson(row, column, id) {
      return this.projectPersonNameMap[id]
    },
    formatPrice(row, column, price) {
      if (isNaN(price) || price === null || price === 0) {
        return 0.00
      }
      return (price / 100).toFixed(2)
    }
  }
}
</script>

<style scoped>

</style>
