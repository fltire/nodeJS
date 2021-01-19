<template>
<div>
    <el-dialog title="食品价格" :visible.sync="dialogVisible" width="50%">
        <div class="item"><span>食品名称：</span><span>{{dataForm.foodName}}</span></div>
        <div class="item"><span>食品类型：</span><span>{{dataForm.foodClassify}}</span></div>
        <div class="item"><span>食品数量：</span><span>{{dataForm.foodAmount}}</span></div>
        <div class="item"><span>食品部门：</span><span>{{dataForm.dept}}</span></div>
        <div class="item"><span>食品新增时间：</span><span>{{dataForm.foodCreate}}</span></div>
        食品价格：<el-input style="width:200px" type="number" v-model="foodPrice" placeholder="价格(元)"></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="updated">确 定</el-button>
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
        dataForm:'',
        foodPrice:''
      };
    },
    mounted () {
    },
    methods: {
      init(e){
        console.log(e)
        this.id=e.foodId
        this.dialogVisible = true
        this.dataForm = e
        this.foodPrice = ''
      },
      updated(){
            let Params = {}
            let send ={}
            Params.url = '/f/food/foodList/upt'
            send.foodPrice = this.foodPrice
            send.foodId = this.id
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                    if(res.code === 0){
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.dialogVisible = false
                        this.$emit('fetchData')
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
<style scoped>
.item{
    padding-bottom: 16px;
    color: rgba(0,0,0,.85);
    font-weight: 400;
    font-size: 14px;
    line-height: 1.5715;
    text-align: start;
    
}
</style>