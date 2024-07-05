<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation v-if="projectId!==null" :permission="permission"/>
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        append-to-body
        width="500px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="开票金额" prop="invoiceAmount">
            <el-input-number v-model="form.invoiceAmount" :precision="2" :step="0.1"></el-input-number>
          </el-form-item>
          <el-form-item label="开票时间" prop="invoiceTime">
            <el-date-picker
              v-model="form.invoiceTime"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="到账金额" prop="receiveAmount">
            <el-input-number v-model="form.receiveAmount" :precision="2" :step="0.1"></el-input-number>
          </el-form-item>
          <el-form-item label="到账时间" prop="receiveTime">
            <el-date-picker
              v-model="form.receiveTime"
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
        :data="projectReceives"
        size="small"
        style="width: 100%;"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="invoiceAmount" label="开票金额" :formatter="formatPrice"/>
        <el-table-column prop="invoiceTime" label="开票时间"/>
        <el-table-column prop="receiveAmount" label="到账金额" :formatter="formatPrice"/>
        <el-table-column prop="receiveTime" label="到账时间"/>
        <el-table-column prop="createTime" label="创建时间"/>
        <el-table-column prop="updateTime" label="更新时间"/>
        <el-table-column
          v-if="checkPer(['admin','sysProjectReceive:edit','sysProjectReceive:del'])"
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
import crudSysProjectReceive, { getReceivesByProjectId } from '@/api/keyuan/sysProjectReceive'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  projectId: null,
  invoiceAmount: null,
  invoiceTime: null,
  receiveAmount: null,
  receiveTime: null,
  isDeleted: null,
  createTime: null,
  updateTime: null
}
export default {
  name: 'SysProjectReceive',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  props: {
    projectId: {
      type: [Number, null],
      default: null
    },
    projectReceives: {
      type: [Array, null],
      default: null
    }
  },
  cruds() {
    return CRUD({
      title: '项目收款信息',
      url: 'api/sysProjectReceive',
      idField: 'id',
      sort: 'id,desc',
      debug: true,
      crudMethod: { ...crudSysProjectReceive }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'sysProjectReceive:add'],
        edit: ['admin', 'sysProjectReceive:edit'],
        del: ['admin', 'sysProjectReceive:del']
      },
      rules: {
        // projectId: [
        //   { required: true, message: '项目ID不能为空', trigger: 'blur' }
        // ],
        invoiceAmount: [
          { required: true, message: '开票金额不能为空', trigger: 'blur' }
        ],
        invoiceTime: [
          { required: true, message: '开票时间不能为空', trigger: 'blur' }
        ],
        receiveAmount: [
          { required: true, message: '到账金额不能为空', trigger: 'blur' }
        ],
        receiveTime: [
          { required: true, message: '到账时间不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      // this.getProjectReceives()
      // console.log(this.crud)
      this.getProjectReceives()
      return this.projectId !== null
    },
    [CRUD.HOOK.beforeToCU]() {
      this.form.projectId = this.projectId
      this.form.invoiceAmount /= 100
      this.form.receiveAmount /= 100
    },
    [CRUD.HOOK.afterSubmit]() {
      this.getProjectReceives()
    },
    [CRUD.HOOK.afterDelete]() {
      this.getProjectReceives()
    },
    [CRUD.HOOK.beforeSubmit]() {
      this.form.invoiceAmount = Math.floor(this.form.invoiceAmount * 100)
      this.form.receiveAmount = Math.floor(this.form.receiveAmount * 100)
    },
    getProjectReceives() {
      getReceivesByProjectId(this.projectId).then(res => {
        this.projectReceives = res.content.slice()
      })
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
