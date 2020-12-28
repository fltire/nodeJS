<template>
    <div class="main">
        <div class="top">
            <el-button v-if="$isPermissions('role:add')" type="primary" size="mini" icon="el-icon-plus" @click="addOrUpdate()">新增</el-button>
            <el-button v-if="$isPermissions('role:upt')" type="success" size="mini" icon="el-icon-edit-outline" @click="addOrUpdate(multipleSelection[0])" :disabled="multipleSelection.length!==1">修改</el-button>
            <el-button v-if="$isPermissions('role:del')" type="danger" size="mini" icon="el-icon-delete" @click="delRole()" :disabled='multipleSelection.length===0'>删除</el-button>
        </div>
        <el-table v-loading="listLoading" :data="dataList" style="width: 100%" :header-cell-style="{background:'#f8f8f9'}" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="roleCreate" label="创建时间"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" v-if="$isPermissions('role:upt')" @click="addOrUpdate(scope.row)" ><i class="el-icon-edit-outline"></i>修改</el-button>
                    <el-button size="mini" type="text" v-if="$isPermissions('role:del')&&scope.row.roleId!='1'" @click="delRole(scope.row.roleId)"><i class="el-icon-delete"></i>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next"
            :total="count"
            @current-change=currentChange>
        </el-pagination>


        <add-or-update ref="aou" @getRoleData="getRoleData"></add-or-update>
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
                username: '',
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
        this.getRoleData()

    },
    components: {
        addOrUpdate
    },
    methods: {
        /**
         * 获取角色列表
         * @method getRoleData
         */
        getRoleData(){
            if(this.$isPermissions('role:query')){
                let Params = {},
                    send = {}
                this.listLoading = true
                // Params.url = '/Servlet/selectpagerole'
                Params.url = '/f/role/getRoleData'
                send.page = this.page
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
         * 新增或修改
         * @method addOrUpdate
         * @param {object} data 需要修改的数据
         */
        addOrUpdate(data){
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
                this.getRoleData()
            }
        },
        /**
         * 删除
         * @method delRole
         * @param {number} id 要删除的id
         */
        delRole(id){
            console.log(id)
            let arr = id? [id] : this.multipleSelection.map(item => {
                console.log(item)
                return item.roleId
            })
            console.log(arr)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let Params = {},
                    send = {}
                Params.url = '/f/role/delRole'
                // Params.url = '/Servlet/deleterole'
                send.ids = arr
                Params.send = send
                sendServer(Params,this).then(
                    (res)=>{
                        console.log(res)
                        if(res.code===0){
                            this.getRoleData()
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.msg
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