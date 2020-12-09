<template>
    <div>
        <el-dialog title="新增" :visible.sync="dialogVisible" width="800px" >
        <el-form :model="dataForm" :rules="rules" ref="dataForm"  label-width="100px" class="demo-ruleForm" >
                <el-form-item label="角色名称" prop="roleName" >
                    <el-input v-model="dataForm.roleName" ></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="quanxian">
                    <el-checkbox v-model="checked" @change='checkedChange'>全选/全不选</el-checkbox>
                    <el-tree
                        :data="data"
                        show-checkbox
                        node-key="FunctionId"
                        ref="tree"
                        highlight-current
                        :default-checked-keys='keys'
                        :props="defaultProps"
                        default-expand-all
                        >
                    </el-tree>
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
            data: [],
            defaultProps: {
                children: 'children',
                label: 'FunctionName'
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
    },
    methods: {
        init(data){
            console.log(data)
            this.keys = []
            this.id = null
            this.dialogVisible = true
            this.dataForm.roleName = ''
            let arr = quanxian.Function
            let tree = []
            arr.forEach((item) => {
                if(item.Level===1){
                    tree.push(item)
                    tree[tree.length-1].children = []
                }else if(item.Level===2){
                    tree[tree.length-1].children.push(item)
                }
            })
            this.data = tree
            if(data!==undefined){
                this.id = data.roleId
                this.dataForm.roleName = data.roleName
                let jur = funcMap2List(data.jurisdiction)
                jur.forEach((item) => {
                    if(item.Level===2){
                        this.keys.push(item.FunctionId)
                    }
                })
            }
        },
        checkedChange(e){
            console.log(e)
            if(e===true){
                this.$refs.tree.setCheckedNodes(this.data);
            }else{
                this.$refs.tree.setCheckedKeys([]);
            }
        },
        addOrUpdate(){
            this.$refs.dataForm.validate((valid) => {
                if (valid) {
                    let Params = {},
                        send = {}
                    Params.url = this.id ? '/Servlet/updaterole' : '/Servlet/insertrole'
                    // Params.url = this.id ? '/f/role/uptRole' : '/f/role/addRole'
                    if(this.id){
                        send.roleId = this.id
                    }
                    send.roleName = this.dataForm.roleName
                    send.jurisdiction = List2funcMap(this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()))
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