<template>
  <div class="app-container">
    <div>
      <el-form :model="dataForm" :inline="true" size="small" label-width="80px" class="demo-ruleForm" style="overflow:hidden">
        <el-form-item label="食品名称">
          <el-input v-model="dataForm.foodName" clearable placeholder="请输入食品名称"></el-input>
        </el-form-item>
        <el-form-item label="食品类型">
            <el-select  ref="types" v-model="dataForm.foodClassify" placeholder="食品类型" style="width:100%">
                <el-option v-for="item in foodClassifys" :label="item.name" :value="item.value" :key="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select ref="types" v-model="dataForm.auditStatus" placeholder="审核状态" style="width:100%">
            <el-option v-for="item in auditStatus" :label="item" :value="item" :key="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
          <el-button @click="fetchData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="padding-bottom:20px">
      <el-button v-if="$isPermissions('foodAudit:add')" type="primary" size="mini" icon="el-icon-plus" @click="AddorUpdate()">新增</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" :header-cell-style="{background:'#f8f8f9'}" element-loading-text="Loading">
      <el-table-column prop="foodName" align="center"  label="食品名称" ></el-table-column>
      <el-table-column prop="foodClassify" align="center" width="80" label="食品类型" ></el-table-column>
      <el-table-column prop="foodAmount" align="center" width="80" label="食品数量" ></el-table-column>
      <el-table-column prop="dept" align="center" width="80" label="食品部门" ></el-table-column>
      <el-table-column prop="auditStatus" align="center" width="80" label="审核状态"></el-table-column>
      <el-table-column prop="foodCreate" align="center" label="食品入库时间"></el-table-column>
      <el-table-column prop="addStaff" align="center" label="食品入库人员"></el-table-column>
      <el-table-column prop="foodAudit" align="center" label="食品审核时间"></el-table-column>
      <el-table-column prop="verifier" align="center" label="食品审核人员"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="$isPermissions('foodAudit:update')&&scope.row.auditStatus==='不通过'" size="mini" type="text" @click="AddorUpdate(scope.row)"><i class="el-icon-edit"></i>修改</el-button>
          <el-button v-if="$isPermissions('foodAudit:audit')&&scope.row.auditStatus==='未审核'" size="mini" type="text" @click="audit(scope.row)"><i class="el-icon-coordinate"></i>审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="AllCount" :current-page=page @current-change='currentChange'></el-pagination>
    <add-or-update ref="aou" @AddorUpdate='refreshList'></add-or-update>
    <audit ref="audit" @AddorUpdate='refreshList'></audit>
  </div>
</template>
<script>
import {sendServer} from '../../../utils/common'
import addOrUpdate from './addOrUpdate.vue'
import audit from './audit'
export default {
  components: { addOrUpdate,audit },
  data() {
    return {
      list: null,
      listLoading: false,
      AllCount:null,
      page:1,
      auditStatus:['未审核','通过','不通过'],
      dataForm:{
          foodName:'',
          foodClassify:'',
          auditStatus:''
      },
      foodClassifys:[]
    }
  },

  created() {
  },
  mounted () {
   this.fetchData()
   this.foodClassify()
  },
  methods: {
    /**
     * 分页
     * @method currentChange
     * @param {number} e 跳转到的页数
     */
    currentChange(e){
        this.page = e
        this.fetchData()
    },
    AddorUpdate(e){
        this.$nextTick(()=>{
            this.$refs.aou.init(e)
        })
    },
    foodClassify(){
        let Params = {},
            send = {}
        Params.url = '/f/food/foodClassify'
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
                console.log(res)
                if(res.code===0){
                    this.foodClassifys = res.list
                }
            }
        )
    },
    audit(e){
        this.$nextTick(()=>{
            this.$refs.audit.init(e)
        })
    },
    /**
     * 清空条件查询，并刷新数据
     */
    reset(){
      this.dataForm.foodName = ''
      this.dataForm.foodClassify = ''
      this.dataForm.auditStatus = ''
      this.fetchData()
    },
    /**
     * 新增/修改时刷新列表
     */
    refreshList(){
        this.page = 1
        this.fetchData()
    },
    fetchData() {
        this.listLoading = true
        let Params = {}
        let send = {}
        Params.url = '/f/food/foodAudit/list'
        send.page = this.page
        send.foodName = this.dataForm.foodName
        send.foodClassify = this.dataForm.foodClassify
        send.auditStatus = this.dataForm.auditStatus
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
              console.log(res)
              if(res.code===0){
                this.list = res.data.list
                this.AllCount = res.data.AllCount
              }
              this.listLoading = false
            },(res)=>{
              this.listLoading = false
            }
        )
    }
  }
}
</script>
