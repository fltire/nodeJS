<template>
    <div>
        <el-dialog :title="id?'角色修改':'角色新增'" :visible.sync="dialogVisible" width="800px" >
        <el-form :model="dataForm" :rules="rules" ref="dataForm"  label-width="100px" class="demo-ruleForm" >
                <el-form-item label="角色名称" prop="roleName" >
                    <el-input v-model="dataForm.roleName" ></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="quanxian">
                    <el-checkbox v-model="checked" @change='checkedChange'>全选/全不选</el-checkbox>
                    <div style="height:400px;overflow:auto">
                        <el-tree :data="tree" show-checkbox node-key="menu_id" ref="tree" highlight-current :default-checked-keys='keys' :props="defaultProps" default-expand-all></el-tree>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdate()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {sendServer} from  '../../../utils/common'
import quanxian from '../../../utils/quanxian'
import {funcMap2List,List2funcMap} from '../../../utils/qx'
export default {
    data() {
        return {
            dialogVisible: false,
            tree: [],
            defaultProps: {
                children: 'children',
                label: 'menu_name',
                value:'menu_id'
                // label: 'menu_name',
                // value:'menu_id'
            },
            keys:[],
            checked:false,
            id: null,
            dataForm:{
                roleName: '',
            },
             rules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
             }
        };
    },
    mounted () {
        this.rolePermission()
    },
    methods: {
        /**
         * 查询所有权限
         * @method rolePermission
         */
        rolePermission(){
            let Params = {},
                send = {}
            Params.url = '/f/role/rolePermission'
            // Params.url = '/Servlet/insertselectmenu'
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                    if(res.code===0){
                        this.tree = res.data.list
                    }
                },(res)=>{
                }
            )
        },
        /**
         * 初始化
         * @method init
         * @param {object} data 要修改的数据
         */
        init(data){
            this.keys = []
            setTimeout(() => {
                this.$refs.tree.setCheckedKeys([]);
                console.log(1)
            }, 1);
            this.id = null
            this.checked = false
            this.dialogVisible = true
            this.dataForm.roleName = ''
            if(data!==undefined){
                setTimeout(() => {
                    this.id = data.roleId
                    this.dataForm.roleName = data.roleName
                    let Params = {},
                        send = {}
                    Params.url = '/f/role/getRoleById'
                    // Params.url = '/Servlet/selectmenuId '
                    send.roleId = data.roleId
                    Params.send = send
                    sendServer(Params,this).then(
                        (res)=>{
                            console.log(res)
                            if(res.code===0){
                                console.log(2)
                                this.keys = res.data.permissions
                                console.log(this.keys)
                            }
                        },(res)=>{
                        }
                    )
                }, 10);
            }
        },
        /**
         * 全选/全不选
         * @method checkedChange
         * @param {boolean} e 全选/全不选，true全选，false全不选
         */
        checkedChange(e){
            if(e===true){
                console.log(e)
                console.log(this.tree)
                this.$refs.tree.setCheckedNodes(this.tree);
            }else{
                this.$refs.tree.setCheckedKeys([]);
            }
        },
        /**
         * 新增/修改
         * @method addOrUpdate
         */
        addOrUpdate(){
            this.$refs.dataForm.validate((valid) => {
                if (valid) {
                    let Params = {},
                        send = {}
                    // Params.url = this.id ? '/Servlet/updaterole' : '/Servlet/insertrole'
                    Params.url = this.id ? '/f/role/uptRole' : '/f/role/addRole'
                    if(this.id){
                        send.roleId = this.id
                    }
                    send.roleName = this.dataForm.roleName
                    send.permission = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
                    Params.send = send
                    sendServer(Params,this).then(
                        (res)=>{
                            console.log(res)
                            if(res.code===0){
                                this.$emit('getRoleData')
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
                }
            })
        }
    }
};
</script>