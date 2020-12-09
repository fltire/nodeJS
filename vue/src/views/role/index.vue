<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column prop="RolesName" align="center" label="角色名" ></el-table-column>
      <el-table-column prop="RolesDesc" align="center" label="角色描述" ></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="danger" @click="goodsDel(scope.row.GoodsId)">删除</el-button> -->
          <el-button size="mini" @click="goodsAdd(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="AllCount" :current-page=page @current-change='currentChange'></el-pagination>
    <add ref="add"></add>
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
      page:1
    }
  },
  created() {
    this.fetchData()
  },
  components:{
      add
  },
  methods: {
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
            Params.url = '/f/goodsAction/goodsDel'
            send.GoodsId = e
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
        let Params = {}
        let send = {}
        Params.url = '/f/storeAction/roleQry'
        send.page = this.page
        Params.send = send
        let _that = this
        sendServer(Params,this).then(
            (res)=>{
            console.log(res.data)
            _that.list = res.data.RolesList
            _that.AllCount = res.data.AllCount
            _that.listLoading = false
            },(res)=>{
            _that.listLoading = false
            }
        )
    }
  }
}
</script>
