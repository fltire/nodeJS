<template>
  <div class="app-container">
    <div>
      <el-form :model="dataForm" :inline="true" size="small" label-width="80px" class="demo-ruleForm" style="overflow:hidden">
        <el-form-item label="商品名称">
          <el-input v-model="dataForm.goods_name" clearable placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item v-if="deptId===null" label="部门">
          <el-cascader ref="deptTree" :options="options" v-model="dataForm.dept_id" filterable :show-all-levels='false' :props="props" clearable style="width:100%"></el-cascader>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-select ref="types" v-model="dataForm.goods_type_id" placeholder="商品类型" style="width:100%">
            <el-option v-for="item in GoodsTypes" :label="item.dictName" :value="item.dictId" :key="item.dictId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
          <el-button @click="fetchData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="padding-bottom:20px">
      <el-button v-if="$isPermissions('goods:add')" type="primary" size="mini" icon="el-icon-plus" @click="goodsAdd()">新增</el-button>
      <el-button v-if="$isPermissions('goods:upt')" type="success" size="mini" icon="el-icon-edit-outline" @click="goodsAdd(multipleSelection[0])" :disabled="multipleSelection.length!==1">修改</el-button>
      <el-button v-if="$isPermissions('goods:del')" type="danger" size="mini" icon="el-icon-delete" @click="goodsDel()" :disabled='multipleSelection.length===0'>删除</el-button>
        <!-- <el-button type="primary" v-if="$store.state.role.spxz" @click="goodsAdd">添加商品</el-button> -->
    </div>
    <el-table v-loading="listLoading" :data="list" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f8f8f9'}" element-loading-text="Loading">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="goodsName" align="center" label="商品名称" ></el-table-column>
      <el-table-column prop="goodsTypeName" align="center" label="类型" ></el-table-column>
      <el-table-column prop="goodsRetailPrice" align="center" label="零售价"></el-table-column>
      <el-table-column prop="goodsStock" align="center" label="库存" ></el-table-column>
      <el-table-column v-if="deptId===null" prop="deptName" align="center" label="部门" ></el-table-column>
      <el-table-column prop="goodsCreate" align="center" label="商品添加时间"></el-table-column>
      <el-table-column align="center" label="操作" v-if="$isPermissions('goods:del')||$isPermissions('goods:upt')">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="goodsDel(scope.row.goodsId)"  v-if="$isPermissions('goods:del')"><i class="el-icon-edit-outline"></i>删除</el-button>
          <el-button size="mini" type="text" @click="goodsAdd(scope.row)"  v-if="$isPermissions('goods:upt')"><i class="el-icon-delete"></i>修改</el-button>
          <!-- <el-button size="mini" v-if="$store.state.role.spsc" type="danger" @click="goodsDel(scope.row.id)">删除</el-button>
          <el-button size="mini" v-if="$store.state.role.spxg" @click="goodsAdd(scope.row)">修改</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="AllCount" :current-page=page @current-change='currentChange'></el-pagination>
    <add ref="add" :GoodsTypes='GoodsTypes' @AddorUpdate = 'AddorUpdate'></add>
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
      deptId:null,
      multipleSelection: [],
      page:1,
      dataForm: {
        goods_type_id: '',
        dept_id: '',
        goods_name: '',
      },
      GoodsTypes:[
      ],
      options: [],
      props:{
          value: 'dept_id',
          label: 'dept_name'
      },
    }
  },
  components:{
      add
  },
  created() {
    this.fetchData()
  },
  mounted () {
    this.deptId = JSON.parse(localStorage.getItem('userdata')).deptId
    this.getUserDept()
    this.getGoodsType()
  },
  methods: {
    getGoodsType(){
      let Params = {},
        send = {}
      Params.url = '/f/goods/getGoodsType'
      Params.send = send
      sendServer(Params,this).then(
        (res)=>{
          console.log(res)
          if(res.code===0){
            this.GoodsTypes = res.data.list
          }
        }
      )
    },
    getUserDept(){
      let Params = {},
        send = {}
      Params.url = '/f/user/getUserDept'
      Params.send = send
      sendServer(Params,this).then(
        (res)=>{
          console.log(res)
          if(res.code===0){
            this.options = res.data.list
          }
        }
      )
    },
    /**
     * 清空条件查询，并刷新数据
     */
    reset(){
      this.dataForm.goods_type_id = ''
      this.dataForm.dept_id = ''
      this.dataForm.goods_name = ''
      this.fetchData()
    },
    /**
     * 新增/修改时刷新列表
     */
    AddorUpdate(){
        this.page = 1
        this.fetchData()
    },
    /**
     * 新增/修改
     * @method goodsAdd
     * @param {object} e 修改时携带的参数
     */
    goodsAdd(e){
        this.$refs.add.init(e)
    },
    /**
     * 删除
     * @method goodsDel
     * @param {number} id 单个删除时的id
     */
    goodsDel(id){
        let arr = id? [id] : this.multipleSelection.map(item => {
            return item.goodsId
        })
        this.$confirm('确认删除？')
          .then(_ => {
            console.log(id)
            let Params = {}
            let send = {}
            Params.url = '/f/goodsAction/goodsDel'
            send.ids = arr
            Params.send = send
            sendServer(Params,this).then(
              (res)=>{
                console.log(res.data)
                if(res.code===0){
                  this.$message({
                    message: res.msg,
                    type: 'success'
                  });
                  this.fetchData()
                }
              },(res)=>{
              }
            )
          })
          .catch(_ => {
            console.log(122)
          });
    },
    /**
     * 多选
     * @method handleSelectionChange
     * @param {array} val 选中的数据集合
     */
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    /**
     * 分页
     * @method currentChange
     * @param {number} e 跳转到的页数
     */
    currentChange(e){
        this.page = e
        this.fetchData()
    },
    /**
     * 商品列表
     * @method fetchData
     */
    fetchData() {
      if(this.$isPermissions('goods:query')){
        this.listLoading = true
        let Params = {}
        let send = {}
        Params.url = '/f/goodsAction/goodsQry'
        send.page = this.page
        send.goods_type_id = this.dataForm.goods_type_id
        send.dept_id = this.dataForm.dept_id[this.dataForm.dept_id.length-1]
        send.goods_name = this.dataForm.goods_name
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
              console.log(res)
              if(res.code===0){
                this.list = res.data.goodsList
                this.AllCount = res.data.AllCount
              }
              this.listLoading = false
            },(res)=>{
              this.listLoading = false
            }
        )
      }
    }
  }
}
</script>
