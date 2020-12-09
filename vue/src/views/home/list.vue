<template>
    <div>
        <el-dialog title="排序" :visible.sync="dialogVisible" width="75%" >
            <el-table row-key="catId" :data="list"  border fit highlight-current-row @sort-change='paixu' ref="biaoge">
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column prop="catIcon" align="center" label="分类图标"></el-table-column>
                <el-table-column prop="catName" align="center" label="分类名称">
                    <template slot="header" slot-scope="scope">
                        分类名称
                        <el-button style="float：right" size="mini" type="text" icon="el-icon-sort"  @click="upSort('catName')"></el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-popover placement="right" width="200" :ref="`popover-${scope.$index}`" title="移动到第几行" trigger="click" style="margin-right:10px">
                            <el-input-number v-model="num"  :min="1" :max="list.length" ></el-input-number>
                            <el-button type="primary" size="mini" @click="moveList(scope.$index),scope._self.$refs[`popover-${scope.$index}`].doClose()" style="float:right;margin-top:10px">确定</el-button>
                            <el-button type="primary" size="mini" slot="reference">调整</el-button>
                        </el-popover>
                        <el-button size="mini" v-if="scope.$index!==0" @click="up(scope.$index)" icon="el-icon-caret-top"></el-button>
                        <el-button size="mini" v-if="scope.$index!==list.length-1" @click="down(scope.$index)" icon="el-icon-caret-bottom"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sort">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {sendServer} from '../../utils/common'
import Sortable from 'sortablejs'
  export default {
    data() {
      return {
        dialogVisible: false,
        list: [],
        id: '',
        num: 1,
        visible: [],
        arrows:false
      };
    },
    methods: {
        /**
         * 整体排序
         * @method upSort
         * @param {string} e 根据e列排序
         */
        upSort(e){
            this.arrows = !this.arrows
            this.list.sort( (a, b) =>{
                var val1 = a[e];
                var val2 = b[e];
                console.log(val1,val2)
                if(this.arrows){
                    return val1>val2 ? 1 : -1
                } else {
                    return val2>val1 ? 1 : -1
                }
                // return this.arrows ? val1.localeCompare(val2) : val2.localeCompare(val1);
                // return this.arrows ? Number(val1>val2) : Number(val2 > val1);
            })
        },
        /**
         * 排序
         * @method paixu
         */
        paixu({column, prop, order}){
            // this.list = this.$refs.biaoge.tableData
            console.log(column)
            console.log(prop)
            console.log(order)
            console.log(this.$refs.biaoge)
        },
        /**
         * 移动
         * @method moveList
         * @param {number} e 要移动的原始位置
         */
        moveList(e){
            let data = this.list.splice(e,1)
            this.list.splice(this.num-1,0,data[0])
            this.num = 1
        },
        /**
         * 拖拽排序
         * @method setSort
         */
        setSort() {
            const el = this.$refs.biaoge.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
            this.sortable = Sortable.create(el, {
                ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
                setData: (dataTransfer) => {
                // to avoid Firefox bug
                // Detail see : https://github.com/RubaXa/Sortable/issues/1012
                dataTransfer.setData('Text', '')
                },
                onEnd: evt => {
                    const targetRow = this.list.splice(evt.oldIndex, 1)[0]
                    this.list.splice(evt.newIndex, 0, targetRow)
                }
            })
        },
        /**
         * 初始化数据
         * @method init
         * @param {string} id 父的id
         */
        init(id){
            this.dialogVisible = true
            this.list = []
            let Params = {},
                send = {}
            this.listLoading = true
            send.catId = id
            Params.url = '/sysadmin/listCategorysByCon'
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                    console.log(res)
                    if(res.code===0){
                        // this.dataList = res.data
                        this.list = res.data
                        this.setSort()
                        this.listLoading = false
                    }else{
                        console.log(res)
                    }
                },(res)=>{
                }
            )
            this.id = id
        },
        /**
         * 向上
         * @method up
         * @param {number} e 改动的数据的序号
         */
        up(e){
            let data = this.list.splice(e,1)
            this.list.splice(e-1,0,data[0])
        },
        /**
         * 向下
         * @method down
         * @param {number} e 改动的数据的序号
         */
        down(e){
            let data = this.list.splice(e,1)
            this.list.splice(e+1,0,data[0])
            console.log(this.list)
        },
        /**
         * 排序
         */
        sort(){
            let Params = {},
                send = {},
                arr = []
            send.catPid = this.id
            this.list.forEach((item, index) => {
                arr.push({"recycleSeq":item.sortSeq,"catId":item.catId,"sortSeq":index})
            })
            send.cateList = arr
            Params.url = '/sysadmin/uptCategorysSeq'
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                    console.log(res)
                    if(res.code===0){
                        this.$emit('getData')
                        this.$message({
                            message: '排序成功',
                            type: 'success'
                        });
                        this.dialogVisible = false
                    }else{
                    console.log(res)
                    }
                },(res)=>{
                }
            )
        }
    }
  };
</script>