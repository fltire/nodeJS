/*! 
* gaozh v1
*/
module.exports = {
  // 交易信息配置
  "CustQryNum": "10",
  "TransSale": "1",
  "TransVoid": "3",
  "TransData": {
    "OrderSuccess": {// 订单交易成功
      "Status": "1",
      "Desc": "订单成功"
    },
    "OrderFail": {// 交易失败
      "Status": "2",
      "Desc": "订单失败"
    },
    "OrderRevoked": {// 交易被撤销
      "Status": "3",
      "Desc": "订单撤销"
    },
    "OrderPre": {// 订单交易预上送
      "Status": "4",
      "Desc": "订单预上送"
    },
    "OrderUnknown": {// 状态未知
      "Status": "9",
      "Desc": "状态未知"
    },
    Cash: "1",
    AliPay: "2",
    WeChat: "3",
    BankCard: "4",
    BlendPay: "9",
    BlendMode: "1", // 组合支付
    OtherMode: "2", // 非组合支付
    CashText: "现金",
    AliPayText: "支付宝",
    WeChatText: "微信",
    BankCardText: "银行卡",
    BlendPayText: "组合"
  },
  Sotre: {
    CalcType: {
      NoWipe: {// 不抹零
        Status: "9",
        Desc: "不抹零"
      },
      WipeCent: {//抹分
        Status: "1",
        Desc: "抹分"
      },
      WipeCorner: {//抹角
        Status: "2",
        Desc: "抹角"
      },
      FiveCorner: {//四舍五入到角
        Status: "3",
        Desc: "四舍五入到角"
      }
    },
    StockControl: {
      Control: {
        Status: "1",
        Desc: "库存控制",
        Memo: "库存不足时不允许交易"
      },
      Prompt: {
        Status: "2",
        Desc: "库存提示",
        Memo: "库存不足时提示收银员，由收银员确认是否继续交易"
      }
    },
    Flag: {
      Enable: {
        Status: "1",
        Desc: "启用"
      },
      Disable: {
        Status: "2",
        Desc: "停用"
      }
    },
    OwnerFlag: { // 店主标识OWNER ：店主
      Shopkeeper: {
        Flag: 1,
        Value: "OWNER"
      },
      Orther: {
        Flag: 2,
        Value: ""
      }

    },
    CopyGoods: {
      Enable: {
        Status: "1",
        Desc: "复制"
      },
      Disable: {
        Status: "2",
        Desc: "不复制"
      }
    }
  }

}