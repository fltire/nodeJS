<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column prop="QstsTitle" align="center" label="问题标题" ></el-table-column>
      <el-table-column  width="200px" align="center" label="问题状态" >
        <template slot-scope="scope">
            {{scope.row.status==1?'已解决':"未解决"}}
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="操作">
          <template slot-scope="scope">
              <el-button size="mini" @click="look(scope.row)">查看</el-button>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="AllCount" :current-page=page @current-change='currentChange'></el-pagination>
    <el-dialog title="问题详情" :visible.sync="dialogVisible" width="40%">
        <div>{{data.QstsTitle}}</div>
        <div>{{data.QstDesc}}</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click='solve()'>解 决</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import {sendServer} from '../../utils/common'
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      AllCount:null,
      page:1,
      dialogVisible:false,
      data:{}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 打开查看弹窗
    opendialog(){
        this.dialogVisible = true
    },
    //分页
    currentChange(e){
        this.page = e
        this.fetchData()
    },
    //解决
    solve(){
        if(this.data.status==1){
            this.dialogVisible = false
            return
        }
        let Params = {}
        let send = {}
        Params.url = '/f/userAction/jiejue'
        send.QstsId = this.data.QstsId
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
            console.log(res.data)
            this.fetchData()
            this.dialogVisible = false
            },(res)=>{
            }
        )
    },
    // 查看
    look(e){
        this.data = e
        let Params = {}
        let send = {}
        Params.url = '/f/userAction/qstIdQry'
        send.QstsId = e.QstsId
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
            console.log(res.data)
            this.fetchData()
            this.opendialog()
            },(res)=>{
            }
        )
    },
    //列表
    fetchData() {
        this.listLoading = true
        let Params = {}
        let send = {}
        Params.url = '/f/userAction/qstQry'
        send.page = this.page
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
            console.log(res.data)
            this.list = res.data.list
            this.AllCount = res.data.AllCount
            this.listLoading = false
            },(res)=>{
            this.listLoading = false
            }
        )
    }
  }
}
</script>
