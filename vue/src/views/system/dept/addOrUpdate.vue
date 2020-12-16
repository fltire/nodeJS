<template>
    <div>
        <el-dialog :title="id?'修改':'新增'" :visible.sync="dialogVisible" width="800px" >
        <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="100px" class="menuForm demo-ruleForm" style="overflow:hidden">
            <el-form-item label="上级部门" prop="parentId" style="width:50%;float:left">
                <el-cascader :key="isResouceShow" :options="options" v-model="dataForm.parentId" filterable :show-all-levels='false' :props="props" clearable style="width:100%"></el-cascader>
            </el-form-item>
            <el-form-item label="部门名称" prop="deptName" style="width:50%;float:left">
                <el-input v-model="dataForm.deptName" ></el-input>
            </el-form-item>
            <el-form-item label="显示顺序" prop="orderNum" style="width:50%;float:left">
                <el-input-number v-model="dataForm.orderNum" :min="0" :max="100" label="描述文字"></el-input-number>
            </el-form-item>
            <el-form-item label="负责人" prop="leader" style="width:50%;float:left">
                <el-input v-model="dataForm.leader" ></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone" style="width:50%;float:left">
                <el-input v-model="dataForm.phone" ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" style="width:50%;float:left">
                <el-input v-model="dataForm.email" ></el-input>
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
export default {
    data() {
        return {
            isResouceShow:1,
            id:'',
            dialogVisible: false,
            dataForm:{
                parentId:'',
                deptName: '',
                orderNum:1,
                leader: '',
                phone: '',
                email:'',
            },
            options:[{
                deptId:0,
                deptName:'总公司',
                children:[]
            }],
            rules: {
                parentId: [
                    { required: true, message: '请选择上级部门', trigger: 'change' }
                ],
                component: [
                    { required: true, message: '请输入组件路径', trigger: 'blur' }
                ],
            },
            props:{ 
                checkStrictly: true,
                value: 'deptId',
                label: 'deptName'
            }
           
        }
    },
    mounted () {
        
    },
    methods: {
        /**
         * 遍历返回树
         * @method handleTree
         * @param {array} data 数据
         */
        handleTree(data, id, parentId, children, rootId) {
            id = id || 'deptId'
            parentId = parentId || 'parentId'
            children = children || 'children'
            rootId = rootId || Math.min.apply(Math, data.map(item => { return item[parentId] })) || 0
            //对源数据深度克隆
            const cloneData = JSON.parse(JSON.stringify(data))
            //循环所有项
            const treeData = cloneData.filter(father => {
                let branchArr = cloneData.filter(child => {
                    //返回每一项的子级数组
                    return father[id] === child[parentId]
                });
                branchArr.length > 0 ? father.children = branchArr : '';
                //返回第一层
                return father[parentId] === rootId 
            });
            return treeData != '' ? treeData : data;
        },
        /**
         * 初始化数据
         * @method init
         * @param {object} id 点击选择的id
         * @param {array} list 级联选择器列表 
         */
        init(id,list){
            this.dialogVisible = true
            this.options[0].children=this.handleTree(list)
            this.id = ''
            this.dataForm.parentId = ''
            this.dataForm.deptName = ''
            this.dataForm.orderNum = ''
            this.dataForm.leader = ''
            this.dataForm.phone = ''
            this.dataForm.email = ''
            this.isResouceShow++
            if(id){
                this.id = id
                this.getDeptById(id)
            }
        },
        /**
         * 通过id获取数据
         * @method getMenuById
         * @param {number} e 要获取数据的id
         */
        getDeptById(e){
            let Params = {},
                send = {}
            Params.url = '/f/dept/getDeptById'
            send.deptId = e
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                    if(res.code===0){
                        this.dataForm.parentId=this.echo(res.data.parentId)
                        this.dataForm.deptName = res.data.deptName
                        this.dataForm.orderNum = res.data.orderNum
                        this.dataForm.leader = res.data.leader
                        this.dataForm.phone = res.data.phone
                        this.dataForm.email = res.data.email
                    }else{
                    }
                },(res)=>{
                }
            )
        },
        /**
         * 级联选择器回溯
         * @method echo
         * @param {number} e 要回溯到的位置
         */
        echo(e){
            let arr = []
            let p = JSON.parse(JSON.stringify(this.options))
            let out=false;
            function fun(p){
                let bg = 0
                for(let item of p){
                    if(item.deptId === e){
                        arr.push(item.deptId)
                        out=true
                        return
                    }else if(item.children && item.children.length > 0){
                        arr.push(item.deptId)
                        fun(item.children)
                    }
                    bg++
                    if(out) return
                    if(bg===p.length&&arr&&arr.length>0){
                        arr = [0]
                    }
                }      
            }
            fun(p)
            return arr
        },
        /**
         * 新增&修改
         * @method addOrUpdate
         */
        addOrUpdate(){
            this.$refs.dataForm.validate((valid) => {
                if (valid) {
                    let Params = {},
                        send = {}
                    // Params.url = this.id ? '/Servlet/updatedept' : '/Servlet/insertdept'
                    Params.url = this.id ? '/f/dept/uptDept' : '/f/dept/addDept'
                    if(this.id){
                        send.deptId =this.id
                    }
                    send.parentId = this.dataForm.parentId[this.dataForm.parentId.length-1]
                    send.deptName = this.dataForm.deptName
                    send.orderNum = this.dataForm.orderNum
                    send.leader = this.dataForm.leader
                    send.phone = this.dataForm.phone
                    send.email = this.dataForm.email
                    Params.send = send
                    sendServer(Params,this).then(
                        (res)=>{
                            console.log(res)
                            if(res.code===0){
                                this.$emit('getDeptData')
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
<style>
.selectIcon .el-input__inner{
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
.selectIcon .el-select-dropdown{
    width:402px;
}
.selectIcon .el-select{
    width: 225px;
}
.selectIcon .el-select-dropdown__item{
    float: left;
    width: 40px;
    padding: 0px 13px;
}
.menuForm .el-input-number{
    width: 280px;
}
.spanIcon{
    background-color: #f5f7fa;
    color: #909399;
    height: 40px;
    float: left;
    display: block;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 20px;
    white-space: nowrap;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 0;
}
</style>