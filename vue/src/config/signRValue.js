/*! 
* gaozh v1
*/
module.exports = {
  // 循环域签名配置
  R: [{
    TxnId: "10003",
    Desc: "注册",
    Res: [{
      Desc: "Function",
      Val: "R001"
    }]
  }, {
    TxnId: "10004",
    Desc: "UUID登陆",
    Res: [{
      Desc: "Function",
      Val: "R001"
    }]
  }, {
    TxnId: "10005",
    Desc: "手机号登陆",
    Res: [{
      Desc: "Function",
      Val: "R001"
    }]
  }, {
    TxnId: "10011",
    Desc: "删除商品",
    Res: [{
      Desc: "Goods",
      Val: "R002"
    }],
    Req: [{
      Desc: "Goods",
      Val: "R002"
    }]
  }, {
    TxnId: "10016",
    Desc: "删除商品分类",
    Res: [{
      Desc: "GoodsType",
      Val: "R004"
    }],
    Req: [{
      Desc: "GoodsType",
      Val: "R004"
    }]
  }, {
    TxnId: "20009",
    Desc: "修改操作员角色",
    Req: [{
      Desc: "Roles",
      Val: "R008"
    }]
  }, {
    TxnId: "20010",
    Desc: "新增当前店铺角色",
    Req: [{
      Desc: "Function",
      Val: "R001"
    }]
  }, {
    TxnId: "20011",
    Desc: "修改操作员角色",
    Req: [{
      Desc: "Function",
      Val: "R001"
    }]
  }, {
      TxnId: "20013",
      Desc: "新增店铺操作员",
    Req: [{
      Desc: "Roles",
      Val: "R008"
    }]
  }]
}