<template>
    <div style="padding: 0 20px">
        <el-button size="mini" type="primary" @click="addOrUpdate()" icon="el-icon-plus" style="margin-bottom:10px">新增</el-button>
        <el-table :data="dataList" style="width: 100%;margin-bottom: 20px;" :header-cell-style="{'background-color':'#f8f8f9'}"
            row-key="menuId" border default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column prop="menuName" label="菜单名称"></el-table-column>
            <el-table-column prop="icon" label="菜单图标" width="80" align='center'>
                <template slot-scope="scope">
                    <svg-icon :icon-class="scope.row.icon||''"></svg-icon>
                </template>
            </el-table-column>
            <el-table-column prop="menuType" label="菜单类型" width="80" align='center' >
                <template slot-scope="scope">
                    {{scope.row.menuType==='C' ? '菜单' :scope.row.menuType==='M' ? '目录' : '按钮'}}
                </template>
            </el-table-column>
            <el-table-column prop="orderNum" label="菜单顺序" width="80" align='center'></el-table-column>
            <el-table-column prop="component" label="组件路径"> </el-table-column>
            <el-table-column prop="perms" label="权限标识"> </el-table-column>
            <el-table-column prop="menuCreate" label="创建时间"></el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click="addOrUpdate(scope.row)"  type="text" size="small"><i id="del" class="el-icon-edit"></i> 修改</el-button>
                    <el-button type="text" size="small" v-if="scope.row.son==='N'" @click="delMenu(scope.row.menuId)"><i id="del" class="el-icon-delete"></i> 删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <add-or-update ref="aou" :list='list' @getMenuData='getMenuList'></add-or-update>
    </div>
</template>
<script>
import {sendServer} from  '../../../utils/common'
import addOrUpdate from './addOrUpdate'
import icons from "../../../icons/index"
export default {
    data () {
        return {
            dataList: [],
            list: [],
            icons:icons
        };
    },
    components: {
        addOrUpdate
    },
    mounted () {
        this.getMenuList()
    },
    methods: {
        /**
         * 获取菜单列表
         * @method getMenuList
         */
        getMenuList(){
            let Params = {},
                send = {}
            Params.url = '/f/menu/getMenu'
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                    console.log(res)
                    if(res.code===0){
                        this.list = res.data.list
                        this.dataList = this.handleTree(res.data.list, "menuId")
                    }
                },(res)=>{
                }
            )
        },
        /**
         * 新增或修改
         * @method addOrUpdate
         * @param {object} data 修改的数据
         */
        addOrUpdate(data=null){
            this.$refs.aou.init(data,this.list)
        },
        /**
         * 删除
         * @method delMenu
         * @param {number} id 要删除的id
         */
        delMenu(id){
            this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let Params = {},
                    send = {}
                Params.url = '/f/menu/delMenu'
                send.menuId = id
                Params.send = send
                sendServer(Params,this).then(
                    (res)=>{
                        console.log(res)
                        if(res.code===0){
                            this.getMenuList()
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
         * 把列表遍历成树
         * @method handleTree
         * @param {arrat} data 需要遍历的列表
         */
        handleTree(data, id, parentId, children, rootId) {
            id = id || 'menuId'
            parentId = parentId || 'parentId'
            children = children || 'children'
            rootId = rootId || Math.min.apply(Math, data.map(item => { return item[parentId] })) || 0
            //对源数据深度克隆
            const cloneData = JSON.parse(JSON.stringify(data))
            //循环所有项
            const treeData = cloneData.filter(father => {
                let branchArr = cloneData.filter(child => {
                    //返回每一项的子级数组
                    return father[id] === child[parentId]
                });
                branchArr.sort((a,b)=>{
                    return a.orderNum > b.orderNum ? 1 : -1
                })
                branchArr.length > 0 ? father.children = branchArr : '';
                //返回第一层
                return father[parentId] === rootId;
            });
            treeData.sort((a,b)=>{
                return a.orderNum > b.orderNum ? 1 : -1
            })
            return treeData != '' ? treeData : data;
        }
    }
}
</script>