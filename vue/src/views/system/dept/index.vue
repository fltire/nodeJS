<template>
    <div style="padding: 0 20px">
        <el-button v-if="$isPermissions('dept:add')" size="mini" type="primary" @click="addOrUpdate()" icon="el-icon-plus" style="margin-bottom:10px">新增</el-button>
        <el-table :data="dataList" style="width: 100%;margin-bottom: 20px;" :header-cell-style="{'background-color':'#f8f8f9'}"
            row-key="deptId" border default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column prop="deptName" label="部门名称"></el-table-column>
            <el-table-column prop="orderNum" label="部门顺序" width="80" align='center'></el-table-column>
            <el-table-column prop="deptCreate" label="创建时间"></el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button v-if="$isPermissions('dept:upt')" @click="addOrUpdate(scope.row.deptId)"  type="text" size="small"><i id="del" class="el-icon-edit"></i> 修改</el-button>
                    <el-button type="text" size="small" v-if="scope.row.son==='N'&&$isPermissions('dept:del')" @click="delMenu(scope.row.deptId)"><i id="del" class="el-icon-delete"></i> 删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <add-or-update ref="aou" :list='list' @getDeptData='getDeptList'></add-or-update>
    </div>
</template>
<script>
import {sendServer} from  '../../../utils/common'
import addOrUpdate from './addOrUpdate'
export default {
    data () {
        return {
            dataList: [],
            list: [],
        };
    },
    components: {
        addOrUpdate
    },
    mounted () {
        this.getDeptList()
    },
    methods: {
        /**
         * 获取菜单列表
         * @method getDeptList
         */
        getDeptList(){
            if(this.$isPermissions('dept:query')){
                let Params = {},
                    send = {}
                // Params.url = '/Servlet/SelectDept'
                Params.url = '/f/dept/getDept'
                Params.send = send
                sendServer(Params,this).then(
                    (res)=>{
                        console.log(res)
                        if(res.code===0){
                            this.list = res.data.list
                            this.dataList = this.handleTree(res.data.list, "deptId")
                        }
                    },(res)=>{
                    }
                )
            }
        },
        /**
         * 新增或修改
         * @method addOrUpdate
         * @param {object} id 修改的id
         */
        addOrUpdate(id=null){
            this.$refs.aou.init(id,this.list)
        },
        /**
         * 删除
         * @method delMenu
         * @param {number} id 要删除的id
         */
        delMenu(id){
            this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let Params = {},
                    send = {}
                Params.url = '/f/dept/delDept'
                // Params.url = '/Servlet/deletedept'
                send.deptId = id
                Params.send = send
                sendServer(Params,this).then(
                    (res)=>{
                        console.log(res)
                        if(res.code===0){
                            this.getDeptList()
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
            id = id || 'deptId'
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