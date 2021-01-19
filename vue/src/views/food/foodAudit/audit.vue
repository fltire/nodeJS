<template>
<div>
    <el-dialog title="食品审核" :visible.sync="dialogVisible" width="50%">
        <div class="item"><span>食品名称：</span><span>{{dataForm.foodName}}</span></div>
        <div class="item"><span>食品类型：</span><span>{{dataForm.foodClassify}}</span></div>
        <div class="item"><span>食品数量：</span><span>{{dataForm.foodAmount}}</span></div>
        <div class="item"><span>食品部门：</span><span>{{dataForm.dept}}</span></div>
        <div class="item"><span>食品入库时间：</span><span>{{dataForm.foodCreate}}</span></div>
        <div class="item"><span>食品入库人员：</span><span>{{dataForm.addStaff}}</span></div>
        <el-switch v-model="value1" active-text="通过" inactive-text="不通过"></el-switch>
        <el-input type="textarea" :rows="2" style="margin-top:10px" placeholder="请输入不通过原因" v-model="reasons" v-if="!value1"></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="audit()" >确 定</el-button>
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
        value1:true,
        reasons:''
      };
    },
    mounted () {
    },
    methods: {
      init(e){
        this.id=null
        this.dialogVisible = true
        this.dataForm = e
      },
      audit(){
          let Params = {}
            let send ={}
            Params.url = '/f/food/foodAudit/audit'
            send.auditStatus = this.value1 ? '通过':'不通过'
            send.reasons = this.reasons
            send.foodId = this.dataForm.foodId
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