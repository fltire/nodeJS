<template>
  <div style="height:100%;">
    <div class="left">
        <el-tree icon-class='el-icon-sort' :render-after-expand='false'  :data="tree" :props="defaultProps"  @node-click="handleNodeClick" @node-contextmenu="oprater" node-key="catId" :default-expanded-keys="['Root']"></el-tree>
    </div>
    <div class="right">
        <div class="right-main">
            <div style="height:100px" >
                <el-button size="mini" style="float:right;margin-bottom:10px"  icon="el-icon-open" @click="qiehuan">切换</el-button>
                <el-button size="small" icon="el-icon-edit" type="primary" @click="addOrUpdate()">新增</el-button>
                <el-button size="small" icon="el-icon-edit" type="success" @click="addOrUpdate('',multipleSelection[0].catId)" :disabled='multipleSelection.length!==1'>修改</el-button>
                <el-button size="small" icon="el-icon-edit" type="danger" :disabled='multipleSelection.length===0' @click="batchesDelete()">批量删除</el-button>
                <span v-show="tabShow" style="margin-left:10px">
                     <el-switch  inactive-color="#C0CCDA" active-color="#409EFF" inactive-text="改变顺序" style="z-index:10" v-model="bgBlack" @change='showBg'></el-switch>
                </span>
            </div>
            <el-form label-position="left" label-width="100px" inline class="demo-table-expand" v-show="!tabShow">
                <el-form-item label="分类图标">
                    <span>{{ data.catIcon }}</span>
                </el-form-item>
                <el-form-item label="分类名称">
                    <span>{{ data.catName }}</span>
                </el-form-item>
                <el-form-item label="详情">
                    <span>{{ data.memo }}</span>
                </el-form-item>
            </el-form>
            <el-table v-loading="listLoading" v-show="tabShow"  row-key="catId" ref="biaoge" :data="dataList" class="main-table" :expand-row-keys="expands" @expand-change="expand"
                    :header-row-style="{height:'20px'}"
                    :header-cell-style="{background:'#ebeef5',height:'20px'}"
                    @selection-change='selectionChange'>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="right" label-width="100px" inline class="demo-table-expand">
                            <el-form-item label="分类图标">
                                <span>{{ props.row.catIcon }}</span>
                            </el-form-item>
                            <el-form-item label="分类名称">
                                <span>{{ props.row.catName }}</span>
                            </el-form-item>
                            <el-form-item label="详情">
                                <span>{{ data.memo }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="catName"  label="分类名称"></el-table-column>
                <el-table-column prop="catIcon"  label="分类图标"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="addOrUpdate(scope.row.catId)" v-show="!bgBlack"><i class="el-icon-edit"></i>新增</el-button>
                    <el-button size="mini" type="text" @click="addOrUpdate(scope.row.catId,scope.row.catId)" v-show="!bgBlack"><i class="el-icon-edit-outline"></i>修改</el-button>
                    <el-popconfirm style="margin-left:10px"  :title="'确认删除“'+scope.row.catName+'”吗？'"  @onConfirm="delData(scope.row.catId,'left')">
                        <el-button size="mini" type="text" slot="reference" v-if="scope.row.isLeaf==='Y'&&!bgBlack"><i id="del" class="el-icon-document-delete"></i>删除</el-button>
                    </el-popconfirm>
                    <el-popover placement="right" width="200" v-show="bgBlack" :ref="`popover-${scope.$index}`" title="移动到第几行" trigger="click" style="margin-right:10px">
                        <el-input-number v-model="num"  :min="1" :max="dataList.length" ></el-input-number>
                        <el-button type="primary"  @click="moveList(scope.$index),scope._self.$refs[`popover-${scope.$index}`].doClose()" style="float:right;margin-top:10px">确定</el-button>
                        <el-button type="primary" size="mini" slot="reference">调整</el-button>
                    </el-popover>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <div class="tree-menu" v-show="menuShow" :style="menuStyle">
        <div class="tree-menu-item" @click="addOrUpdate(dt.catId)"><i class="el-icon-edit"></i> 新增</div>
        <div class="tree-menu-item" v-show="dt.catId!=='Root'" @click="addOrUpdate(dt.catId)"><i class="el-icon-edit-outline"></i> 修改</div>
        <el-popconfirm :title="'确认删除“'+dt.catName+'”吗？'" @onConfirm="delData(dt.catId,'left')">
            <div id="del" class="tree-menu-item" slot="reference" v-show="dt.isLeaf==='Y'"><i id="del" class="el-icon-document-delete"> 删除</i> </div>
        </el-popconfirm>
    </div>
    <div class="bg-black" v-show="bgBlack"></div>
    <add-or-update ref="addOrUpdate" @refreshData='refreshData'></add-or-update> 
  </div>
</template>
<script>
import {sendServer} from '../../utils/common'
import Sortable from 'sortablejs'
import addOrUpdate from "./goodUiAOU"
export default {
    data () {
        return {
            tree: [], // 树
            dataList: [], // 列表数据
            multipleSelection: [], // 表单多选
            data: {},
            dt: {}, // 右击选中的数据
            expands: [],
            sortCount: 0,
            memo: '',
            num: 1,
            listLoading: false,
            tabShow: true, // 表格显示
            menuShow: false,
            bgBlack: false, // 黑幕背景
            catPid: 'Root', // 列表的id，可以与dt对比父元素
            menuStyle: {},
            defaultProps: {
                children: 'children',
                label: 'catName',
                value: 'catId'
            }
        }
    },
    mounted(){
        console.log(this.$utils.UnderlineToShump('fan_wen'))

        this.getTree()
        this.getDataList()

    },
    components: {
        addOrUpdate
    },
    methods:{
        qiehuan(){
            this.$emit('qiehuan')
        },
        /**
         * 表格复选框勾选事件
         * @method selectionChange
         * @param {array} selection 已勾选的全部数据
         */
        selectionChange(selection){
            console.log(selection)
            this.multipleSelection = selection
        },
        /**
         * 表格点击展开详情事件
         * @method expand
         * @param {object} row 点击的行的数据
         * @param {array} exp 所有展开行的数组
         */
        expand(row,epx){
            if(epx.length){
                this.expands = []
                if(row){
                    this.expands.push(row.catId)
                    this.getCategoryById(row.catId)
                }
            }else{
                this.expands = []
            }
        },
        /**
         * 移动
         * @method moveList
         * @param {number} e 要移动的原始位置
         */
        moveList(e){
            let data = this.dataList.splice(e,1)
            this.dataList.splice(this.num-1,0,data[0])
            this.num = 1
            this.sortCount+=1
        },
        /**
         * 排序
         */
        sort(){
            let Params = {},
                send = {},
                arr = []
            send.catPid = this.catPid
            this.dataList.forEach((item, index) => {
                arr.push({"recycleSeq":item.sortSeq,"catId":item.catId,"sortSeq":index})
            })
            send.cateList = arr
            Params.url = '/sysadmin/uptCategorysSeq'
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                    console.log(res)
                    if(res.code===0){
                        this.$message({
                            message: '排序成功',
                            type: 'success'
                        });
                        this.dialogVisible = false
                        this.getTree()
                        this.getDataList()
                    }else{
                        console.log(res)
                    }
                },(res)=>{
                }
            )
        },
        /**
         * 根据主键查询
         * @method getCategoryById
         * @param {string} id 需要展示的数据的id
         */
        getCategoryById(id){
            let Params = {}
            let send = {
                catId:id
            }
            Params.url = '/sysadmin/getCategoryById'
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                    if(res.code===0){
                        this.data = res.data
                    }else{
                        console.log(res)
                    }
                },(res)=>{
                }
            )
        },
        /**
         * 更新树
         * @method getTree
         */
        getTree(){
            let p = {
                catName: '第一层',
                catId: 'Root',
                leaf:'',
                children:[]
            }
            this.recursion(p,'Root')
                this.tree.push(p)
                this.tree = []
            // setTimeout(() => {
            //     console.log(JSON.stringify(p))
            // }, 1000);
        },
        /**
         * 递归获取树的数据
         * @method recursion
         * @param {objact} obj 需要添加子数据的父
         * @param {string} id 需要获取数据的id
         */
        async recursion(obj,id){
            let Params = {},
                send = {},
                data = []
            send.catId = id
            Params.url = '/sysadmin/listCategorysByCon'
            Params.send = send
            await sendServer(Params,this).then(
                (res)=>{
                    if(res.code===0){
                        data = res.data
                    }else{
                        console.log(res)
                    }
                },(res)=>{
                }
            )
            for(let i = 0;i<data.length;i++){
                if(data[i].isLeaf==='N'){
                    data[i].children = []
                    obj.children.push(data[i])
                    this.recursion(data[i],data[i].catId)
                }else{
                     obj.children.push(data[i])
                }
            }
        },
        /**
         * 拖拽排序
         * @method setSort
         */
        setSort() {
            const el = this.$refs.biaoge.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
            if(this.bgBlack){
                this.sortable = Sortable.create(el, {
                    ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
                    setData: (dataTransfer) => {
                    // to avoid Firefox bug
                    // Detail see : https://github.com/RubaXa/Sortable/issues/1012
                    dataTransfer.setData('Text', '')
                    },
                    onEnd: evt => {
                        const targetRow = this.dataList.splice(evt.oldIndex, 1)[0]
                        this.dataList.splice(evt.newIndex, 0, targetRow)
                        this.sortCount+=1
                    }
                })
            }else{
                if(this.sortCount!==0){
                    this.sort()
                    this.sortCount=0
                }
                this.sortable.destroy()
            }
        },
        /**
         * 修改或新增后刷新列表和树
         * @method refreshData
         */
        refreshData(){
            this.getTree()
            this.getDataList()
        },
        /**
         * 删除事件
         * @method delData
         * @param {string} id 要删除数据的id
         * @param {string} s 检测是树删除还是表格删除，left是树删除
         */
        delData(id,s){
            console.log(1)
            let Params = {},
                send = {}
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
                    this.getDataList()
                    this.menuShow = false
                    this.getTree()
                    
                }else{
                    console.log(res)
                }
                },(res)=>{
                }
            )
        },
        batchesDelete(){
            for(let i=0;i<this.multipleSelection.length;i++){
                if(this.multipleSelection[i].isLeaf==='N'){
                    this.$message.error('只能选择没有子节点的数据');
                    return
                }
            }
            this.$confirm('确认删除？')
                .then(_ => {
                    let length = 0
                    for(let i=0;i<this.multipleSelection.length;i++){
                        let Params = {},
                            send = {}
                        Params.url = '/sysadmin/delCategoryById'
                        send.catId = this.multipleSelection[i].catId
                        Params.send = send
                        sendServer(Params,this).then(
                            (res)=>{
                            if(res.code===0){
                                length+=1
                                if(length===this.multipleSelection.length){
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    this.getDataList()
                                    this.menuShow = false
                                    this.getTree()
                                }
                            }else{
                                console.log(res)
                            }
                            },(res)=>{
                            }
                        )
                    }
                })
                .catch(_ => {});
        },
        /**
         * 滑块状态点击事件
         * @method showBg
         */
        showBg(){
            if(this.expands.length!==0){
                this.bgBlack = false
                this.$message({
                    message: '表格展开时不可以排序',
                    type: 'warning'
                });
            }else{
                this.setSort()
            }
        },
        /**
         * 添加或修改
         * @method addOrUpdate
         * @param {string} Pid 新增时父id
         * @param {string} id 修改的id
         */
        addOrUpdate(pid,id){
            this.$refs.addOrUpdate.init(pid,id)
        },
        /**
         * 树右击事件
         * @method opreater
         * @param {object} e event实例
         * @param {object} dt 点击的节点数据
         * @param {object} node 节点对应的node
         * @param {object} comp 节点组件本身
         */
        oprater(e, dt, node, comp) {
            this.dt = dt
            this.menuShow = true
            this.menuStyle = {top: e.pageY + 'px', left: e.pageX + 'px'}
            document.onclick =  (event) => {
                console.log(event.target.id)
                if(event.target.id!=='del'){
                    this.menuShow = false
                }
            }
        },
        /**
         * 树点击事件
         * @method handleNodeClick
         * @param {object} data 节点的信息
         */
        handleNodeClick(data) {
            console.log(data);
            if(data.isLeaf==='Y'){
                this.tabShow = false
                this.getCategoryById(data.catId)
            }else{
                this.tabShow = true
            }
            this.menuShow = false
            this.catPid = data.catId
            this.expands = []
            this.getDataList()
        },
        
        // 获取列表数据
        getDataList(){
             let Params = {},
                send = {}
            this.listLoading = true
            send.catId = this.catPid
            Params.url = '/sysadmin/listCategorysByCon'
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                    console.log(res)
                    if(res.code===0){
                        this.dataList = res.data
                        this.listLoading = false
                    }else{
                        console.log(res)
                    }
                },(res)=>{
                }
            )
        }
    }
}
</script>
<style>
.sortable-ghost{
  opacity: .8;
  /* color: #fff!important; */
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
}

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
.right{
    height: 100%;
    overflow: hidden;
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
.bg-black{
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0,0,0,.4);
    z-index: 5;
}
.main-table{
    z-index: 10;
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
