<template>
  <div class="app-container">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column prop="UsersName" align="center" label="姓名" ></el-table-column>
        <el-table-column prop="UsersUserMobile" align="center" label="手机号" ></el-table-column>
        <el-table-column prop="UsersAddr" align="center" label="地址" ></el-table-column>
        <el-table-column prop="UsersStatus" align="center" label="状态" ></el-table-column>
        <el-table-column prop="UsersStoreEntryDate" align="center" label="入职时间" ></el-table-column>
        <el-table-column prop="UsersStoreLeaveDate" align="center" label="离职时间" ></el-table-column>
        <el-table-column width="200px" align="center" label="操作">
            <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="goodsDel(scope.row.UsersUserId)">删除</el-button>
                <el-button size="mini" @click="goodsAdd(scope.row)">修改</el-button>
            </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :total="AllCount" :current-page=page @current-change='currentChange'></el-pagination>
      <add ref="add" @AddorUpdate='AddorUpdate'></add>
  </div>
</template>
<script>
import {sendServer} from '../../utils/common'
import add from './add'
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      AllCount:null,
      page:1,
      formData:{
        UsersStatus:''
      },
      Status:[
          {name:'在职',value:'1'},
          {name:'离职',value:'2'}
      ],
    }
  },
  created() {
    this.fetchData()
  },
  components:{
      add
  },
  methods: {
      AddorUpdate(){
        this.page = 1
        this.fetchData()
      },
    // 新增
    goodsAdd(e){
        this.$refs.add.init(e)
    },
    //删除
    goodsDel(e){
        this.$confirm('确认删除？')
          .then(_ => {
            console.log(e)
            let Params = {}
            let send = {}
            Params.url = '/f/storeAction/operDel'
            send.UsersUserId = e
            Params.send = send
            let _that = this
            sendServer(Params,this).then(
                (res)=>{
                console.log(res.data)
                this.$message({
                    message: res.data,
                    type: 'success'
                });
                _that.fetchData()
                },(res)=>{
                }
            )
          })
          .catch(_ => {});
    },
    //分页
    currentChange(e){
        this.page = e
        this.fetchData()
    },
    //列表
    fetchData() {
        this.listLoading = true
        let Params = {},
            send = {}
        Params.url = '/Servlet/select'
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
                console.log(res)
                if(res.code===0){
                  this.listLoading = false
                }
            },(res)=>{
            }
        )
    }
  }
}
</script>
