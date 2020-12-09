<template>
  <div class="dashboard-container">
    <div v-show="showBox">
      <el-button size="mini" style="float:right;margin-bottom:10px"  icon="el-icon-turn-off" @click="qiehuan">切换</el-button>
      <el-button  style="float:right;margin-bottom:10px;margin-right:10px" type="primary" @click="addAndUpdate()" size="mini" icon="el-icon-plus">新增</el-button>
      <el-table v-loading="listLoading" row-key="catName" lazy :load="load" :data="dataList" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" element-loading-text="Loading" fit highlight-current-row
      :header-cell-style="{background:'#f5f7fa'}">
        <el-table-column prop="catName"  label="分类名称"></el-table-column>
        <el-table-column prop="catIcon"  label="分类图标"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot="header" slot-scope="scope">
            操作 <el-button style="float：right" size="mini" type="primary" @click="sortList('Root')" icon="el-icon-sort">排序</el-button>
          </template>
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="addAndUpdate(scope.row.catId)"><i class="el-icon-edit-outline"></i>修改</el-button>
            <el-button size="mini" type="text" v-if="scope.row.isLeaf==='Y'" @click="delCategoryById(scope.row.catId)"><i class="el-icon-delete"></i>删除</el-button>
            <el-button size="mini" type="text" v-if="scope.row.hasChildren"  @click="sortList(scope.row.catId)"><i class="el-icon-sort"></i>排序</el-button>
            <el-button size="mini" type="text" @click="details(scope.row.catId)"><i class="el-icon-tickets"></i>详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <isdialog ref="dialog"></isdialog>
      <list ref="list" @getData="getData"></list>
      <add-or-update ref="addOrUpdate" @getData="getData"></add-or-update>
    </div>
    <goodui v-show="!showBox" @qiehuan="qiehuan"></goodui>
  </div>
</template>
<script>
import {sendServer} from '../../utils/common'
import isdialog from './dialog'
import addOrUpdate from './addOrUpdate'
import list from './list.vue'
import goodui from './goodUi'
export default {
  name: 'Dashboard',
  data () {
    return {
      dataList:[], // 数据列表
      listLoading:false,
      level: ['Root'],
      showBox:false
    }
  },
  components: {
    isdialog,
    addOrUpdate,
    list,
    goodui
  },
  mounted(){
    this.getData()
  },
  activated () {
  },
  methods:{
    qiehuan(){
      this.showBox = !this.showBox
    },
    /**
     * 动态加载列表
     * @method load
     * @param {objact} tree 点击的节点数据
     * @param {objact} treeNode 节点的层级信息
     * @param {function} resolve 回调函数，把数据填入子节点
     */
    async load(tree, treeNode, resolve){
      console.log('tree',tree)
      console.log('treeNode',treeNode)
      console.log('resolve',resolve)
      let Params = {},
          send = {},
          list = []
      this.listLoading = true
      send.catId = tree.catId
      Params.url = '/sysadmin/listCategorysByCon'
      Params.send = send
      await sendServer(Params,this).then(
          (res)=>{
              console.log(res)
              if(res.code===0){
                // this.dataList = res.data
                list = res.data
                this.listLoading = false
              }else{
                console.log(res)
              }
          },(res)=>{
          }
      )
      list.forEach(item => {
        if(item.isLeaf==='N'){
          item.hasChildren=true
        }
      })
      resolve(list)
    },
    /**
     * 获取数据列表
     * @method getData
     * @param {string} id 查询子节点需要的id，也就是父节点的id
     */
    async getData(){
            let Params = {},
          send = {},
          list = []
          this.dataList = []
      this.listLoading = true
      send.catId = this.level[this.level.length-1]
      Params.url = '/sysadmin/listCategorysByCon'
      Params.send = send
      await sendServer(Params,this).then(
          (res)=>{
              console.log(res)
              if(res.code===0){
                // this.dataList = res.data
                list = res.data
                this.listLoading = false
              }else{
                console.log(res)
              }
          },(res)=>{
          }
      )
      list.forEach(item => {
        if(item.isLeaf==='N'){
          item.hasChildren=true
        }
      })
      this.dataList = list
    },
    /**
     * 排序
     * @method sort
     * @param {string} id 排序的父的id
     */
    sortList(id){
      this.$refs.list.init(id)
    },
    /**
     * 删除分类
     * @method delCategoryById
     * @param {string} id 需要删除的节点的id
     */
    delCategoryById(id){
      this.$confirm('确认删除？')
      .then(_ => {
        let Params = {}
        let send = {}
        Params.url = '/sysadmin/delCategoryById'
        send.catId = id
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
              if(res.code===0){
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.getData()
              }else{
                console.log(res)
              }
            },(res)=>{
            }
        )
      })
      .catch(_ => {});
    },
    /**
     * 下一级
     * @method nextLevel
     */
    nextLevel(id){
      this.level.push(id)
      this.getData()
    },
    /**
     * 上一级
     * @method upOneLevel
     */
    upOneLevel(){
      this.level.pop()
      this.getData()
    },
    /**
     * 打开弹窗展示详情
     * @method details
     * @param {string} id 需要展示的信息的id
     */
    details(id){
       this.$refs.dialog.init(id)
    },
    /**
     * 新增或修改数据
     * @method addAndUpdate
     * @param {string} id 如果有id则说明是修改，没有就是新增
     */
    addAndUpdate(id){
      this.$refs.addOrUpdate.init(id)
    }


  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    padding: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
::selection { background:lightblue; }
.left {
  width: 200px;
  height: 100%;
  background:skyblue;
}
.dashboard-container {
  height:100%;
}
</style>
