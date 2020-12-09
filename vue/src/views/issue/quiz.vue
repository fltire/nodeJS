<template>
  <div class="app-container">
    <el-button style="float:right;margin:20px" type="primary" size="medium" @click="opendialog" >提问</el-button>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column prop="QstsTitle" align="center" label="问题标题" ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="QstDesc" align="center" label="问题详情" ></el-table-column>
      <el-table-column  prop="QstsStatus"  width="200px" align="center" label="问题状态" ></el-table-column>
      <el-table-column width="200px" align="center" label="操作">
          <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="del(scope.row.QstsId)">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="AllCount" :current-page=page @current-change='currentChange'></el-pagination>
    <el-dialog title="提问" :visible.sync="dialogVisible" width="40%" >
      <el-form ref="form" :model="formData" label-width="80px">
        <el-form-item label="问题标题">
          <el-input v-model="formData.QstsTitle" placeholder="问题标题"></el-input>
        </el-form-item>
        <el-form-item label="问题详情">
          <el-input type="textarea" v-model="formData.QstDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='quiz()'>提 问</el-button>
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
      data:{},
      formData:{
          QstsTitle:'',
          QstDesc:''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    del(e){
        this.$confirm('确认删除？')
          .then(_ => {
            let Params = {}
            let send = {}
            Params.url = '/f/userAction/qstDel'
            send.QstsId = e
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
    //   提问
    quiz(){
        let Params = {}
        let send = {}
        Params.url = '/f/userAction/qstAdd'
        send.QstsTitle = this.formData.QstsTitle      
        send.QstDesc = this.formData.QstDesc      
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
            console.log(res.data)
            this.dialogVisible = false
            this.fetchData()
            },(res)=>{
            }
        )
    },
    // 打开查看弹窗
    opendialog(){
        this.dialogVisible = true
        this.formData.QstsTitle = ''
        this.formData.QstDesc = ''
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
        Params.url = '/f/userAction/MyqstQry'
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
        Params.url = 'https://127.0.0.1/fuserAction/MyqstQry'
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
