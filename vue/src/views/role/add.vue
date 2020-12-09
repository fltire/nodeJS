<template>
<div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
    <el-tree :props="props" :data="list" show-checkbox node-key='name' ref="tree" @check-change="handleCheckChange"></el-tree>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddorUpdate">确 定</el-button>
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
        props: {
          label: 'name',
          children: 'list'
        },
        id:null,
        list:[],
        role:{spxz:true,spxg:true,spsc:true}
      };
    },
    methods: {
        //选择事件
       handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
        this.recursion1(this.list,data,checked)
        console.log(this.list)
      },
      //点击复选框时修改状态
      recursion1(list,data,checked){
           list.forEach((item)=>{
               if(item.list){
                   this.recursion1(item.list,data,checked)
               }else{
                   if(item===data){
                       item.value=checked?1:0
                   }
               }
           })
       },
      init(e){
        this.dialogVisible = true
        console.log(e)
        this.list=[]
        this.list = e.RolesFuncMap
        console.log(this.list[0].list)
        let p = []
        this.recursion(this.list,p)
        console.log(p)
        // console.log(this.$refs.tree.setCheckedKeys(['商品新增']))
        setTimeout(() => {
            this.$refs.tree.setCheckedKeys(p)
        }, 20);
      },
      //遍历默认勾选
       recursion(list,p){
           list.forEach((item)=>{
               if(item.list){
                   this.recursion(item.list,p)
               }else{
                   if(item.value===1){
                       p.push(item.name)
                       if(item.name==='商品新增'){
                           this.role.spxz = true
                       }else if(item.name==='商品修改'){
                           this.role.spxg = true
                       }else if(item.name==='商品删除'){
                           this.role.spsc = true
                       }
                   }else if(item.value===0){
                       if(item.name==='商品新增'){
                           this.role.spxz = false
                       }else if(item.name==='商品修改'){
                           this.role.spxg = false
                       }else if(item.name==='商品删除'){
                           this.role.spsc = false
                       }
                   }
               }
           })
       },
      AddorUpdate(){
        let Params = {}
        let send =this.list
        Params.url ='/f/storeAction/rolePriUpt'
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
                console.log(res.data)
                this.$message({
                    message: res.data,
                    type: 'success'
                });
                let p=[]
                this.recursion(this.list,p)
                this.$store.commit('updaterole',this.role)
                this.dialogVisible = false
                // this.$emit('AddorUpdate')
            },(res)=>{
            }
        )
      }
    }
  };
</script>