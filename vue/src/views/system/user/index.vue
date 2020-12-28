<template>
    <div class="main">
        <div class="top">
            <el-form :model="dataForm" :inline="true" size="small" label-width="80px" class="demo-ruleForm" style="overflow:hidden">
                <el-form-item label="用户名称" prop="userName" >
                    <el-input v-model="dataForm.userName" clearable placeholder="请输入用户名称"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender" >
                    <el-select clearable v-model="dataForm.gender" placeholder="请选择" style="width:100%">
                        <el-option v-for="item in genderList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone" >
                    <el-input v-model="dataForm.phone" clearable placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="reset">重置</el-button>
                    <el-button @click="getUserData">查询</el-button>
                </el-form-item>
            </el-form>
            <el-button v-if="$isPermissions('user:add')" type="primary" size="mini" icon="el-icon-plus" @click="addOrUpdate()">新增</el-button>
            <el-button v-if="$isPermissions('user:upt')" type="success" size="mini" icon="el-icon-edit-outline" @click="addOrUpdate(multipleSelection[0])" :disabled="multipleSelection.length!==1">修改</el-button>
            <el-button v-if="$isPermissions('user:del')" type="danger" size="mini" icon="el-icon-delete" @click="delUser()" :disabled='multipleSelection.length===0'>删除</el-button>
        </div>
        <el-table v-loading="listLoading" :data="dataList" style="width: 100%" :header-cell-style="{background:'#f8f8f9'}" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="userName" label="用户名称"></el-table-column>
            <el-table-column prop="nickName" label="用户昵称"></el-table-column>
            <el-table-column prop="deptName" label="部门"></el-table-column>
            <el-table-column prop="phone" label="手机号码"></el-table-column>
            <el-table-column prop="userCreate" label="创建时间"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button v-if="$isPermissions('user:upt')&&scope.row.userId!==1" size="mini" type="text" @click="addOrUpdate(scope.row)" ><i class="el-icon-edit-outline"></i>修改</el-button>
                    <el-button v-if="$isPermissions('user:del')&&scope.row.userId!==1" size="mini" type="text" @click="delUser(scope.row.userId)"><i class="el-icon-delete"></i>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next"
            :total="count"
            @current-change=currentChange>
        </el-pagination>
        <add-or-update ref="aou" @getUserData="getUserData"></add-or-update>
    </div>
</template>
<script>
import {sendServer} from  '../../../utils/common'
import addOrUpdate from './addOrUpdate'
export default {
    data() {
        return {
            dataList: [],
            dataForm: {
                userName: '',
                gender: '',
                phone: ''
            },
            genderList: [
                {value: '0',label: '女'},
                {value: '1',label: '男'}
            ],
            multipleSelection: [],
            count: null,
            page: 1,
            listLoading: false
        }
    },
    mounted () {
        this.getUserData()
    },
    components: {
        addOrUpdate
    },
    methods: {
        /**
         * 获取用户列表
         * @method getUserData
         */
        getUserData(){
            if(this.$isPermissions('user:query')){
                let Params = {},
                    send = {}
                this.listLoading = true
                // Params.url = '/Servlet/userselect'
                Params.url = '/f/user/getUserData'
                send.page = this.page
                send.userName = this.dataForm.userName
                send.gender = this.dataForm.gender
                send.phone = this.dataForm.phone
                Params.send = send
                sendServer(Params,this).then(
                    (res)=>{
                        console.log(res)
                        if(res.code===0){
                            this.dataList = res.data.list
                            this.count = res.data.count
                            this.listLoading = false
                        }
                    },(res)=>{
                    }
                )
            }
        },
        /**
         * 清空条件查询，并刷新数据
         */
        reset(){
            this.dataForm.userName = ''
            this.dataForm.gender = ''
            this.dataForm.phone = ''
            this.getUserData()
        },
        /**
         * 新增或修改
         * @method addOrUpdate
         * @param {object} data 需要修改的数据
         */
        addOrUpdate(data){
            console.log(data)
            this.$refs.aou.init(data)
        },
        /**
         * 多选
         * @method handleSelectionChange
         * @param {array} val 选中的数据集合
         */
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        /**
         * 分页点击事件
         * @method currenChange
         * @param {number} e 点击的分页，要跳转到的页码
         */
        currentChange(e){
            console.log(e)
            if(this.page!==e){
                this.page=e
                this.getUserData()
            }
        },
        /**
         * 删除
         * @method delUser
         * @param {number} id 点击行删除时要删除的数据的id
         */
        delUser(id){
            console.log(id)
            let arr = id? [id] : this.multipleSelection.map(item => item.userId)
            console.log(arr)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let Params = {},
                    send = {}
                Params.url = '/f/user/delUser'
                // Params.url = '/Servlet/deleteuser'
                send.ids = arr
                Params.send = send
                sendServer(Params,this).then(
                    (res)=>{
                        console.log(res)
                        if(res.code===0){
                            this.getUserData()
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    },(res)=>{
                    }
                )
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });

        }
    }
}
</script>
<style scoped>
.main{
    padding:20px;
}
</style>