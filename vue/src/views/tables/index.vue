<template>
  <div class="app-container">
      <el-button style="float:right;margin:20px" type="primary" size="medium" @click="opendialog">新增桌台</el-button>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column prop="TableTableName" align="center" label="桌台名称" ></el-table-column>
      <el-table-column prop="TableAddDate" align="center" label="新增时间" ></el-table-column>
      <el-table-column prop="TableStatus" align="center" label="桌台状态" ></el-table-column>
      <el-table-column prop="TableUseStatus" align="center" label="桌台标签" ></el-table-column>
      <el-table-column width="200px" align="center" label="操作">
          <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="Del(scope.row)">删除</el-button>
              <el-button size="mini" @click="stop(scope.row)">{{scope.row.TableStatus=='正常'?'停用':'使用'}}</el-button>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="AllCount" :current-page=page @current-change='currentChange'></el-pagination>
    <el-dialog title="新增桌台" :visible.sync="dialogVisible" width="40%" >
        <el-form ref="form"  label-width="80px">
            <el-form-item label="桌台名称">
                <el-input v-model="name" placeholder="桌台名称"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="add">确 定</el-button>
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
      name:''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 打开新增弹窗
    opendialog(e){
        this.dialogVisible = true
        this.name = ''
    },
    // 新增
    add(){
        let Params = {}
        let send = {}
        Params.url = '/f/restAction/tableAdd'
        send.name = this.name
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
            console.log(res.data)
            this.$message({
                message: res.data,
                type: 'success'
            });
            this.dialogVisible = false
            this.fetchData()
            },(res)=>{
            }
        )
    },
    //分页
    currentChange(e){
        this.page = e
        this.fetchData()
    },
    // 桌台停用
    stop(e){
        if(e.TableUseStatus==='使用中'){
            this.$message({
                message: '该桌台正在有人使用，无法停用',
                type: 'warning'
            });
            return
        }
        let Params = {}
        let send = {}
        Params.url = '/f/restAction/tableStop'
        send.id = e.id
        send.TableStatus = e.TableStatus=='正常'?'已停用':'正常'
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
            console.log(res.data)
            this.$message({
                message: res.data,
                type: 'success'
            });
            this.fetchData()
            },(res)=>{
            }
        )
    },
    // 桌台删除
    Del(e){
        if(e.TableUseStatus==='使用中'){
            this.$message({
                message: '该桌台正在有人使用，无法删除',
                type: 'error'
            });
            return
        }
        let Params = {}
        let send = {}
        Params.url = '/f/restAction/tableDel'
        send.id = e.id
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
            console.log(res.data)
            this.$message({
                message: res.data,
                type: 'success'
            });
            this.fetchData()
            },(res)=>{
            }
        )
    },
    //列表
    fetchData() {
        this.listLoading = true
        let Params = {}
        let send = {}
        Params.url = '/f/restAction/tableSync'
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
