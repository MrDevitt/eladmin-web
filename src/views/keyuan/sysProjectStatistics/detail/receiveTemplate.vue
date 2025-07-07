<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="card-header">
        <span>{{ titleText1 }}</span>
      </div>
      <el-table :data="receiveAmountData" show-summary stripe >
        <el-table-column prop="name" label="业务人" />
        <el-table-column prop="exam" label="检测" :formatter="formatCurrency" />
        <el-table-column prop="supervise" label="监理" :formatter="formatCurrency" />
        <el-table-column prop="design" label="设计" :formatter="formatCurrency" />
        <el-table-column prop="other" label="其他" :formatter="formatCurrency" />
        <el-table-column prop="sum" label="合计" :formatter="formatCurrency" />
        />
      </el-table>
    </el-card>
    <el-card class="box-card" shadow="always">
      <div slot="header" class="card-header">
        <span>{{ titleText2 }}</span>
      </div>
      <el-table :data="receiveRateData" stripe >
        <el-table-column prop="name" label="业务人" />
        <el-table-column prop="rate_2023" label="2023" />
        <el-table-column prop="rate_2024" label="2024" />
        <el-table-column prop="rate_2025" label="2025" />
        <el-table-column prop="rate" label="总收款率" />
        />
      </el-table>
    </el-card>
    <el-card class="box-card" shadow="always">
      <div slot="header" class="card-header">
        <span>{{ titleText3 }}</span>
      </div>
      <div class="head-container">
        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <label class="el-form-item-label">业务人员</label>
          <el-select
            v-model="query.salesPerson"
            filterable
            clearable
            style="width: 160px"
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
          <label class="el-form-item-label">项目类型</label>
          <el-select
            v-model="query.projectType"
            clearable
            placeholder="项目类型"
            style="width: 100px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          >
            <el-option v-for="item in dict.project_type" :key="item.label" :label="item.label" :value="item.value"/>
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
          <date-range-picker v-model="query.contractTime" class="el-form-item-label" />
          <rrOperation :crud="crud" />
        </div>
        <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
        <crudOperation :permission="permission" />
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
          <el-table-column prop="projectType" label="项目类型" :formatter="formatProjectType" />
          <el-table-column prop="projectName" label="项目名" />
          <el-table-column prop="projectRegion" label="项目地区" />
          <el-table-column prop="partyA" label="甲方名称" />
          <el-table-column prop="partyB" label="乙方名称" />
          <el-table-column prop="contractNumber" label="合同编号" />
          <el-table-column prop="contractTime" label="签订时间" />
          <el-table-column prop="contractPayWay" label="付款方式" :formatter="formatPayWay" />
          <el-table-column prop="contractAmount" label="合同金额" :formatter="formatPrice" />
          <el-table-column label="收款金额">
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
          <el-table-column prop="projectProgress" label="项目进度" />
          <el-table-column prop="shouldReceiveAmount" label="应收款金额" :formatter="formatPrice" />
          <el-table-column prop="salesPerson" label="业务人员" :formatter="formatProjectPerson" />
          <el-table-column prop="invoiceType" label="发票类型" :formatter="formatInvoiceType" />
          <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" />
          <el-table-column prop="attachment" label="附件">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="clickAttachment(scope)">查看附件</el-button>
              <el-dialog title="附件详情" :visible.sync="attachmentTableVisible[scope.$index]">
                <attachment
                  v-if="attachmentTableVisible[scope.$index]"
                  ref="receiveDetail"
                  :project-id="receiveProjectId"
                />
              </el-dialog>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
      </div>
    </el-card>
  </div>
</template>

<script>
import crudSysProjectDetail from '@/api/keyuan/sysProjectDetail'
import CRUD, { crud, header, presenter } from '@crud/crud'
import DateRangePicker from '@/components/DateRangePicker'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import { getAllProjectPerson } from '@/api/keyuan/sysProjectPerson'
import SysProjectReceive from '@/views/keyuan/sysProjectDetail/receive'
import Attachment from '@/views/keyuan/sysProjectDetail/attachment'

