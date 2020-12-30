<template>
  <div style="height:100%;padding:20px">
    <div class="left" style="margin-right:20px">
        <div class="left_title">字典分类<div class="add_type" @click="addOrUpdateType()">新增</div></div>
        <el-tree icon-class='el-icon-sort' :render-after-expand='false' @node-click="handleNodeClick" :data="tree" :props="props">
             <span class="custom-tree-node"  slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                    <el-button type="text" size="mini" @click="addOrUpdateType(data)" >修改</el-button>
                    <el-button type="text" size="mini" @click="delDictType(data)" >删除</el-button>
                </span>
            </span>
        </el-tree>
    </div>
    <div class="right">
        <el-form :model="dataForm" :inline="true" size="small" label-width="80px" class="demo-ruleForm" style="overflow:hidden">
            <el-form-item label="字典名称" prop="dictName" >
                <el-input v-model="dataForm.dictName" clearable placeholder="请输入用户名称"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="dictTypeId" >
                <el-select clearable v-model="dataForm.dictTypeId" placeholder="请选择" style="width:100%">
                    <el-option v-for="item in tree" :key="item.dictTypeId" :label="item.dictTypeName" :value="item.dictTypeId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="reset">重置</el-button>
                <el-button @click="getDict()">查询</el-button>
            </el-form-item>
        </el-form>
        <el-button size="mini" type="primary" @click="addOrUpdate()" icon="el-icon-plus" style="margin-bottom:10px">新增</el-button>
         <el-button  type="success" size="mini" icon="el-icon-edit-outline" @click="addOrUpdate(multipleSelection[0])" :disabled="multipleSelection.length!==1">修改</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="delDict()" :disabled='multipleSelection.length===0'>删除</el-button>
        <el-table @selection-change="handleSelectionChange" v-loading="listLoading" :data="list" style="width: 100%;margin-bottom: 20px;" :header-cell-style="{'background-color':'#f8f8f9'}">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="dictName" label="字典名称"  align='center'></el-table-column>
            <el-table-column prop="dictTypeName" label="字典分类" align='center'></el-table-column>
            <el-table-column prop="dictCreate" label="创建时间"></el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button  @click="addOrUpdate(scope.row)"  type="text" size="small"><i id="del" class="el-icon-edit"></i> 修改</el-button>
                    <el-button type="text" size="small" @click="delDict(scope.row.dictId)"><i id="del" class="el-icon-delete"></i> 删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next"
            :total="count"
            @current-change=currentChange>
        </el-pagination>
    </div>

    <add-or-update ref="AOU" :dictType='tree' @getDict='getDict'></add-or-update>
    <add-or-update-type ref="AOUType" @getDictType='getDictType'></add-or-update-type>
  </div>
