<template>
<div>
    <el-dialog title="新增员工" :visible.sync="dialogVisible" width="50%">
        <el-form ref="form" :model="formData" label-width="80px">
            <el-form-item label="姓名">
                <el-input v-model="formData.UsersName" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="formData.UsersUserMobile" placeholder="电话"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select  ref="Status" v-model="formData.UsersStatus" placeholder="状态" style="width:100%">
                    <el-option v-for="item in Status" :label="item.name" :value="item.name" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色">
                <el-select  ref="Status" v-model="formData.role" placeholder="状态" style="width:100%">
                    <el-option v-for="item in roles" :label="item.name" :value="item.name" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="formData.UsersAddr" placeholder="地址"></el-input>
            </el-form-item>
            <el-form-item label="入职时间">
                <el-date-picker style="width:100%" value-format="yyyy-MM-dd" v-model="formData.UsersStoreEntryDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="离职时间">
                <el-date-picker style="width:100%" value-format="yyyy-MM-dd" v-model="formData.UsersStoreLeaveDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="AddorUpdate">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
import {sendServer} from '../../utils/common'
  export default {
    data() {
      return {
        dialogVisible: false,
        id:null,
        formData:{
            UsersUserMobile:'',
            UsersName:'',
            UsersAddr:'',
            UsersStatus:'',
            UsersStatusid:'',
            UsersStoreEntryDate:'',
            UsersStoreLeaveDate:'',
            role:''
        },
        Status:[
            {name:'在职',value:'1'},
            {name:'离职',value:'2'}
        ],
        roles:[
            {name:'管理员',value:'1'}
        ]
      };
    },
    methods: {
      init(e){
        this.dialogVisible = true
        this.formData.UsersUserMobile = ''
        this.formData.UsersName = ''
        this.formData.UsersAddr = ''
        this.formData.UsersStatus = ''
        this.formData.UsersStatusid = ''
        this.formData.UsersStoreEntryDate = ''
        this.formData.UsersStoreLeaveDate = ''
        this.formData.role = ''
        this.id=null
        if(e){
            this.id=e.UsersUserId
            this.formData.UsersUserMobile = e.UsersUserMobile
            this.formData.UsersName = e.UsersName
            this.formData.UsersAddr = e.UsersAddr
            this.formData.UsersStatus = e.UsersStatus
            this.formData.UsersStatusid = e.UsersStatusid
            this.formData.UsersStoreEntryDate = e.UsersStoreEntryDate
            this.formData.UsersStoreLeaveDate = e.UsersStoreLeaveDate
            this.formData.role = e.role
        }
      },
      AddorUpdate(){
          console.log(this.formData)
        let Params = {}
        let send =this.formData
        Params.url =this.id?'/f/storeAction/operRolesUpt':'/f/storeAction/operAdd'
        if(this.id){
            send.UsersUserId = this.id
        }
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
                console.log(res.data)
                this.$message({
                    message: res.data,
                    type: 'success'
                });
                let p=[]
                this.dialogVisible = false
                this.$emit('AddorUpdate')
            },(res)=>{
            }
        )
      }
    }
  };
</script>