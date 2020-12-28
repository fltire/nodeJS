<template>
    <div>
        <el-dialog title="新增" :visible.sync="dialogVisible" width="50" >
        <el-form :model="dataForm" :rules="rules" ref="dataForm"  label-width="100px" class="demo-ruleForm" >
                <el-form-item label="分类" prop="dictTypeId" >
                    <el-select v-model="dataForm.dictTypeId" placeholder="请选择" style="width:100%">
                        <el-option v-for="item in dictType" :key="item.value" :label="item.dictTypeName" :value="item.dictTypeId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="字典名称" prop="dictName" >
                    <el-input v-model="dataForm.dictName" ></el-input>
                </el-form-item>
                <el-form-item label="备注" >
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="dataForm.remark"></el-input>
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
            dialogVisible: false,
            id: null,
            dataForm:{
                dictName: '',
                remark: '',
                dictTypeId: ''
            },
            rules: {
                dictName: [
                    { required: true, message: '请输入字典名称', trigger: 'blur' }
                ],
                dictTypeId: [
                    { required: true, message: '请选择分类', trigger: 'blur' }
                ],
            }
        };
    },
    props: ['dictType'],
    mounted () {
    },
    methods: {
        /**
         * 初始化
         * @method init
         * @param {object} data 要修改的数据
         */
        init(data){
            this.dialogVisible = true
            this.id = null
            this.dataForm.dictName = ''
            this.dataForm.remark = ''
            this.dataForm.dictTypeId = ''
            if(data){
                this.id = data.dictId
                this.dataForm.dictName = data.dictName
                this.dataForm.dictTypeId = data.dictTypeId
                this.dataForm.remark = data.remark
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
                    Params.url = this.id ? '/f/dict/uptDict' : '/f/dict/addDict'
                    if(this.id){
                        send.dictId = this.id
                    }
                    send.dictName = this.dataForm.dictName
                    send.dictTypeId = this.dataForm.dictTypeId
                    send.remark = this.dataForm.remark
                    Params.send = send
                    sendServer(Params,this).then(
                        (res)=>{
                            console.log(res)
                            if(res.code===0){
                                this.$emit('getDict')
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