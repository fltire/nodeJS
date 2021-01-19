<template>
<div>
    <el-dialog :title="id?'商品修改':'商品新增'" :visible.sync="dialogVisible" width="50%">
        <el-form ref="form" :model="formData" label-width="80px">
            <el-form-item label="商品名称">
                <el-input v-model="formData.goodsName" placeholder="商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品类型">
                <el-select @change='chengeType' ref="types" v-model="formData.goodsTypeId" placeholder="商品类型" style="width:100%">
                    <el-option v-for="item in GoodsTypes" :label="item.dictName" :value="item.dictId" :key="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="零售价">
                <el-input type="number"  v-model="formData.goodsRetailPrice" placeholder="零售价"></el-input>
            </el-form-item>
            <el-form-item label="库存">
                <el-input type="number" v-model="formData.goodsStock" placeholder="库存"></el-input>
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
import {sendServer} from '../../utils/common'
  export default {
    data() {
      return {
        dialogVisible: false,
        formData:{
            goodsName:'',
            goodsTypeId:'',
            goodsTypeName:'',
            goodsRetailPrice:'',
            goodsStock:'',
            goodsCreate:''
        },
        id:null
      };
    },
    props: ['GoodsTypes'],
    methods: {
      init(e){
        this.id=null
        this.dialogVisible = true
        this.formData.goodsName = ''
        this.formData.goodsTypeId = ''
        this.formData.goodsTypeName = ''
        this.formData.goodsRetailPrice = ''
        this.formData.goodsStock = ''
        if(e){
            this.id = e.goodsId
            this.formData.goodsName = e.goodsName
            this.formData.goodsTypeId = e.goodsTypeId
            this.formData.goodsTypeName = e.goodsTypeName
            this.formData.goodsRetailPrice = e.goodsRetailPrice
            this.formData.goodsStock = e.goodsStock
        }
      },
      chengeType(e){
          setTimeout(() => {
              console.log(this.$refs.types.selectedLabel)
              this.formData.goodsTypeName = this.$refs.types.selectedLabel
          }, 20);
      },
      AddorUpdate(){
        let Params = {}
        let send = this.formData
        Params.url = this.id?'/f/goodsAction/goodsUpt1':'/f/goodsAction/goodsAdd1'
        if(this.id){
            send.goodsId = this.id
        }
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