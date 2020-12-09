const goodsList=[
  {GoodsId:13,GoodsName:'名称13',GoodsPyCode:'mingcheng13',GoodsTypeId:'1',GoodsTypeName:'食品类',GoodsUnit:'元',GoodsRetailPrice:'20',GoodsStock:'20',GoodsAddDate:'2020年10月27日'},
  {GoodsId:12,GoodsName:'名称12',GoodsPyCode:'mingcheng12',GoodsTypeId:'1',GoodsTypeName:'食品类',GoodsUnit:'元',GoodsRetailPrice:'20',GoodsStock:'20',GoodsAddDate:'2020年10月27日'},
  {GoodsId:11,GoodsName:'名称11',GoodsPyCode:'mingcheng11',GoodsTypeId:'1',GoodsTypeName:'食品类',GoodsUnit:'元',GoodsRetailPrice:'20',GoodsStock:'20',GoodsAddDate:'2020年10月27日'},
  {GoodsId:10,GoodsName:'名称10',GoodsPyCode:'mingcheng10',GoodsTypeId:'1',GoodsTypeName:'食品类',GoodsUnit:'元',GoodsRetailPrice:'20',GoodsStock:'20',GoodsAddDate:'2020年10月27日'},
  {GoodsId:9,GoodsName:'名称9',GoodsPyCode:'mingcheng9',GoodsTypeId:'1',GoodsTypeName:'食品类',GoodsUnit:'元',GoodsRetailPrice:'20',GoodsStock:'20',GoodsAddDate:'2020年10月27日'},
  {GoodsId:8,GoodsName:'名称8',GoodsPyCode:'mingcheng8',GoodsTypeId:'1',GoodsTypeName:'食品类',GoodsUnit:'元',GoodsRetailPrice:'20',GoodsStock:'20',GoodsAddDate:'2020年10月27日'},
  {GoodsId:7,GoodsName:'名称7',GoodsPyCode:'mingcheng7',GoodsTypeId:'1',GoodsTypeName:'食品类',GoodsUnit:'元',GoodsRetailPrice:'20',GoodsStock:'20',GoodsAddDate:'2020年10月27日'},
  {GoodsId:6,GoodsName:'名称6',GoodsPyCode:'mingcheng6',GoodsTypeId:'1',GoodsTypeName:'食品类',GoodsUnit:'元',GoodsRetailPrice:'20',GoodsStock:'20',GoodsAddDate:'2020年10月27日'},
  {GoodsId:5,GoodsName:'名称5',GoodsPyCode:'mingcheng5',GoodsTypeId:'1',GoodsTypeName:'食品类',GoodsUnit:'元',GoodsRetailPrice:'20',GoodsStock:'20',GoodsAddDate:'2020年10月27日'},
  {GoodsId:4,GoodsName:'名称4',GoodsPyCode:'mingcheng4',GoodsTypeId:'1',GoodsTypeName:'食品类',GoodsUnit:'元',GoodsRetailPrice:'20',GoodsStock:'20',GoodsAddDate:'2020年10月27日'},
  {GoodsId:3,GoodsName:'名称3',GoodsPyCode:'mingcheng3',GoodsTypeId:'1',GoodsTypeName:'食品类',GoodsUnit:'元',GoodsRetailPrice:'20',GoodsStock:'20',GoodsAddDate:'2020年10月27日'},
  {GoodsId:2,GoodsName:'名称2',GoodsPyCode:'mingcheng2',GoodsTypeId:'1',GoodsTypeName:'食品类',GoodsUnit:'元',GoodsRetailPrice:'20',GoodsStock:'20',GoodsAddDate:'2020年10月27日'},
]
module.exports = [
  //列表
  {
    url: '/goodsAction/goodsQry',
    type: 'post',
    response: config => {
      let list = goodsList.slice(10*(config.body.page-1),10*config.body.page)
      if(list.length===0){
        list = goodsList.slice(10*(config.body.page-2),10*(config.body.page-1))
      } 
      return {
        code: 20000,
        data: {
            AllCount:goodsList.length,
            goodsList:list
        }
      }
    }
  },
  //删除
  {
    url: '/goodsAction/goodsDel',
    type: 'post',
    response: config => {
      for(let i=0;i<goodsList.length;i++){
        if(config.body.GoodsId===goodsList[i].GoodsId){
          goodsList.splice(i,1)
            break;
        }
      }
      return {
        code: 20000,
        data: '删除成功'
      }
    }
  },
  //新增
  {
    url: '/goodsAction/goodsAdd',
    type: 'post',
    response: config => {
      let GoodsId = goodsList.length?goodsList[0].GoodsId+1:1
      let send = config.body
      send.GoodsId = GoodsId
      goodsList.unshift(send)
      return {
        code: 20000,
        data: '新增成功'
      }
    }
  },
  //修改
  {
    url: '/goodsAction/goodsUpt',
    type: 'post',
    response: config => {
      for(let i=0;i<goodsList.length;i++){
        if(config.body.GoodsId===goodsList[i].GoodsId){
        goodsList[i]=config.body
          break;
        }
      }
      return {
        code: 20000,
        data: '修改成功'
      }
    }
  },
]
  