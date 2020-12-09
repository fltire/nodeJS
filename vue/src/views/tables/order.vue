<template>
    <div>
       <div class="main">
           <div  class="box" v-for="item in list" :key="item.TableTableId">
               <div @click="use(item)" class="bg" :style="{background:(item.TableStatus==='已停用'?'rgba(107, 106, 105, 0.068)':item.TableUseStatus==='空闲中'?'':item.use1==1?'#69c0ff':'#d9d9d9')}">
                   <div class='title'>{{item.TableTableName}}</div>
                   <div class="state">{{item.TableStatus==='已停用'?item.TableStatus:item.TableUseStatus}}</div>
                   <div class="state"  v-if="item.use1==1">您的桌台</div>
               </div>
           </div>
       </div>
       <el-dialog title="点餐" :visible.sync="dialogVisible" width="40%">
            <el-checkbox-group class="order" v-model="checkList">
                <el-checkbox style="width:45%;margin:0;overflow:hidden" v-for="item in orderList" :key="item.id" :label="item.GoodsName">
                    {{item.GoodsName}}<div style="float:right;margin-right:20px">{{item.GoodsRetailPrice}}元</div>
                </el-checkbox>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="pay">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {sendServer} from '../../utils/common'
export default {
    data () {
        return {
            list:[],
            dialogVisible:false,
            orderList:[],
            checkList:[],
            id:''
        }
    },
    mounted(){
        this.fetchData()
    },
    methods:{
        //选择
        use(e){
            let s=0
            this.id = e.id
            for(let i = 0;i<this.list.length;i++){
                if(this.list[i].use1){
                    s++
                }
            }
            if(e.TableStatus=='已停用'||e.TableUseStatus=='使用中'){
                if(e.use1!=1){
                    return
                }
            }
            if(s){
                this.leave()
                return
            }
            this.dialogVisible = true
            this.order()
            this.checkList = []
            // let Params = {}
            // let send = {}
            // Params.url = '/restAction/shiyong'
            // send.TableTableId = e.TableTableId
            // Params.send = send
            // sendServer(Params,this).then(
            //     (res)=>{
            //         this.$message({
            //             message: res.data,
            //             type: 'success'
            //         });
            //         this.fetchData()
            //     },(res)=>{
            //     }
            // )
        },
        leave(){
            let Params = {}
            let send = {}
            Params.url = '/f/restAction/leave'
            send.id = this.id
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                console.log(res.data)
                // this.dialogVisible = false
                this.fetchData()
                // this.orderList = res.data.list
                },(res)=>{
                }
            )
        },
        order(){
            let Params = {}
            let send = {}
            Params.url = '/f/restAction/order'
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                console.log(res.data)
                this.orderList = res.data.list
                this.fetchData()
                },(res)=>{
                }
            )
        },
        pay(){
            let money=0
            console.log(this.checkList)
            for(let i=0;i<this.checkList.length;i++){
                for(let j=0;j<this.orderList.length;j++){
                    if(this.checkList[i]==this.orderList[j].GoodsName){
                        money+=Number(this.orderList[j].GoodsRetailPrice)
                    }
                }
            }
            let Params = {}
            let send = {}
            Params.url = '/f/restAction/pay'
            send.id = this.id
            send.checkList = this.checkList
            send.money = money
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                console.log(res.data)
                this.dialogVisible = false
                this.fetchData()
                // this.orderList = res.data.list
                },(res)=>{
                }
            )
        },
        fetchData(){
            let Params = {}
            let send = {}
            Params.url = '/f/restAction/tableUse'
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                console.log(res.data)
                this.list = res.data.list
                },(res)=>{
                }
            )
        }
    }
}
</script>
<style>
.order .el-checkbox__label{
    width: 100%;
}
</style>
<style scoped>

.box{
    width: 20%;
    float: left;
}
.bg{
    /* background: rgba(107, 106, 105, 0.068); */
    height: 20px;
    width:60%;
    height: 0;
    padding-bottom: 60%;
    margin: 20% auto;
    border-radius: 20px;
    overflow: hidden;
}
.bg:hover{
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    cursor: pointer;
}
.title{
    margin-top: 1.5VW;
    text-align: center;
}
.state{
    margin-top: 1.5VW;
    text-align: center;
}
</style>