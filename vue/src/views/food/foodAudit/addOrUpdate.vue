<template>
<div>
    <el-dialog :title="id?'食品修改':'食品新增'" :visible.sync="dialogVisible" width="50%">
        <el-form ref="form" :model="formData" label-width="80px">
            <el-form-item label="食品名称">
                <el-input v-model="formData.foodName" placeholder="食品名称"></el-input>
            </el-form-item>
            <el-form-item label="食品类型">
                <el-select  ref="types" v-model="formData.foodClassify" placeholder="食品类型" style="width:100%">
                    <el-option v-for="item in foodClassifys" :label="item.name" :value="item.value" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="食品数量">
                <el-input type="number" v-model="formData.foodAmount" placeholder="库存"></el-input>
            </el-form-item>
            <el-form-item v-if="id">
                审核未通过原因：{{reasons}}
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="AddorUpdate">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import {sendServer} from '../../../utils/common'
  export default {
    data() {
      return {
        dialogVisible: false,
        formData:{
            foodClassify:'',
            foodName:'',
            foodAmount:''
        },
        id:null,
        userId:null,
        reasons:'',
        foodClassifys:[]
      };
    },
    mounted () {
        this.userId = JSON.parse(localStorage.getItem('userdata')).userId
        this.foodClassify()
    },
    methods: {
      init(e){
        this.id=null
        this.dialogVisible = true
        this.formData.foodClassify = ''
        this.formData.foodName = ''
        this.formData.foodAmount = ''
        if(e){
            console.log(e)
            this.id = e.foodId
            this.reasons = e.reasons
            this.formData.foodClassify = Number(e.foodClassifyId)
            this.formData.foodName = e.foodName
            this.formData.foodAmount = e.foodAmount
        }
      },
      foodClassify(){
        let Params = {},
            send = {}
        Params.url = '/f/food/foodClassify'
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
                console.log(res)
                if(res.code===0){
                    this.foodClassifys = res.list
                }
            }
        )
      },
      chengeType(e){

      },
      AddorUpdate(){
        let Params = {}
        let send = this.formData
        Params.url = this.id?'/f/food/foodAudit/upt':'/f/food/foodAudit/add'
        if(this.id){
            send.id = this.id
        }
        send.foodClassify = this.formData.foodClassify
        send.foodName = this.formData.foodName
        send.foodAmount = this.formData.foodAmount
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
                if(res.code === 0){
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                    this.dialogVisible = false
                    this.$emit('AddorUpdate')
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
    }
  };
</script>