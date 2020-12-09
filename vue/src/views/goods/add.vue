<template>
<div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
        <el-form ref="form" :model="formData" label-width="80px">
            <el-form-item label="商品名称">
                <el-input v-model="formData.GoodsName" placeholder="商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品类型">
                <el-select @change='chengeType' ref="types" v-model="formData.GoodsTypeId" placeholder="商品类型" style="width:100%">
                    <el-option v-for="item in GoodsTypes" :label="item.type" :value="item.id" :key="item.id"></el-option>
                    <!-- <el-option label="区域二" value="beijing"></el-option> -->
                </el-select>
                <!-- <el-input v-model="formData.GoodsTypeName" placeholder="商品类型"></el-input> -->
            </el-form-item>
            <el-form-item label="零售价">
                <el-input type="number"  v-model="formData.GoodsRetailPrice" placeholder="零售价"></el-input>
            </el-form-item>
            <el-form-item label="单位">
                <el-input v-model="formData.GoodsUnit" placeholder="单位"></el-input>
            </el-form-item>
            <el-form-item label="库存">
                <el-input type="number" v-model="formData.GoodsStock" placeholder="库存"></el-input>
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
        GoodsTypes:[
            {type:'食品类',id:1},
            {type:'服装类',id:2},
            {type:'鞋帽类',id:3},
            {type:'日用品类',id:4},
            {type:'家具类',id:5},
        ],
        formData:{
            GoodsName:'',
            GoodsTypeId:'',
            GoodsTypeName:'',
            GoodsRetailPrice:'',
            GoodsUnit:'',
            GoodsStock:'',
            GoodsAddDate:''
        },
        id:null
      };
    },
    methods: {
      init(e){
        this.id=null
        this.dialogVisible = true
        this.formData.GoodsName = ''
        this.formData.GoodsTypeId = ''
        this.formData.GoodsTypeName = ''
        this.formData.GoodsRetailPrice = ''
        this.formData.GoodsUnit = ''
        this.formData.GoodsStock = ''
        if(e){
            this.id = e.id
            this.formData.GoodsName = e.GoodsName
            this.formData.GoodsTypeId = e.GoodsTypeId
            this.formData.GoodsTypeName = e.GoodsTypeName
            this.formData.GoodsRetailPrice = e.GoodsRetailPrice
            this.formData.GoodsUnit = e.GoodsUnit
            this.formData.GoodsStock = e.GoodsStock
        }
      },
      chengeType(e){
          setTimeout(() => {
              console.log(this.$refs.types.selectedLabel)
              this.formData.GoodsTypeName = this.$refs.types.selectedLabel
          }, 20);
      },
      AddorUpdate(){
        let Params = {}
        let send = this.formData
        Params.url = this.id?'/f/goodsAction/goodsUpt':'/f/goodsAction/goodsAdd'
        if(this.id){
            send.id = this.id
        }
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
                console.log(res.data)
                this.$message({
                    message: res.data,
                    type: 'success'
                });
                this.dialogVisible = false
                this.$emit('AddorUpdate')
            },(res)=>{
            }
        )
      }
    }
  };
</script>