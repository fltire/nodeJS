<template>
    <div>
        <div class="left">
            <el-card class="box-card " header="个人信息" style="width:100%">
                <div style="overflow:hidden;text-align:center">
                    <el-upload
                        class="img-p"
                        ref='upload'
                        :auto-upload='false' 
                        :multiple='false'
                        :limit="1"
                        accept="image/jpeg,image/gif,image/png"
                        action=''
                        :show-file-list='false'
                        :on-change='uploadFiles'
                        >
                        <img v-if="imageUrl" :src="imageUrl" title="点击修改头像" class="avatar img">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <div class="left-item"><svg-icon icon-class="user"></svg-icon> 用户昵称<span class="left-span">{{data.nickName}}</span></div>
                <div class="left-item"><svg-icon icon-class="phone"></svg-icon> 手机号码<span class="left-span">{{data.phone}}</span></div>
                <div class="left-item"><svg-icon icon-class="tree"></svg-icon> 所属部门<span class="left-span">{{data.dept}}</span></div>
                <div class="left-item"><svg-icon icon-class="peoples"></svg-icon> 所属角色<span class="left-span">{{data.role}}</span></div>
                <div class="left-item"><svg-icon icon-class="date"></svg-icon> 创建日期<span class="left-span">{{data.userCreate}}</span></div>
            </el-card>
        </div>
        <div class="right">
            <el-card class="box-card" header="基本资料" style="width:100%">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="基本资料" name="基本资料">
                        <el-form :model="dataForm" ref="dataForm" :rules="rules" label-width="100px" class="demo-ruleForm" style="overflow:hidden">
                            <el-form-item label="用户昵称" prop="nickName" >
                                <el-input v-model="dataForm.nickName" ></el-input>
                            </el-form-item>
                            <el-form-item label="手机号码" prop="phone" >
                                <el-input v-model="dataForm.phone" ></el-input>
                            </el-form-item>
                            <el-form-item label="性别" prop="gender" >
                                <el-select v-model="dataForm.gender" placeholder="请选择" style="width:100%">
                                    <el-option v-for="item in genderList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item >
                                <el-button type="primary" size="small" @click="update()">保存</el-button>
                                <el-button size="small" @click="reset()">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="修改密码" name="修改密码">
                        <el-form :model="psdForm" ref="psdForm" :rules="psdrules" label-width="100px" class="demo-ruleForm" style="overflow:hidden">
                            <el-form-item label="旧密码" prop="oldpsd" >
                                <el-input v-model="psdForm.oldpsd" show-password clearable></el-input>
                            </el-form-item>
                            <el-form-item label="新密码" prop="newpsd1" >
                                <el-input v-model="psdForm.newpsd1" show-password clearable></el-input>
                            </el-form-item>
                            <el-form-item label="确认密码" prop="newpsd2" >
                                <el-input v-model="psdForm.newpsd2" show-password clearable></el-input>
                            </el-form-item>
                            <el-form-item >
                                <el-button type="primary" size="small" @click="uptpsd()">保存</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>

        <!-- <el-button @click='uploadFiles' size="mini" type="primary">点击上传</el-button> -->
        <!-- <el-upload
            ref='upload'
            :auto-upload='false' 
            :file-list="fileList" 
            :multiple='false'
            :limit="1"
            :on-exceed="handleExceed"
            :http-request="uploadFiles" 
            accept="image/jpeg,image/gif,image/png"
            action=''
            :on-change='changeUpload'           
            >
            <el-button slot="trigger" size="mini" type="primary">选取图片</el-button>
            <el-button @click='uploadFiles' size="mini" type="primary">点击上传</el-button>
        </el-upload>     -->

    </div>
