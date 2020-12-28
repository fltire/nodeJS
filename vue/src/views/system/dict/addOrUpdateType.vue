<template>
    <div>
        <el-dialog title="新增" :visible.sync="dialogVisible" width="50" >
        <el-form :model="dataForm" :rules="rules" ref="dataForm"  label-width="100px" class="demo-ruleForm" >
                <el-form-item label="分类名称" prop="dictTypeName" >
                    <el-input v-model="dataForm.dictTypeName" ></el-input>
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
                dictTypeName: '',
                remark: ''
            },
             rules: {
                dictTypeName: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ],
             }
        };
    },
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
            this.dataForm.dictTypeName = ''
            this.dataForm.remark = ''
            if(data){
                this.id = data.dictTypeId
                this.dataForm.dictTypeName = data.dictTypeName
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
                    Params.url = this.id ? '/f/dictType/uptDictType' : '/f/dictType/addDictType'
                    if(this.id){
                        send.dictTypeId = this.id
                    }
                    send.dictTypeName = this.dataForm.dictTypeName
                    send.remark = this.dataForm.remark
                    Params.send = send
                    sendServer(Params,this).then(
                        (res)=>{
                            console.log(res)
                            if(res.code===0){
                                this.$emit('getDictType')
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