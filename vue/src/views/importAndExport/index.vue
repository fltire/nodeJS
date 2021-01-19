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
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="goodsAdd()">新增</el-button>
      <el-button type="success" size="mini" icon="el-icon-edit-outline" @click="goodsAdd(multipleSelection[0])" :disabled="multipleSelection.length!==1">修改</el-button>
      <el-button type="danger" size="mini" icon="el-icon-delete" @click="goodsDel()" :disabled='multipleSelection.length===0'>删除</el-button>
      <el-button type="primary" size="mini" icon="el-icon-upload2" @click="ExportExcel()">导出</el-button>
      <el-upload style="display:inline-block;margin-left:10px" class="upload-demo"
          action="" ref="upload" :show-file-list='false' :on-change="handleChange" :limit="1"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          :auto-upload="false">
          <el-button size="mini" type="primary" icon='el-icon-download'>导入</el-button>
      </el-upload>
    </div>
    <el-table v-loading="listLoading" :data="list" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f8f8f9'}" element-loading-text="Loading">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="goodsName" align="center" label="商品名称" ></el-table-column>
      <el-table-column prop="goodsTypeName" align="center" label="类型" ></el-table-column>
      <el-table-column prop="goodsRetailPrice" align="center" label="零售价"></el-table-column>
      <el-table-column prop="goodsStock" align="center" label="库存" ></el-table-column>
      <el-table-column prop="goodsCreate" align="center" label="商品添加时间"></el-table-column>
      <el-table-column align="center" label="操作" >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="goodsDel(scope.row.goodsId)"  ><i class="el-icon-edit-outline"></i>删除</el-button>
          <el-button size="mini" type="text" @click="goodsAdd(scope.row)"  ><i class="el-icon-delete"></i>修改</el-button>
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
    //上传文件时处理方法  
    handleChange(file, fileList){
        this.fileTemp = file.raw;
        if((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') 
            || (this.fileTemp.type == 'application/vnd.ms-excel')){
            this.importExcel(this.fileTemp);
        } else {
            this.$message({
                type:'warning',
                message:'附件格式错误，请重新上传！'
            })
            this.$refs.upload.uploadFiles =[]
        }
    },
    /**
     * 导入数据解析
     */
    importExcel(obj) {
        let That = this;
        let inputDOM = this.$refs.inputer;
        this.file = event.currentTarget.files[0];
        var rABS = false; //是否将文件读取为二进制字符串
        var f = this.file;
        var reader = new FileReader();
        FileReader.prototype.readAsBinaryString = function(f) {
            var binary = "";
            var rABS = false; //是否将文件读取为二进制字符串
            var pt = this;
            var wb; 
            var outdata;
            var reader = new FileReader();
            reader.onload = function(e) {
                var bytes = new Uint8Array(reader.result);
                var length = bytes.byteLength;
                for (var i = 0; i < length; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                var XLSX = require("xlsx");
                if (rABS) {
                    wb = XLSX.read(btoa(fixdata(binary)), {
                    type: "base64"
                    });
                } else {
                    wb = XLSX.read(binary, {
                    type: "binary"
                    });
                }
                outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); 
                console.log(outdata)
                //outdata就是读取的数据（不包含标题行即表头，表头会作为对象的下标）
                //此处可对数据进行处理
                let arr = [];
                outdata.map(item => {
                    let obj = {}
                    obj.goodsName = item['商品名称']
                    obj.goodsTypeName = item['类型']
                    obj.goodsRetailPrice = item['零售价']
                    obj.goodsStock = item['库存']
                    obj.goodsCreate = item['商品添加时间']
                    arr.push(obj)
                });
                That.importData(arr)
            };
            reader.readAsArrayBuffer(f);
        };
        if (rABS) {
            reader.readAsArrayBuffer(f);
        } else {
            reader.readAsBinaryString(f);
        }
    },
    importData(e){
        let Params = {}
        let send = {}
        Params.url = '/f/goodsAction/importData'
        send.list = e
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
              console.log(res)
              if(res.code===0){
                  this.fetchData()
                  this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                    this.$refs.upload.uploadFiles =[]
              }
            },(res)=>{
            }
        )
    },
    /**
     * 获取全部数据
     */
    ExportExcel(){
        let Params = {}
        let send = {}
        Params.url = '/f/goodsAction/goodsAllData'
        Params.send = send
        sendServer(Params,this).then(
            (res)=>{
              console.log(res)
              if(res.code===0){
                  this.frontEndExportExcel(res.data.list)
              }
            },(res)=>{
            }
        )
    },
    /**
     * 导出数据
     * @method frontEndExportExcel
     * @param {array} e 需要导出的数据
     */
    frontEndExportExcel(e) {
        require.ensure([], () => {
            const { export_json_to_excel } = require('../../vendor/export2Excel');
            // 设置Excel的表格第一行的标题
            const tHeader = ['商品名称', '类型', '零售价','库存','商品添加时间'];
            // 配置table中对应的字段index、code、name、time、remarks
            const filterVal = ['goodsName', 'goodsTypeName', 'goodsRetailPrice','goodsStock','goodsCreate'];
            // index、code、name、time、remarks是tableData里对象的属性
            const list = e; // 把要导出的数据放在这里
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, '商品');
        });
    },
    formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]));
    },
    /**
     * 商品分类
     * @method getGoodsType
     */
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
    /**
     * 新增用户时返回部门表
     * @method getUserDept
     */
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
            Params.url = '/f/goodsAction/goodsDel1'
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
        this.listLoading = true
        let Params = {}
        let send = {}
        Params.url = '/f/goodsAction/goodsQry1'
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
</script>