</template>
<script>
import {sendServer} from '../../utils/common';
import {isPhone} from '../../utils/util';
import Cookies from "js-cookie";
import Axios from 'axios';
export default {
    data () {
        return {
            userId: null,
            data : "",
            img:'',
            activeName:'基本资料',
            imageUrl: '',
            dataForm:{
                nickName:'',
                phone:'',
                gender:''
            },
            psdForm:{
                oldpsd:'',
                newpsd1:'',
                newpsd2:''
            },
            genderList: [
                {value: '0',label: '女'},
                {value: '1',label: '男'}
            ],
            rules: {
                nickName: [
                    { required: true, message: '请输入用户昵称', trigger: 'blur' }
                ],
                phone: [
                    {required: true, message: '请输入11位手机号', trigger: 'blur'},
                    { validator: isPhone, trigger: 'blur' }
                ],
                gender: [
                    { required: true, message: '请选择性别', trigger: 'blur' }
                ]
            },
            psdrules:{
                oldpsd: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' }
                ],
                newpsd1: [
                    { required: true, message: '请输入新密码', trigger: 'blur' }
                ],
                newpsd2: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { validator: this.verifypsd, trigger: 'blur' }
                ],
            }
        }
    },
    mounted () {
        this.userId = JSON.parse(localStorage.getItem("userdata")).userId
        this.details()
    },
    methods: {
        //点击上传图片,上传成功返回图片路径 
        uploadFiles(){
            console.log(123)
            var That=this;
            let file=this.$refs.upload.$refs['upload-inner'].$refs.input; //获取文件数据
            let fileList=file.files;      
            var imgFile;
            let reader = new FileReader();     //html5读文件 
            reader.readAsDataURL(fileList[0]); //转BASE64       
            console.log(reader)
            reader.onload = function(e){
                Axios({
                    method: 'post',
                    url:process.env.VUE_APP_BASE_API+'/upload',
                    data: {
                        imgData:e.target.result,
                        userId:That.userId
                    }
                }).then((res)=>{
                    console.log(res.data)
                    That.imageUrl = 'http://127.0.0.1:8083/'+res.data.img
                    // That.imageUrl = 'http://192.168.0.79:8083/'+res.data.img
                    That.$refs.upload.clearFiles()
                })
            }
        },
        /**
         * 获取用户详细信息
         * @method details
         */
        details(){
            let Params = {},
                send = {}
            Params.url = '/f/my/details'
            send.userId = this.userId
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                    console.log(res)
                    if(res.code===0){
                        this.data = res.data
                        this.dataForm.nickName = res.data.nickName
                        this.dataForm.phone = res.data.phone
                        this.dataForm.gender = res.data.gender
                        this.imageUrl = 'http://127.0.0.1:8083/'+res.data.img
                        // this.imageUrl = 'http://192.168.0.79:8083/'+res.data.img
                        this.img = res.data.img
                    }
                },(res)=>{
                }
            )
        },
        /**
         * 重置用户基本信息
         * @method reset
         */
        reset(){
            this.dataForm.nickName = this.data.nickName
            this.dataForm.phone = this.data.phone
            this.dataForm.gender = this.data.gender
        },
        /**
         * 修改用户基本信息
         * @method update
         */
        update(){
            this.$refs.dataForm.validate((valid) => {
                if (valid) {
                    let Params = {},
                        send = {}
                    Params.url = '/f/my/myUptData'
                    send.userId = this.userId
                    send.nickName = this.dataForm.nickName
                    send.phone = this.dataForm.phone
                    send.gender = this.dataForm.gender
                    Params.send = send
                    sendServer(Params,this).then(
                        (res)=>{
                            console.log(res)
                            if(res.code===0){
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                                this.details()
                            }
                        },(res)=>{
                        }
                    )
                }else{
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        /**
         * 验证两次输入的新密码相不相同
         * @method verifypsd
         */
        verifypsd(rule, value, callback){
            if (this.psdForm.newpsd1===this.psdForm.newpsd2) {
                return callback()
            }else{
                return callback(new Error('两次密码不一致'))
            }
        },
        /**
         * 修改密码
         * @method uptpsd
         */
        uptpsd(){
            this.$refs.psdForm.validate((valid) => {
                if (valid) {
                    let Params = {},
                        send = {}
                    Params.url = '/f/my/uptpsd'
                    send.userId = this.userId
                    send.oldpsd = this.psdForm.oldpsd
                    send.newpsd = this.psdForm.newpsd2
                    Params.send = send
                    sendServer(Params,this).then(
                        (res)=>{
                            console.log(res)
                            if(res.code===0){
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                                this.logout()
                            }else{
                                this.$message({
                                    message: res.msg,
                                    type: 'error'
                                });
                            }
                        },(res)=>{
                        }
                    )
                }else{
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        /**
         * 登出，清除token
         * @method logout
         */
        logout() {
            let Params = {},
                send = {}
            Params.url = '/f/logout'
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                Cookies.remove('token');
                window.localStorage.clear()
                localStorage.removeItem('rou')
                localStorage.removeItem('userdata')
                localStorage.removeItem('jurisdiction')
                this.$router.push(`/login?redirect=${this.$route.fullPath}`)
                },(res)=>{
                }
            )
        }

    }
}
</script>
<style >
/* .img-p .el-upload{
        display: block;
    text-align: center;
    cursor: pointer;
    outline: 0;
    margin: 0 auto;
    
}
.img-p .el-upload:hover{
    background: chartreuse;
} */
</style>
<style scoped>

.left{
    float: left;
    width: 40%;
    padding: 20px;
}
.left-item{
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    border-bottom: 1px solid #EBEEF5;
}
.left-span{
    float: right;
}
.right{
    float: left;
    width: 60%;
    padding:20px 20px 20px 0;
}
.img{
    width: 100px;
    border-radius: 100px;
    display: block;
    margin: 10px auto 20px;
}

</style>