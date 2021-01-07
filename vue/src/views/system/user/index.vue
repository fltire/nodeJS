<template>
    <div class="main">
        <div class="left" style="margin-right:20px" v-show="roleId == 1">
            <el-tree :data="tree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
        <div class="right">
            <div class="top">
                <el-form :model="dataForm" :inline="true" size="small" label-width="80px" class="demo-ruleForm" style="overflow:hidden">
                    <el-form-item label="用户名称" prop="userName" >
                        <el-input v-model="dataForm.userName" clearable placeholder="请输入用户名称"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="gender" >
                        <el-select clearable v-model="dataForm.gender" placeholder="请选择" style="width:100%">
                            <el-option v-for="item in genderList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone" >
                        <el-input v-model="dataForm.phone" clearable placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="reset">重置</el-button>
                        <el-button @click="getUserData">查询</el-button>
                    </el-form-item>
                </el-form>
                <el-button v-if="$isPermissions('user:add')" type="primary" size="mini" icon="el-icon-plus" @click="addOrUpdate()">新增</el-button>
                <el-button v-if="$isPermissions('user:upt')" type="success" size="mini" icon="el-icon-edit-outline" @click="addOrUpdate(multipleSelection[0])" :disabled="multipleSelection.length!==1">修改</el-button>
                <el-button v-if="$isPermissions('user:del')" type="danger" size="mini" icon="el-icon-delete" @click="delUser()" :disabled='multipleSelection.length===0'>删除</el-button>
            </div>
            <el-table v-loading="listLoading" :data="dataList" style="width: 100%" :header-cell-style="{background:'#f8f8f9'}" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="userName" label="用户名称"></el-table-column>
                <el-table-column prop="nickName" label="用户昵称"></el-table-column>
                <el-table-column prop="deptName" label="部门"></el-table-column>
                <el-table-column prop="phone" label="手机号码"></el-table-column>
                <el-table-column prop="userCreate" label="创建时间"></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="$isPermissions('user:upt')&&scope.row.userId!==1" size="mini" type="text" @click="addOrUpdate(scope.row)" ><i class="el-icon-edit-outline"></i>修改</el-button>
                        <el-button v-if="$isPermissions('user:del')&&scope.row.userId!==1" size="mini" type="text" @click="delUser(scope.row.userId)"><i class="el-icon-delete"></i>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                layout="prev, pager, next"
                :total="count"
                @current-change=currentChange>
            </el-pagination>
            <add-or-update ref="aou" @getUserData="getUserData"></add-or-update>
        </div>
    </div>
</template>
<script>
import { sendServer } from "../../../utils/common";
import addOrUpdate from "./addOrUpdate";
export default {
  data() {
    return {
      dataList: [],
      dataForm: {
        userName: "",
        gender: "",
        phone: "",
      },
      defaultProps: {
        children: 'children',
        label: 'dept_name'
      },
      roleId:'',
      tree:[],
      deptId:'',
      genderList: [
        { value: "0", label: "女" },
        { value: "1", label: "男" },
      ],
      multipleSelection: [],
      count: null,
      page: 1,
      listLoading: false,
    };
  },
  mounted() {
    this.roleId = JSON.parse(localStorage.getItem('userdata')).roleId
    this.getUserData();
    this.getUserDept()
  },
  components: {
    addOrUpdate,
  },
  methods: {
    handleNodeClick(e){
        console.log(e)
        this.deptId = e.dept_id
        this.getUserData()
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
                    this.tree =  res.data.list
                }
            }
        )
    },
    /**
     * 获取用户列表
     * @method getUserData
     */
    getUserData() {
      if (this.$isPermissions("user:query")) {
        let Params = {},
          send = {};
        this.listLoading = true;
        // Params.url = '/Servlet/userselect'
        Params.url = "/f/user/getUserData";
        send.page = this.page;
        send.userName = this.dataForm.userName;
        send.gender = this.dataForm.gender;
        send.phone = this.dataForm.phone;
        send.deptId = this.deptId
        Params.send = send;
        sendServer(Params, this).then(
          (res) => {
            console.log(res);
            if (res.code === 0) {
              this.dataList = res.data.list;
              this.count = res.data.count;
              this.listLoading = false;
            }
          },
          (res) => {}
        );
      }
    },
    /**
     * 清空条件查询，并刷新数据
     */
    reset() {
      this.dataForm.userName = "";
      this.dataForm.gender = "";
      this.dataForm.phone = "";
      this.deptId = ''
      this.getUserData();
    },
    /**
     * 新增或修改
     * @method addOrUpdate
     * @param {object} data 需要修改的数据
     */
    addOrUpdate(data) {
      console.log(data);
      this.$refs.aou.init(data);
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
     * 分页点击事件
     * @method currenChange
     * @param {number} e 点击的分页，要跳转到的页码
     */
    currentChange(e) {
      console.log(e);
      if (this.page !== e) {
        this.page = e;
        this.getUserData();
      }
    },
    /**
     * 删除
     * @method delUser
     * @param {number} id 点击行删除时要删除的数据的id
     */
    delUser(id) {
      console.log(id);
      let arr = id ? [id] : this.multipleSelection.map((item) => item.userId);
      console.log(arr);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let Params = {},
            send = {};
          Params.url = "/f/user/delUser";
          // Params.url = '/Servlet/deleteuser'
          send.ids = arr;
          Params.send = send;
          sendServer(Params, this).then(
            (res) => {
              console.log(res);
              if (res.code === 0) {
                this.getUserData();
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              }
            },
            (res) => {}
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  padding: 20px;
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
</style>