<template>
    <div>
        <el-dialog :title="id?'修改':'新增'" :visible.sync="dialogVisible" width="50%" >
            <el-form :model="dataForm" ref="dataForm" :rules='rules' label-width="100px" class="demo-ruleForm">
                <el-form-item label="分类名称" prop="catName" >
                    <el-input v-model="dataForm.catName" ></el-input>
                </el-form-item>
                <el-form-item label="父" prop="catPid" >
                    <el-cascader style="width:100%" v-model="dataForm.catPid" :disabled="this.catPid!==''||this.id!==''" :options="dataList" :props="props" :show-all-levels='false' clearable></el-cascader>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="dataForm.memo"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdate">确 定</el-button>
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
        id: '',
        version:null,
        rules: {
            catName: [
                { required: true, message: '请输入分类名称', trigger: 'blur' },
            ],
            catPid: [
                { required: true, message: '请选择父元素', trigger: 'blur' },
            ],
        },
        dataForm: {
            catName: '',
            memo: '',
            catPid: '',
        },
        props: { 
            checkStrictly: true,
            label: 'catName',
            value: 'catId',
        },
        dataList: [
            {
                catName: '第一层',
                catId: 'Root',
                leaf:'',
                children:[]
            }
        ], // 数据列表
        catPid: ''
      };
    },
    mounted () {
        
    },
    methods: {
        /**
         * 初始化数据
         * @method init
         * @param {string} catPid 新增时父id
         * @param {string} id 修改时的id
         */
        init(catPid='',id){
            this.dataForm.catName = '' 
            this.dataForm.memo = '' 
            this.id = ''
            this.dataForm.catPid = catPid
            this.catPid = ''
            this.catPid = catPid
            this.version = null
            this.dialogVisible = true
            this.recursion(this.dataList[0],'Root')
            if(id){
                this.id = id
                let Params = {},
                    send = {
                        catId:id
                    }
                Params.url = '/sysadmin/getCategoryById'
                Params.send = send
                sendServer(Params,this).then(
                    (res)=>{
                        if(res.code===0){
                            this.dataForm.catName = res.data.catName
                            this.dataForm.catPid = res.data.catPid
                            this.dataForm.memo = res.data.memo
                            this.version = res.data.version
                        }else{
                            console.log(res)
                        }
                    },(res)=>{
                    }
                )
            }
        },
        /**
         * 递归获取级联选择器数据
         * @method recursion
         * @param {objact} obj 需要添加子数据的父
         * @param {string} id 需要获取数据的id
         */
        async recursion(obj,id){
            let Params = {},
                send = {},
                data = []
            send.catId = id
            Params.url = '/sysadmin/listCategorysByCon'
            Params.send = send
            await sendServer(Params,this).then(
                (res)=>{
                    if(res.code===0){
                        data = res.data
                    }else{
                        console.log(res)
                    }
                },(res)=>{
                }
            )
            for(let i = 0;i<data.length;i++){
                if(data[i].isLeaf==='N'){
                    data[i].children = []
                    obj.children.push(data[i])
                    this.recursion(data[i],data[i].catId)
                }else{
                    obj.children.push(data[i])
                }
            }
        },
        /**
         * 新增或修改
         * @method addOrUpdate
         * 
         */
        addOrUpdate(){
            this.$refs.dataForm.validate((valid) => {
                let Params = {},
                    send = {}
                Params.url = this.id?'sysadmin/uptCategoryById':'/sysadmin/addCategory'
                if(this.id){
                    send.catId = this.id
                    console.log(Number(this.version)+1)
                    send.version = this.version
                    send.catName = this.dataForm.catName
                    send.memo = this.dataForm.memo
                }else{
                    send.catName = this.dataForm.catName
                    send.catPid = this.catPid==='' ? this.dataForm.catPid[this.dataForm.catPid.length-1] : this.catPid
                    send.memo = this.dataForm.memo
                }
                // send.catIcon = ''
                Params.send = send
                sendServer(Params,this).then(
                    (res)=>{
                        console.log(res)
                        if(res.code===0){
                            this.$emit('refreshData')
                            this.$message({
                                message: this.id ? '修改成功' : '新增成功',
                                type: 'success'
                            });
                            this.dialogVisible = false
                        }else{
                            console.log(res)
                        }
                    },(res)=>{
                    }
                )
            })
        }
    }
  };
</script>