<template>
  <div class="app-container">
    <div style="padding:20px">
        <!-- <el-button type="primary" v-if="$store.state.role.spxz" @click="goodsAdd">添加商品</el-button> -->
        <el-button type="primary"  @click="goodsAdd" v-if="$isPermissions('goods:add')">添加商品</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <!-- <el-table-column prop="GoodsId" align="center" label="商品id" width="95"></el-table-column> -->
      <el-table-column prop="GoodsName" align="center" label="商品名称" ></el-table-column>
      <el-table-column prop="GoodsTypeName" align="center" label="类型" ></el-table-column>
      <el-table-column prop="GoodsRetailPrice" align="center" label="零售价"></el-table-column>
      <el-table-column prop="GoodsStock" align="center" label="库存" ></el-table-column>
      <el-table-column prop="GoodsAddDate" align="center" label="商品添加时间"></el-table-column>
      <el-table-column align="center" label="操作">
          <template slot-scope="scope">
              <el-button size="mini"  type="danger" @click="goodsDel(scope.row.id)"  v-if="$isPermissions('goods:del')">删除</el-button>
              <el-button size="mini"  @click="goodsAdd(scope.row)"  v-if="$isPermissions('goods:upt')">修改</el-button>
              <!-- <el-button size="mini" v-if="$store.state.role.spsc" type="danger" @click="goodsDel(scope.row.id)">删除</el-button>
              <el-button size="mini" v-if="$store.state.role.spxg" @click="goodsAdd(scope.row)">修改</el-button> -->
          </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="AllCount" :current-page=page @current-change='currentChange'></el-pagination>
    <add ref="add" @AddorUpdate = 'AddorUpdate'></add>
  </div>
</template>
<script>
import {sendServer} from '../../utils/common'
import add from './add'
import {role} from '../../utils/qx'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      AllCount:null,
      page:1,
    }
  },
  components:{
      add
  },
  created() {
    this.fetchData()
  },
  mounted () {
    
  },
  methods: {
    AddorUpdate(){
        this.page = 1
        this.fetchData()
    },
    // 新增
    goodsAdd(e){
        this.$refs.add.init(e)
    },
    //删除
    goodsDel(e){
        this.$confirm('确认删除？')
          .then(_ => {
            console.log(e)
            let Params = {}
            let send = {}
            Params.url = '/f/goodsAction/goodsDel'
            send.id = e
            Params.send = send
            let _that = this
            sendServer(Params,this).then(
                (res)=>{
                console.log(res.data)
                this.$message({
                    message: res.data,
                    type: 'success'
                });
                _that.fetchData()
                },(res)=>{
                }
            )
          })
          .catch(_ => {});
    },
    //分页
    currentChange(e){
        this.page = e
        this.fetchData()
    },
    //列表
    fetchData() {
      if(this.$isPermissions('goods:query')){
        this.listLoading = true
        let Params = {}
        let send = {}
        Params.url = '/f/goodsAction/goodsQry'
        send.page = this.page
        Params.send = send
        let _that = this
        sendServer(Params,this).then(
            (res)=>{
            console.log(res)
            _that.list = res.data.goodsList
            _that.AllCount = res.data.AllCount
            _that.listLoading = false
            },(res)=>{
            _that.listLoading = false
            }
        )
      }
    }
  }
}
</script>