</template>
<script>
import {sendServer} from  '../../../utils/common'
import AddOrUpdate from './addOrUpdate.vue'
import addOrUpdateType from './addOrUpdateType'
export default {
    data () {
        return {
            tree:[], // 分类
            props:{
                label: 'dictTypeName',
                value: 'dictTypeId'
            },
            dataForm: {
                dictName:'',
                dictTypeId:''
            },
            count: null,
            dataList:[],
            list: [],
            page: 1,
            dictTypeId:'',
            listLoading:false,
            multipleSelection:[]
        }
    },
    mounted(){
        this.getDictType()
        this.getDict()
    },
    components: {
        addOrUpdateType,
        AddOrUpdate
    },
    methods:{
        /**
         * 左侧树点击事件
         * @method handleNodeClick
         * @param {object} e 点击选中的那一项
         */
        handleNodeClick(e){
            console.log(e)
            this.dataForm.dictTypeId = e.dictTypeId
            this.getDict()
        },
        /**
         * 清空条件查询，并刷新数据
         * @method reset
         */
        reset(){
            this.dataForm.dictTypeId = ''
            this.dataForm.dictName = ''
            this.getDict()
        },
        /**
         * 分页点击事件
         * @method currenChange
         * @param {number} e 点击的分页，要跳转到的页码
         */
        currentChange(e){
            if(this.page!==e){
                this.page=e
                this.getDict()
            }
        },
        /**
         * 字典分类列表
         * @method getDictType
         */
        getDictType(){
            let Params = {},
                send = {}
            Params.url = '/f/dictType/getDictType'
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                    console.log(res)
                    if(res.code===0){
                        this.tree = res.data.list
                    }
                },(res)=>{
                }
            )
        },
        /**
        * 字典分类新增&修改
        * @method addOrUpdateType
        * @param {object} data 修改时要修改的数据
        */
        addOrUpdateType(data){
            this.$refs.AOUType.init(data)
        },
        /**
         * 字典列表
         * @method getDict
         */
        getDict(){
            let Params = {},
                send = {}
            Params.url = '/f/dict/getDict'
            send.page = this.page
            send.dictName = this.dataForm.dictName
            send.dictTypeId = this.dataForm.dictTypeId
            Params.send = send
            this.listLoading = true
            sendServer(Params,this).then(
                (res)=>{
                    console.log(res)
                    if(res.code===0){
                        console.log(res)
                        this.list  = res.data.list
                        this.count = res.data.count
                        this.listLoading = false
                    }
                },(res)=>{
                }
            )
        },
        /**
        * 字典新增&修改
        * @method addOrUpdate
        * @param {object} data 修改时要修改的数据
        */
        addOrUpdate(data){
            this.$refs.AOU.init(data)
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
         * 删除字典分类列表（左侧树）
         * @method delDictType
         * @param {object} e 要删除的数据
         */
        delDictType(e){
            console.log(e.dictTypeId)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let Params = {},
                    send = {}
                Params.url = '/f/dictType/delDictType'
                send.dictTypeId = e.dictTypeId
                Params.send = send
                sendServer(Params,this).then(
                    (res)=>{
                        console.log(res)
                        if(res.code===0){
                            this.getDictType()
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    },(res)=>{
                    }
                )
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        /**
         * 删除字典列表
         * @method delUser
         * @param {number} id 点击行删除时要删除的数据的id
         */
        delDict(id){
            console.log(id)
            let arr = id? [id] : this.multipleSelection.map(item => item.dictId)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let Params = {},
                    send = {}
                Params.url = '/f/dict/delDict'
                send.ids = arr
                Params.send = send
                sendServer(Params,this).then(
                    (res)=>{
                        console.log(res)
                        if(res.code===0){
                            this.getDict()
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    },(res)=>{
                    }
                )
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });

        }
    }
}
</script>
<style>
/* .sortable-ghost{
  opacity: .8;
  background:#f0f0f0!important;
}
.left .el-tree{
    background: rgba(0, 0, 0, 0)!important;
}
.left .el-tree-node>.el-tree-node__children{
    overflow: visible;
}
.right .el-table__expanded-cell{
    background: #f5f7fa;
}
.right .el-table__expanded-cell:hover{
    background: #f5f7fa!important;
}
.right .el-table td, .el-table th{
    padding:9px 0;
}
.right .el-table th>.cell{
    margin-left: 5px;
} */

/* .left .el-tree-node__content:hover{
    background: rgba(0, 0, 0, 0)!important;
}
.left .is-current{
    background: rgba(0, 0, 0, 0)!important;
}
.left .el-tree-node:focus>.el-tree-node__content{
    background: rgba(0, 0, 0, 0)!important;
} */
</style>
<style lang="scss" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

.left {
    width: 200px;
    height: 100%;
    //   background:#F2F6FC;
    float: left;
    padding: 20px 0;
    transition: .3s;
    border-radius: 4px;
    box-sizing: inherit;
    border: 1px solid #EBEEF5;
    background-color: #FFF;
    color: #303133;
    overflow: auto;
}
.left:hover {
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
.left_title{
    text-align: center;
    margin-bottom: 10px;
    position: relative;
}
.add_type{
    position: absolute;
    right: 10px;
    top: 5px;
    font-size: 12px;
    color: #409EFF;
    cursor: pointer;
}
.right{
    height: 100%;
    overflow: auto;
    // background: chocolate;
}
.right-main {
    height: 100%;
    margin: 0 20px;
    // background:royalblue;
}
.tree-menu{
    width: 140px;
    background: #fff;
    position: fixed;
    z-index: 20000;
    border: 1px solid #EBEEF5;
    color: #606266;
    line-height: 1.4;
    font-size: 14px;
    word-break: break-all;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 5px;
}
.tree-menu-item{
    // margin: 4px 0;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    padding: 0 12px;
    
}
.tree-menu-item:hover {
    background: #f5f7fa;
    cursor: pointer;
}


.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/  
::-webkit-scrollbar  
{  
    width: 7px;  /*滚动条宽度*/
    height: 7px;  /*滚动条高度*/
}  
  
/*定义滚动条轨道 内阴影+圆角*/  
::-webkit-scrollbar-track  
{  
    /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);   */
    border-radius: 10px;  /*滚动条的背景区域的圆角*/
    background-color: #fff;/*滚动条的背景颜色*/  
}  
  
/*定义滑块 内阴影+圆角*/  
::-webkit-scrollbar-thumb  
{  
    border-radius: 10px;  /*滚动条的圆角*/
    /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);   */
    background-color: #eee;  /*滚动条的背景颜色*/
}  


</style>
