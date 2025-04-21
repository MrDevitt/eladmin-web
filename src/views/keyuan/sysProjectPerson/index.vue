<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">姓名</label>
        <el-input
          v-model="query.name"
          clearable
          placeholder="姓名"
          style="width: 185px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
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
        width="500px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="手机号" prop="phoneNumber">
            <el-input v-model="form.phoneNumber" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="科目编号" prop="accountNumber">
            <el-input v-model="form.accountNumber" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="上年结转" prop="initialBalance">
            <el-input-number v-model="form.initialBalance" :precision="2" :step="0.1"/>
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
        <el-table-column prop="name" label="姓名"/>
        <el-table-column prop="phoneNumber" label="手机号"/>
        <el-table-column prop="accountNumber" label="科目编号"/>
        <el-table-column prop="initialBalance" label="上年结转" :formatter="formatCurrency"/>
        <el-table-column prop="createTime" label="创建时间"/>
        <el-table-column prop="updateTime" label="更新时间"/>
        <el-table-column
          v-if="checkPer(['admin','sysProjectPerson:edit','sysProjectPerson:del'])"
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
import crudSysProjectPerson from '@/api/keyuan/sysProjectPerson'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  name: null,
  phoneNumber: null,
  isDeleted: null,
  accountNumber: null,
  initialBalance: null,
  createTime: null,
  updateTime: null
}
export default {
  name: 'SysProjectPerson',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '项目人员',
      url: 'api/sysProjectPerson',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudSysProjectPerson }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'sysProjectPerson:add'],
        edit: ['admin', 'sysProjectPerson:edit'],
        del: ['admin', 'sysProjectPerson:del']
      },
      rules: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '姓名' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.beforeToCU]() {
      this.form.initialBalance /= 100
    },
    [CRUD.HOOK.beforeSubmit]() {
      this.form.initialBalance = Math.floor(this.form.initialBalance * 100)
    },
    formatCurrency(row, column, num) {
      if (num == null) {
        return 'N/A'
      }
      num = num.toFixed(2) / 100
      const str = num.toString()
      const reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
      return str.replace(reg, '$1,')
    }
  }
}
</script>

<style scoped>

</style>
