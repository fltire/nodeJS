<template>
    <div>
        <el-dialog title="新增" :visible.sync="dialogVisible" width="800px" >
           <el-form :model="dataForm" ref="dataForm" :rules="rules" label-width="100px" class="demo-ruleForm" style="overflow:hidden">
                <el-form-item label="用户名称" prop="username" style="width:50%;float:left">
                    <el-input v-model="dataForm.userName" ></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="nickname" style="width:50%;float:left">
                    <el-input v-model="dataForm.nickName" ></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone" style="width:50%;float:left">
                    <el-input v-model="dataForm.phone" ></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender" style="width:50%;float:left">
                    <el-select v-model="dataForm.gender" placeholder="请选择" style="width:100%">
                        <el-option v-for="item in genderList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色" prop="role" style="float:left;width:100%" >
                    <el-select v-model="dataForm.roleId" placeholder="请选择" style="width:100%">
                        <el-option v-for="item in roleList" :key="item.roleName" :label="item.roleName" :value="item.roleId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark" style="float:left;width:100%">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="dataForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdate('dataForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {sendServer} from  '../../../utils/common'
import {isPhone} from '../../../utils/util';
export default {
    data() {
        return {
            dialogVisible: false,
            dataForm: {
                userName: '',
                nickName: '',
                phone: '',
                gender: '',
                remark: '',
                roleId: null
            },
            id: '',
            roleList: [],
            genderList: [
                {value: '0',label: '女'},
                {value: '1',label: '男'}
            ],
            rules: {
                userName: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' }
                ],
                nickName: [
                    { required: true, message: '请输入用户昵称', trigger: 'blur' }
                ],
                phone: [
                    {required: true, message: '请输入11位手机号', trigger: 'blur'},
                    { validator: isPhone, trigger: 'blur' }
                ],
                gender: [
                    { required: true, message: '请选择性别', trigger: 'blur' }
                ],
                roleId:[
                    { required: true, message: '请选择角色', trigger: 'blur' }
                ]
            },
        };
    },
    methods: {
        /**
         * 初始化数据
         * @method init 
         * @param {object} data 要修改的数据
         */
        init(data=''){
            this.dialogVisible = true
            this.dataForm.userName = ''
            this.dataForm.nickName = ''
            this.dataForm.phone = ''
            this.dataForm.gender = null
            this.dataForm.remark = ''
            this.dataForm.roleId = null
            this.getRole()
            // this.$refs.dataForm.resetFields();
            this.id = ''
            if(data!==''){
                this.id = data.userId
                this.dataForm.userName = data.userName
                this.dataForm.nickName = data.nickName
                this.dataForm.phone = data.phone
                this.dataForm.gender = data.gender
                this.dataForm.remark = data.remark
                this.dataForm.roleId = data.roleId
            }
        },
        getRole(){
            let Params = {},
                send = {}
            Params.url = '/Servlet/roleselect'
            // Params.url = '/f/user/getRoleList'
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                    console.log(res)
                    if(res.code===0){
                        this.roleList = res.data.list
                    }
                }
            )
        },
        /**
         * 新增或修改
         * @method addOrUpdate
         * @param {string} dataForm 表单实例
         */
        addOrUpdate(dataForm){
            this.$refs[dataForm].validate((valid) => {
                if (valid) {
                    let Params = {},
                        send = {}
                    // Params.url = this.id ? '/f/user/uptUser' : '/f/user/addUser'
                    Params.url = this.id ? '/Servlet/updateUser' : '/Servlet/insertUser'
                    if(this.id){
                        send.userId = this.id
                    }
                    send.userName = this.dataForm.userName
                    send.nickName = this.dataForm.nickName
                    send.phone = this.dataForm.phone
                    send.gender = this.dataForm.gender
                    send.roleId = this.dataForm.roleId
                    send.remark = this.dataForm.remark||''
                    Params.send = send
                    sendServer(Params,this).then(
                        (res)=>{
                            console.log(res)
                            if(res.code===0){
                                this.$emit('getUserData')
                                this.dialogVisible = false
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                            }else{
                                this.$message({
                                    message: res.msg,
                                    type: 'error'
                                });
                            }
                        },(res)=>{
                        }
                    )
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        }
    }
};
</script>