export default {
  name: 'ReceiveTemplate',
  components: { SysProjectReceive, pagination, crudOperation, rrOperation, DateRangePicker, Attachment },
  mixins: [presenter(), header(), crud()],
  dicts: ['project_type', 'rkz_regions'],
  props: {
    dataType: {
      type: String,
      default: 'shouldReceive'
    },
    receiveAmountData: {
      type: Array,
      default: null
    },
    receiveRateData: {
      type: Array,
      default: null
    }
  },
  computed: {
    titleText1() {
      const typeMap = {
        'shouldReceive': '应收款',
        'notReceive': '未收款'
      }
      const prefix = typeMap[this.dataType]
      return `项目${prefix}金额统计(23年以后)`
    },
    titleText2() {
      const typeMap = {
        'shouldReceive': '应收款',
        'notReceive': '未收款'
      }
      const suffix = typeMap[this.dataType]
      return `项目收款率统计(${suffix})`
    },
    titleText3() {
      return this.dataType === 'shouldReceive' ? '应收款项目明细' : '未收款项目明细'
    }
  },
  cruds() {
    console.log(this)
    const dataType = this.propsData.dataType
    const params = {
      'createTime': [new Date('2023-01-01T00:00:00').toISOString().replace('T', ' ').substring(0, 23), new Date().toISOString().replace('T', ' ').substring(0, 23)]
    }
    if (dataType === 'shouldReceive') {
      params.shouldReceiveAmount = 0
    }
    if (dataType === 'notReceive') {
      params.receiveFinished = false
    }
    console.log(params)
    return CRUD({
      title: '项目明细',
      url: 'api/sysProjectDetail',
      idField: 'id',
      sort: 'createTime',
      params: params,
      crudMethod: { ...crudSysProjectDetail }
    })
  },
  data() {
    return {
      permission: {
        add: ['false'],
        edit: ['false'],
        del: ['false']
      },
      projectTypes: [
        { value: 0, label: '检测' },
        { value: 1, label: '监理' },
        { value: 2, label: '设计' },
        { value: 3, label: '其他' }
      ],
      invoiceTypes: [
        { value: 0, label: '专票' },
        { value: 1, label: '普票' },
        { value: 2, label: '无票' }
      ],
      contractPayWays: [
        { value: 0, label: '签合同50，完工结清' },
        { value: 1, label: '一次性付清' },
        { value: 2, label: '签合同30进度50付30完工结清' },
        { value: 3, label: '按进度拨付' }
      ],
      projectPersons: [], projectPersonNameMap: null, receiveProjectId: null,
      dialogTableVisible: [], attachmentTableVisible: []
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
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.beforeToCU]() {
      this.form.contractAmount /= 100
    },
    [CRUD.HOOK.beforeSubmit]() {
      this.form.contractAmount = Math.floor(this.form.contractAmount * 100)
    },
    formatProjectType(row, column, id) {
      return this.projectTypes[id].label
    },
    formatInvoiceType(row, column, id) {
      return this.invoiceTypes[id].label
    },
    formatProjectPerson(row, column, id) {
      return this.projectPersonNameMap[id]
    },
    formatPrice(row, column, price) {
      if (isNaN(price) || price === null || price === 0) {
        return 0.00
      }
      return (price / 100).toFixed(2)
    },
    formatPayWay(row, column, id) {
      return this.contractPayWays[id].label
    },
    clickReceive(scope) {
      this.receiveProjectId = scope.row.id
      this.dialogTableVisible.splice(scope.$index, 1, true)
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
    formatCurrency(row, column, num) {
      if (num === null || num === undefined) {
        return ''
      }
      const str = num.toString()
      const reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
      return str.replace(reg, '$1,')
    },
    formatUnpaid(row, column, price) {
      const contract = row.contractAmount || 0
      const receive = row.receiveAmount || 0
      const unpaid = Math.max(0, contract - receive)
      // 可选：限制未收款金额不能为负值
      return (unpaid / 100).toFixed(2)
    },
    clickAttachment(scope) {
      this.receiveProjectId = scope.row.id
      this.attachmentTableVisible.splice(scope.$index, 1, true)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.card-header {
  text-align: center;
  color: dodgerblue;
  font-size: medium;
  font-weight: normal;
}
</style>
