<template>
    <div>
        <el-dialog :title="id?'菜单修改':'菜单新增'" :visible.sync="dialogVisible" width="800px" >
        <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="100px" class="menuForm demo-ruleForm" style="overflow:hidden">
            <el-form-item label="菜单类型" prop="menuType" >
                <el-radio-group :disabled='id?true:false' @change="changeRadio" v-model="dataForm.menuType">
                    <el-radio label="M">目录</el-radio>
                    <el-radio label="C">菜单</el-radio>
                    <el-radio label="F">按钮</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item  label="上级菜单" prop="parentId">
                <el-cascader :key="isResouceShow" :options="dataForm.menuType==='F' ? btn :options" v-model="dataForm.parentId" filterable :show-all-levels="false" :props="props" clearable style="width:100%"></el-cascader>
            </el-form-item>
            <el-form-item v-show="dataForm.menuType!=='F'" label="菜单图标" class="selectIcon" style="width:50%;float:left">
                <span class="spanIcon">
                    <svg-icon :icon-class="icon"></svg-icon>
                </span>
                <el-select v-model="dataForm.icon"  :popper-append-to-body="false" placeholder="请选择" clearable filterable @change='changeSelect'>
                    <el-option v-for="item in icons" :key="item" :label="item" :value="item">
                        <svg-icon :icon-class="item"></svg-icon>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="dataForm.menuType!=='F'? '菜单名称':'权限名称'" prop="menuName" style="width:50%;float:left">
                <el-input v-model="dataForm.menuName" ></el-input>
            </el-form-item>
            <el-form-item label="菜单顺序" prop="orderNum" style="width:50%;float:left">
                <el-input-number v-model="dataForm.orderNum" :min="0" :max="100" label="描述文字"></el-input-number>
            </el-form-item>
            <el-form-item v-show="dataForm.menuType!=='F'" label="路由地址" :prop="dataForm.menuType!=='F' ? 'path' :'sa'" style="width:50%;float:left">
                <el-input v-model="dataForm.path" ></el-input>
            </el-form-item>
            <el-form-item v-show="dataForm.menuType!=='M'" label="权限标识" :prop="dataForm.menuType!=='M' ? 'perms' :'sa'" style="width:50%;float:left">
                <el-input v-model="dataForm.perms" ></el-input>
            </el-form-item>
            <el-form-item v-show="dataForm.menuType==='C'" label="组件路径" :prop="dataForm.menuType==='C'?'component':'sa'" style="width:50%;float:left">
                <el-input v-model="dataForm.component" ></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark" style="width:100%;float:left">
                <el-input type="textarea" v-model="dataForm.remark" ></el-input>
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
import icons from "../../../icons/index"
export default {
    data() {
        return {
            isResouceShow:1,
            icons:icons,
            id:'',
            icon: '',
            dialogVisible: false,
            dataForm:{
                parentId:'',
                menuName: '',
                orderNum:1,
                icon: '',
                menuType: 'C',
                component:'',
                path:'',
                remark:'',
                perms: ''
            },
            btn: [],
            options:[{
                menuId:0,
                menuName:'主菜单',
                children:[]
            }],
            rules: {
                menuName: [
                    { required: true, message: '请输入权限名称', trigger: 'blur' }
                ],
                path: [
                    { required: true, message: '请输入路由地址', trigger: 'blur' }
                ],
                parentId: [
                    { required: true, message: '请选择上级菜单', trigger: 'change' }
                ],
                component: [
                    { required: true, message: '请输入组件路径', trigger: 'blur' }
                ],
                perms: [
                    { required: true, message: '请输入权限标识', trigger: 'blur' }
                ]
            },
            props:{ 
                checkStrictly: true,
                value: 'menuId',
                label: 'menuName'
            }
           
        }
    },
    mounted () {
        
    },
    methods: {
        /**
         * 单选按钮单击事件
         * @method changeRadio
         */
        changeRadio(){
            this.dataForm.parentId = ''
        },
        /**
         * 遍历返回树
         * @method handleTree
         * @param {array} data 数据
         */
        handleTree(data,type) {
            let rootId = 0
            //对源数据深度克隆
            const cloneData = JSON.parse(JSON.stringify(data))
            //循环所有项
            const treeData = cloneData.filter(father => {
                let branchArr = cloneData.filter(child => {
                    //返回每一项的子级数组
                    if(type==='F'){
                        return father.menuId === child.parentId  && (child.menuType !== 'M' || (child.menuType === 'M' && child.son === 'Y')) && child.menuType !== 'F'
                    }else{
                        return father.menuId === child.parentId && child.menuType === 'M'
                    }
                });
                branchArr.length > 0 ? father.children = branchArr : '';
                //返回第一层
                if(type==='F'){
                    return father.parentId === rootId && (father.menuType !== 'M' || (father.menuType === 'M' && father.son === 'Y')) && father.menuType !== 'F'
                }else{
                   return father.parentId === rootId && father.menuType === 'M';
                }
            });
            return treeData != '' ? treeData : data;
        },
        /**
         * 初始化数据
         * @method init
         * @param {object} data 点击选择的数据
         * @param {array} list 级联选择器列表 
         */
        init(data,list){
            console.log(data)
            this.dialogVisible = true
            this.options[0].children=this.handleTree(list)
            this.btn = this.handleTree(list,'F')
            console.log(this.btn)
            this.id = ''
            this.dataForm.parentId=''
            this.dataForm.menuName= ''
            this.dataForm.orderNum=1
            this.dataForm.icon= ''
            this.dataForm.perms= ''
            this.icon= ''
            this.dataForm.menuType= 'C'
            this.dataForm.component=''
            this.dataForm.path=''
            this.dataForm.remark=''
            this.isResouceShow++
            if(data){
                this.id = data.menuId
                this.getMenuById(data.menuId)
            }
        },
        /**
         * 通过id获取数据
         * @method getMenuById
         * @param {number} e 要获取数据的id
         */
        getMenuById(e){
            let Params = {},
                send = {}
            // Params.url = '/Servlet/selectidmenu'
            Params.url = '/f/nemu/getMenuById'
            send.menuId = e
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                    console.log(res)
                    if(res.code===0){
                        this.dataForm.menuName= res.data.menuName
                        this.dataForm.orderNum=res.data.orderNum
                        this.dataForm.perms=res.data.perms
                        this.dataForm.icon= res.data.icon
                        this.icon= res.data.icon||''
                        this.dataForm.menuType=res.data.menuType
                        this.dataForm.component=res.data.component
                        this.dataForm.path=res.data.path
                        this.dataForm.remark=res.data.remark
                        this.dataForm.parentId=this.echo(res.data.parentId)
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
            let p = this.dataForm.menuType==='F' ? JSON.parse(JSON.stringify(this.btn)) : JSON.parse(JSON.stringify(this.options))
            // let p = JSON.parse(JSON.stringify(this.options))
            let out=false;
            function fun(p){
                let bg = 0
                for(let item of p){
                    if(item.menuId === e){
                        arr.push(item.menuId)
                        out=true
                        return
                    }else if(item.children && item.children.length > 0){
                        arr.push(item.menuId)
                        fun(item.children)
                    }
                    bg++
                    if(out) return
                    if(bg===p.length&&arr&&arr.length>0){
                        arr = []
                    }
                }      
            }
            fun(p)
            console.log(arr)
            return arr
        },
        /**
         * icon选择器点击事件
         * @method changeSelect
         * @param {string} e 需要显示的icon的名字
         */
        changeSelect(e){
            this.icon = e
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
                    // Params.url = this.id ? '/Servlet/updatemenu' : '/Servlet/insertmenu'
                    Params.url = this.id ? '/f/menu/uptMenu' : '/f/menu/addMenu'
                    if(this.id){
                        send.menuId =this.id
                    }
                    send.parentId = this.dataForm.parentId[this.dataForm.parentId.length-1]
                    send.menuName = this.dataForm.menuName
                    send.orderNum = this.dataForm.orderNum
                    send.perms = this.dataForm.perms
                    send.icon = this.dataForm.icon
                    send.menuType = this.dataForm.menuType
                    send.component = this.dataForm.component
                    send.path = this.dataForm.path
                    send.remark = this.dataForm.remark
                    Params.send = send
                    sendServer(Params,this).then(
                        (res)=>{
                            console.log(res)
                            if(res.code===0){
                                this.$emit('getMenuData')
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