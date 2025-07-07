<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">项目Id</label>
        <el-input
          v-model="query.idsStr"
          clearable
          placeholder="项目Id"
          style="width: 100px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <label class="el-form-item-label">项目类型</label>
        <el-select
          v-model="query.projectType"
          clearable
          placeholder="项目类型"
          style="width: 100px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        >
          <el-option v-for="item in dict.project_type" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <label class="el-form-item-label">项目地区</label>
        <el-select
          v-model="query.projectRegion"
          clearable
          placeholder="项目地区"
          style="width: 100px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        >
          <el-option
            v-for="item in generateRegion(0,true)"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <label class="el-form-item-label">项目名</label>
        <el-input
          v-model="query.projectName"
          clearable
          placeholder="项目名"
          style="width: 160px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <label class="el-form-item-label">业务人员</label>
        <el-select
          v-model="query.salesPerson"
          filterable
          clearable
          style="width: 100px"
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
        <label class="el-form-item-label">合同编号</label>
        <el-input
          v-model="query.contractNumber"
          clearable
          placeholder="合同编号"
          style="width: 160px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <label class="el-form-item-label">进度情况</label>
        <el-select
          v-model="query.projectProgress"
          clearable
          style="width: 100px"
          placeholder="进度情况"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        >
          <el-option label="未完成" :value="[0,99]" />
          <el-option label="已完成" :value="[100,200]" />
        </el-select>
        <label class="el-form-item-label">收款情况</label>
        <el-select
          v-model="query.receiveFinished"
          clearable
          style="width: 100px"
          placeholder="收款情况"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        >
          <el-option label="收款未完成" :value="false" />
          <el-option label="收款已完成" :value="true" />
        </el-select>
        <label class="el-form-item-label">乙方单位</label>
        <el-select
          v-model="query.partyB"
          clearable
          filterable
          allow-create
          style="width: 100px"
          placeholder="乙方单位"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        >
          <el-option v-for="item in dict.party_b_names" :key="item.label" :label="item.label" :value="item.value" />
        </el-select>
        <label class="el-form-item-label">附件情况</label>
        <el-select
          v-model="query.attachmentStatus"
          clearable
          multiple
          style="width: 100px"
          placeholder="附件情况"
          class="filter-item"
          @change="handleAttachmentStatusChange"
          @keyup.enter.native="crud.toQuery"
        >
          <el-option label="无合同" :value="0" />
          <el-option label="无明细表" :value="1" />
          <el-option label="有合同" :value="2" />
          <el-option label="有明细表" :value="3" />
        </el-select>
        <label class="el-form-item-label">付款方式</label>
        <el-select
          v-model="query.contractPayWay"
          clearable
          multiple
          style="width: 100px"
          placeholder="付款方式"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        >
          <el-option v-for="item in contractPayWays" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <label class="el-form-item-label">项目创建时间</label>
        <date-range-picker v-model="query.createTime" class="el-form-item-label" />
        <label class="el-form-item-label">收款时间</label>
        <date-range-picker v-model="query.receiveTime" class="el-form-item-label" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
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
                v-for="item in dict.project_type"
                :key="item.label"
                :label="item.label"
                :value="parseInt(item.value)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="项目名" prop="projectName">
            <el-input v-model="form.projectName" style="width: 370px" />
          </el-form-item>
          <el-form-item label="项目地区" prop="projectRegion">
            <el-select
              v-model="form.projectRegion"
              filterable
              style="width: 178px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in generateRegion(form.projectType)"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="甲方名称" prop="partyA">
            <el-input v-model="form.partyA" style="width: 370px" />
          </el-form-item>
          <el-form-item label="乙方名称" prop="partyB">
            <el-select
              v-model="form.partyB"
              style="width: 178px"
              placeholder="请选择"
              filterable
            >
              <el-option v-for="item in dict.party_b_names" :key="item.label" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="合同编号" prop="contractNumber">
            <el-input v-model="form.contractNumber" style="width: 370px" />
          </el-form-item>
          <el-form-item label="合同金额" prop="contractAmount">
            <el-input-number v-model="form.contractAmount" :precision="2" :step="0.1" />
          </el-form-item>
          <el-form-item label="签订时间" prop="contractTime">
            <el-date-picker
              v-model="form.contractTime"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="合同付款方式" prop="contractPayWay">
            <el-select
              v-model="form.contractPayWay"
              style="width: 178px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in contractPayWays"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="项目进度" prop="projectProgress">
            <el-input-number v-model="form.projectProgress" :min="0" :max="100" :step="10" label="请输入" />
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
                :key="item.id+'A'"
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
                :key="item.id+'C'"
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
                v-for="item in invoiceTypes"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" style="width: 370px" />
          </el-form-item>
          <el-form-item label="业务中心百分比" prop="salesPercent">
            <el-input-number v-model="form.salesPercent" :min="0" :max="100" :step="5" label="请输入" />
          </el-form-item>
          <el-form-item label="技术中心百分比" prop="technicalPercent">
            <el-input-number
              v-model="form.technicalPercent"
              :min="0"
              :max="100"
              :step="5"
              label="请输入"
            />
          </el-form-item>
          <el-form-item label="管理中心百分比" prop="managementPercent">
            <el-input-number
              v-model="form.managementPercent"
              :min="0"
              :max="100"
              :step="5"
              label="请输入"
            />
          </el-form-item>
          <el-form-item label="总裁办百分比" prop="presidentPercent">
            <el-input-number
              v-model="form.presidentPercent"
              :min="0"
              :max="100"
              :step="5"
              label="请输入"
            />
          </el-form-item>
          <el-form-item label="创建日期" prop="createTime">
            <el-date-picker
              v-model="form.createTime"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item v-if="form.id!==null" label="收款情况">
            <sys-project-receive :project-id="form.id" />
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
        style="width: 100%"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="projectType" label="项目类型" :formatter="formatProjectType" />
        <el-table-column prop="projectName" label="项目名" />
        <el-table-column prop="projectRegion" label="项目地区" />
        <el-table-column prop="partyA" label="甲方名称" />
        <el-table-column prop="partyB" label="乙方名称" />
        <el-table-column prop="contractNumber" label="合同编号" />
        <el-table-column prop="contractTime" label="签订时间" />
        <el-table-column prop="contractPayWay" label="付款方式" :formatter="formatPayWay" />
        <el-table-column prop="contractAmount" label="合同金额" :formatter="formatPrice" />
        <el-table-column label="已收款">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="clickReceive(scope)">
              {{ formatPrice(0, 0, scope.row.receiveAmount) }}
            </el-button>
            <el-dialog title="收款详情" :visible.sync="dialogTableVisible[scope.$index]">
              <sys-project-receive
                v-if="dialogTableVisible[scope.$index]"
                ref="receiveDetail"
                :project-id="receiveProjectId"
              />
            </el-dialog>
          </template>
        </el-table-column>
        <el-table-column label="未收款" :formatter="formatUnpaid" />
        <el-table-column
          prop="projectProgress"
          label="项目进度"
          :width="120"
        >
          <template slot-scope="scope">
            <div class="progress-cell">
              <!-- 编辑状态 -->
              <div v-if="isEditing(scope.row)" class="edit-mode">
                <el-input
                  v-model="scope.row.projectProgress"
                  class="edit-progress-input"
                  @blur="saveProgress(scope.row)"
                  @keyup.enter.native="saveProgress(scope.row)"
                />
                <el-button
                  size="mini"
                  type="success"
                  class="save-btn"
                  @click="saveProgress(scope.row)"
                >
                  保存
                </el-button>
              </div>
              <!-- 只读状态 -->
              <div v-else class="view-mode">
                <span class="progress-text">{{ scope.row.projectProgress }}</span>
                <el-button
                  v-if="checkPer(['admin', 'sysProjectDetail:editProgress'])"
                  size="mini"
                  class="edit-btn"
                  @click="toggleEdit(scope.row)"
                >
                  <i class="el-icon-edit" />
                </el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="shouldReceiveAmount" label="应收款" :formatter="formatPrice" />
        <el-table-column prop="salesPerson" label="业务人员" :formatter="formatProjectPerson" />
        <el-table-column prop="partyAPerson" label="甲方负责人" :formatter="formatProjectPerson" />
        <el-table-column prop="invoiceType" label="发票类型" :formatter="formatInvoiceType" />
        <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" />
        <el-table-column prop="attachment" label="附件">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="clickAttachment(scope)">查看附件</el-button>
            <el-dialog title="收款详情" :visible.sync="attachmentTableVisible[scope.$index]">
              <attachment
                v-if="attachmentTableVisible[scope.$index]"
                ref="receiveDetail"
                :project-id="receiveProjectId"
              />
            </el-dialog>
          </template>
        </el-table-column>
        <el-table-column prop="salesPercent" label="业务中心百分比" />
        <el-table-column prop="technicalPercent" label="技术中心百分比" />
        <el-table-column prop="managementPercent" label="管理中心百分比" />
        <el-table-column prop="presidentPercent" label="总裁办百分比" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
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
      <pagination />
    </div>
  </div>
