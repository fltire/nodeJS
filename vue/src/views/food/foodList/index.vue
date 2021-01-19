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
        <el-form-item>
          <el-button @click="reset">重置</el-button>
          <el-button @click="fetchData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" :header-cell-style="{background:'#f8f8f9'}" element-loading-text="Loading">
      <el-table-column prop="foodName" align="center"  label="食品名称" ></el-table-column>
      <el-table-column prop="foodPrice" align="center" label="食品价格"></el-table-column>
      <el-table-column prop="foodClassify" align="center" width="80" label="食品类型" ></el-table-column>
      <el-table-column prop="foodAmount" align="center" width="80" label="食品数量" ></el-table-column>
      <el-table-column prop="dept" align="center" width="80" label="食品部门" ></el-table-column>
      <el-table-column prop="foodCreate" align="center" label="食品新增时间"></el-table-column>
      <el-table-column prop="foodModified" align="center" label="食品修改时间"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="$isPermissions('foodList:update')" size="mini" type="text" @click="update(scope.row)"><i class="el-icon-edit"></i>修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="AllCount" :current-page=page @current-change='currentChange'></el-pagination>
    <update ref="upt" @fetchData='fetchData'></update>
  </div>
</template>
<script>
import {sendServer} from '../../../utils/common'
import update from './update'
export default {
  components: { update },
  data() {
    return {
      list: null,
      listLoading: false,
      AllCount:null,
      page:1,
      dataForm:{
          foodName:'',
          foodClassify:'',
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
    update(e){
      this.$nextTick(()=>{
            this.$refs.upt.init(e)
        })
    },
    /**
     * 分页
     * @method currentChange
     * @param {number} e 跳转到的页数
     */
    currentChange(e){
        this.page = e
        this.fetchData()
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
    /**
     * 清空条件查询，并刷新数据
     */
    reset(){
      this.dataForm.foodName = ''
      this.dataForm.foodClassify = ''
      this.fetchData()
    },
    fetchData() {
        this.listLoading = true
        let Params = {}
        let send = {}
        Params.url = '/f/food/foodList/list'
        send.page = this.page
        send.foodName = this.dataForm.foodName
        send.foodClassify = this.dataForm.foodClassify
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
