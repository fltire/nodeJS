<template>
    <div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="50%"
            >
            <div>分类图标：{{data.catIcon}}</div>
            <div>分类名称：{{data.catName}}</div>
            <div>备注：{{data.memo}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {sendServer} from '../../utils/common'
  export default {
    data() {
      return {
        dialogVisible: false,
        data: {}
      };
    },
    methods: {
        /**
         * 初始化数据
         * @method init
         * @param {string} id 需要展示的数据的id
         */
        init(id){
            this.dialogVisible = true
            this.getCategoryById(id)
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
                    console.log(res)
                    if(res.code===0){
                    this.data = res.data
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