</template>

<script>
import crudSysProjectDetail, { edit } from '@/api/keyuan/sysProjectDetail'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import DateRangePicker from '@/components/DateRangePicker'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getAllProjectPerson } from '@/api/keyuan/sysProjectPerson'
import SysProjectReceive from '@/views/keyuan/sysProjectDetail/receive'
import Attachment from '@/views/keyuan/sysProjectDetail/attachment'
import { Decimal } from 'decimal.js'

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
  partyAPerson: null,
  invoiceType: null,
  remark: null,
  salesPercent: 30,
  technicalPercent: 30,
  managementPercent: 20,
  presidentPercent: 20,
  receiveAmount: null,
  createTime: null,
  updateTime: null,
  projectRegion: null,
  contractReceiveTime: null,
  contractPayWay: null,
  shouldReceiveAmount: null,
  projectProgress: null,
  receiveFinished: null,
  idsStr: null
}
export default {
  name: 'SysProjectDetail',
  components: { Attachment, SysProjectReceive, pagination, crudOperation, rrOperation, udOperation, DateRangePicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['project_type', 'rkz_regions', 'party_b_names'],
  data() {
    return {
      permission: {
        add: ['admin', 'sysProjectDetail:add'],
        edit: ['admin', 'sysProjectDetail:edit'],
        del: ['admin', 'sysProjectDetail:del']
      },
      rules: {
        projectType: [
          { required: true, message: '项目类型不能为空', trigger: 'blur' }
        ],
        projectName: [
          { required: true, message: '项目名不能为空', trigger: 'blur' }
        ],
        projectRegion: [
          { required: true, message: '项目地区不能为空', trigger: 'blur' }
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
        ],
        contractPayWay: [
          { required: true, message: '合同付款方式不能为空', trigger: 'blur' }
        ]
      },
      invoiceTypes: [
        { value: 0, label: '专票' },
        { value: 1, label: '普票' },
        { value: 2, label: '无票' }
      ],
      contractPayWays: [
        { value: 0, label: '签合同50，完工结清' },
        { value: 1, label: '一次性付清' },
        { value: 2, label: '签合同30进度50付30完工结清' },
        { value: 3, label: '按进度拨付' },
        { value: 4, label: '签合同60，施工图(进度90)30，竣工验收10' },
        { value: 5, label: '签合同50，验收(进度80)30，审计20' },
        { value: 6, label: '合同签订报告通过90，基础验收10' }
      ],
      projectPersons: [], projectPersonNameMap: null, currentProjectId: null, receiveProjectId: null,
      dialogTableVisible: [], attachmentTableVisible: [], projectRegions: [], editingRows: []
    }
  },
  async created() {
    getAllProjectPerson().then(res => {
      this.projectPersons = res.content.slice()
      this.projectPersonNameMap = this.projectPersons.reduce(function(map, obj) {
        map[obj.id] = obj.name
        return map
      }, {})
    })
  },
  cruds() {
    return CRUD({
      title: '项目明细',
      url: 'api/sysProjectDetail',
      idField: 'id',
      sort: 'createTime,desc',
      crudMethod: { ...crudSysProjectDetail }
    })
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.beforeToCU]() {
      if (this.form.contractAmount !== null) {
        this.form.contractAmount = new Decimal(this.form.contractAmount).div(100)
      }
    },
    [CRUD.HOOK.beforeSubmit]() {
      this.form.contractAmount = new Decimal(this.form.contractAmount).times(100).floor()
    },
    formatProjectType(row, column, id) {
      return this.dict.project_type[id].label
    },
    formatInvoiceType(row, column, id) {
      return this.invoiceTypes[id].label
    },
    formatProjectPerson(row, column, id) {
      if (id === null || this.projectPersonNameMap === null) {
        return '/'
      }
      return this.projectPersonNameMap[id]
    },
    formatPrice(row, column, price) {
      if (isNaN(price) || price === null || price === 0) {
        return 0.00
      }
      return (price / 100).toFixed(2)
    },
    formatUnpaid(row, column, price) {
      const contract = row.contractAmount || 0
      const receive = row.receiveAmount || 0
      const unpaid = Math.max(0, contract - receive)
      // 可选：限制未收款金额不能为负值
      return (unpaid / 100).toFixed(2)
    },
    formatPayWay(row, column, id) {
      return this.contractPayWays[id].label
    },
    clickReceive(scope) {
      this.receiveProjectId = scope.row.id
      this.dialogTableVisible.splice(scope.$index, 1, true)
    },
    clickAttachment(scope) {
      this.receiveProjectId = scope.row.id
      this.attachmentTableVisible.splice(scope.$index, 1, true)
    },
    generateRegion(projectType, all = false) {
      if (all) {
        return ['日喀则', '拉萨', '阿里', '那曲'].concat(this.dict.rkz_regions.map(a => a.label))
      }
      if (projectType == 1) {
        return this.dict.rkz_regions.map(a => a.label)
      }
      return ['日喀则', '拉萨', '阿里', '那曲']
    },
    handleAttachmentStatusChange(value) {
      if (value.includes(0)) {
        this.query.attachmentStatus = value.filter(v => v !== 2)
      }
      if (value.includes(1)) {
        this.query.attachmentStatus = value.filter(v => v !== 3)
      }
    },
    // 判断该行是否处于编辑状态
    isEditing(row) {
      return this.editingRows.includes(row.id)
    },
    // 切换编辑状态
    toggleEdit(row) {
      if (this.checkPer(['admin', 'sysProjectDetail:editProgress'])) {
        this.editingRows.push(row.id)
      }
    },
    // 保存项目进度
    saveProgress(row) {
      // 假设你有API：updateProjectProgress(row)
      const progress = Number(row.projectProgress)
      if (progress < 0 || progress > 100) {
        this.$message.error('请输入 0-100 之间的数值')
        return
      }
      edit(row).then(() => {
        this.$message.success('更新成功')
        this.editingRows = this.editingRows.filter(id => id !== row.id)
      }).catch(() => {
        this.$message.error('更新失败，请重试')
      })
    }
  }
}
</script>

<style scoped>
.upload-section {
  margin: 15px 0;
  display: flex;
  gap: 10px;
}
.progress-cell {
  display: flex;
  align-items: center;
  width: 100%;
}

.edit-mode {
  display: flex;
  align-items: center;
  gap: 4px; /* 间距 */
  width: 100%;
}

.edit-progress-input {
  width: 70px; /* 调整输入框宽度 */
  text-align: center;
}

.save-btn {
  padding: 4px 6px;
  font-size: 12px;
  min-width: 50px;
}
</style>
