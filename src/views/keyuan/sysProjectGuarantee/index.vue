<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">担保状态</label>
        <el-select
          v-model="query.status"
          clearable
          placeholder="请选择"
          style="width: 185px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        >
          <el-option
            v-for="item in dict.guarantee_status"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label class="el-form-item-label">项目类型</label>
        <el-select
          v-model="query.projectType"
          clearable
          placeholder="请选择"
          style="width: 185px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        >
          <el-option
            v-for="item in dict.project_type"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label class="el-form-item-label">担保人员</label>
        <el-select
          v-model="query.guaranteePerson"
          clearable
          filterable
          placeholder="担保人员"
          style="width: 185px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        >
          <el-option
            v-for="item in persons"
            :key="item.id+'A'"
            :label="item.name"
            :value="item.id"
          >
            <span style="float: left">{{ item.name }}</span>
            <span style="float: left; color: #8492a6">{{ item.phoneNumber }}</span>
          </el-option>
        </el-select>
        <date-range-picker v-model="query.createTime" class="el-form-item-label" />
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
        width="500px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="担保状态" prop="status">
            <el-select v-model="form.status" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.guarantee_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="项目类型" prop="projectType">
            <el-select v-model="form.projectType" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.project_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="项目名" prop="projectName">
            <el-input v-model="form.projectName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="甲方名称" prop="partyA">
            <el-input v-model="form.partyA" :rows="3" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="甲方联系人">
            <el-select
              v-model="form.partyAPerson"
              filterable
              style="width: 178px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in persons"
                :key="item.id+'A'"
                :label="item.name"
                :value="item.id"
              >
                <span style="float: left">{{ item.name }}</span>
                <span style="float: left; color: #8492a6">{{ item.phoneNumber }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="担保金额" prop="guaranteeAmount">
            <el-input-number v-model="form.guaranteeAmount" :precision="2" :step="0.1" />
          </el-form-item>
          <el-form-item label="担保结束时间" prop="guaranteeTime">
            <el-date-picker
              v-model="form.guaranteeTime"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="担保人员" prop="guaranteePerson">
            <el-select
              v-model="form.guaranteePerson"
              filterable
              style="width: 178px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in persons"
                :key="item.id+'A'"
                :label="item.name"
                :value="item.id"
              >
                <span style="float: left">{{ item.name }}</span>
                <span style="float: left; color: #8492a6">{{ item.phoneNumber }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="form.createTime"
              type="date"
              placeholder="选择日期"
            />
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
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="status" label="担保状态">
          <template slot-scope="scope">
            {{ dict.label.guarantee_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="projectType" label="项目类型">
          <template slot-scope="scope">
            {{ dict.label.project_type[scope.row.projectType] }}
          </template>
        </el-table-column>
        <el-table-column prop="projectName" label="项目名" />
        <el-table-column prop="partyA" label="甲方名称" />
        <el-table-column prop="partyAPerson" label="甲方联系人">
          <template slot-scope="scope">{{ personMap[scope.row.partyAPerson] }}</template>
        </el-table-column>
        <el-table-column prop="guaranteeAmount" label="担保金额" :formatter="formatPrice" />
        <el-table-column prop="guaranteeTime" label="担保结束时间" />
        <el-table-column prop="guaranteePerson" label="担保人员">
          <template slot-scope="scope">{{ personMap[scope.row.guaranteePerson] }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="修改时间" />
        <el-table-column
          v-if="checkPer(['admin','sysProjectGuarantee:edit','sysProjectGuarantee:del'])"
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
import crudSysProjectGuarantee from '@/api/keyuan/sysProjectGuarantee'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import { getAllProjectPerson } from '@/api/keyuan/sysProjectPerson'

const defaultForm = {
  id: null,
  status: null,
  projectType: null,
  projectName: null,
  partyA: null,
  partyAPerson: null,
  guaranteeAmount: null,
  guaranteeTime: null,
  guaranteePerson: null,
  remark: null,
  createTime: null,
  updateTime: null
}
export default {
  name: 'SysProjectGuarantee',
  components: { pagination, crudOperation, rrOperation, udOperation, DateRangePicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['guarantee_status', 'project_type'],
  cruds() {
    return CRUD({
      title: '项目担保',
      url: 'api/sysProjectGuarantee',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudSysProjectGuarantee }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'sysProjectGuarantee:add'],
        edit: ['admin', 'sysProjectGuarantee:edit'],
        del: ['admin', 'sysProjectGuarantee:del']
      },
      rules: {
        status: [
          { required: true, message: '担保状态 0-担保中,1-担保逾期,2-担保完成不能为空', trigger: 'blur' }
        ],
        projectType: [
          { required: true, message: '项目类型 0-检测，1-监理，2-设计不能为空', trigger: 'blur' }
        ],
        projectName: [
          { required: true, message: '项目名不能为空', trigger: 'blur' }
        ],
        partyA: [
          { required: true, message: '甲方名称不能为空', trigger: 'blur' }
        ],
        guaranteeAmount: [
          { required: true, message: '担保金额不能为空', trigger: 'blur' }
        ],
        guaranteeTime: [
          { required: true, message: '担保结束时间不能为空', trigger: 'blur' }
        ],
        guaranteePerson: [
          { required: true, message: '担保人员不能为空', trigger: 'blur' }
        ]
      }, persons: [], personMap: {}
    }
  },
  async created() {
    getAllProjectPerson().then(res => {
      this.persons = res.content.slice()
      this.personMap = this.persons.reduce(function(map, obj) {
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
      this.form.guaranteeAmount /= 100
    },
    [CRUD.HOOK.beforeSubmit]() {
      this.form.guaranteeAmount = Math.floor(this.form.guaranteeAmount * 100)
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
