/*!
* gaozh v1
*/
module.exports = {
    //	交易码，返回码定义
    service: {
        project: "/cashiermng-server/ssMngModel/",           //生产地址

        httpFileUrl: '/upload-server/server', //云收银测试版上传图片地址

        // httpFileName: 'mchentry',         //测试账号
        // httpFilePasswd: 'ys88n12K8888',   //测试密码
        // //服务端文件目录
        // httpFilePos: 'spp/mchentry/mchentry/',    //测试路径
        // projectT: "https://ss-pmtest.shijicloud.com/baas/casherModel/", //云收银图片展示测试版地址


        httpFileName: 'cashphoto', //生产账号
        httpFilePasswd: '888888', //生产密码
        //服务端文件目录
        httpFilePos: 'cash/imgs/cashphoto/', //生产路径
        projectT: "https://ss-pm.shijicloud.com/cash/casherModel/",            //云收银图片展示生产版地址


        getGoodsImg: {
            url: "picAction",
            action: "getGoodsImg",
            txnId: "30002"
        },

        getLoginId: {
            url: "mngBaseAction",
            action: "getLoginId",
            txnId: "40001"
        },
        getLoginStatus: {
            url: "mngBaseAction",
            action: "getLoginStatus",
            txnId: "40002"
        },
        authLogin: {
            url: "mngBaseAction",
            action: "authLogin",
            txnId: "40003"
        },

        functionsQry: {
            url: "FunctionCodeAction",
            action: "functionsQry",
            txnId: "40004"
        },

        funcCodeQry: {
            url: "FunctionCodeAction",
            action: "funcCodeQry",
            txnId: "40005"
        },
        funcCodeUpt: {
            url: "FunctionCodeAction",
            action: "funcCodeUpt",
            txnId: "40006"
        },
        funcCodeAdd: {
            url: "FunctionCodeAction",
            action: "funcCodeAdd",
            txnId: "40007"
        },
        funcCodeDel: {
            url: "FunctionCodeAction",
            action: "funcCodeDel",
            txnId: "40008"
        },
        rolesMngQry: {
            url: "MsRoleInfoAction",
            action: "rolesMngQry",
            txnId: "40009"
        },
        roleMngQry: {
            url: "MsRoleInfoAction",
            action: "roleMngQry",
            txnId: "40010"
        },
        roleMngUpt: {
            url: "MsRoleInfoAction",
            action: "roleMngUpt",
            txnId: "40011"
        },
        roleMngAdd: {
            url: "MsRoleInfoAction",
            action: "roleMngAdd",
            txnId: "40012"
        },
        roleMngDel: {
            url: "MsRoleInfoAction",
            action: "roleMngDel",
            txnId: "40013"
        },
        usersMngQry: {
            url: "MsUserInfoAction",
            action: "usersMngQry",
            txnId: "40014"
        },
        userMngQry: {
            url: "MsUserInfoAction",
            action: "userMngQry",
            txnId: "40015"
        },
        userMngAdd: {
            url: "MsUserInfoAction",
            action: "userMngAdd",
            txnId: "40016"
        },
        userMngUpt: {
            url: "MsUserInfoAction",
            action: "userMngUpt",
            txnId: "40017"
        },
        userMngDel: {
            url: "MsUserInfoAction",
            action: "userMngDel",
            txnId: "40018"
        },

        instRegister: {
            url: "innerSysAction",
            action: "instRegister",
            txnId: "40019"
        },

        instQry: {
            url: "innerSysAction",
            action: "instQry",
            txnId: "40020"
        },

        uptInst: {
            url: "innerSysAction",
            action: "uptInst",
            txnId: "40021"
        },

        delInst: {
            url: "innerSysAction",
            action: "delInst",
            txnId: "40022"
        },

        userOprDayDetail: {
            url: "mngRptAction",
            action: "userOprDayDetail",
            txnId: "41001"
        },
        transSumDayDetail: {
            url: "mngRptAction",
            action: "transSumDayDetail",
            txnId: "41002"
        },
        payTypeDayDetail: {
            url: "mngRptAction",
            action: "payTypeDayDetail",
            txnId: "41003"
        },
        payTypeTotal: {
            url: "mngRptAction",
            action: "payTypeTotal",
            txnId: "41004"
        },
        transQry: {
            url: "mngRptAction",
            action: "transQry",
            txnId: "41005"
        },
        payTypeReport: {
            url: "mngRptAction",
            action: "paytypeReport",
            txnId: "41006"
        },
        payTransQry: {
            url: "mngRptAction",
            action: "payTransQry",
            txnId: "41007"
        },
        transIdQry: {
            url: "mngRptAction",
            action: "transIdQry",
            txnId: "41008"
        },
        storeBizReport: {
            url: "mngRptAction",
            action: "storeBizReport",
            txnId: "41009"
        },
        storeGrpQry: {
            url: "MsSStoregrpAction",
            action: "storeGrpQry",
            txnId: "40023"
        },
        storeGrpAdd: {
            url: "MsSStoregrpAction",
            action: "storeGrpAdd",
            txnId: "40024"
        },
        storesQry: {
            url: "storeInfoAction",
            action: "storesQry",
            txnId: "40025"
        },
        batchTidsQry: {
            url: "YhAction",
            action: "batchTidsQry",
            txnId: "40026"
        },
        batchTidsAdd: {
            url: "YhAction",
            action: "batchTidsAdd",
            txnId: "40027"
        },
        batchTidsUpt: {
            url: "YhAction",
            action: "batchTidsUpt",
            txnId: "40028"
        },
        goodsReport: {
            url: "mngRptAction",
            action: "goodsReport",
            txnId: "41010"
        },
        goodsTypeReport: {
            url: "mngRptAction",
            action: "goodsTypeReport",
            txnId: "41011"
        },

        busInfo: {
            url: "mchServer",
            action: "busInfo",
            txnId: "41012"
        },

        payTypeQueryAll: {
            url: "mchServer",
            action: "payTypeQueryAll",
            txnId: "41013"
        },

        parterQry: {
            url: "parterInstAction",
            action: "parterQry",
            txnId: "42001"
        },

        parterUpt: {
            url: "parterInstAction",
            action: "parterUpt",
            txnId: "42002"
        },

        parterAddStore: {
            url: "parterInstAction",
            action: "parterAddStore",
            txnId: "42003"
        },

        chTypeQueryAll: {
            url: "mchServer",
            action: "chTypeQueryAll",
            txnId: "50004"
        },

        qdInfoQueryAll: {
            url: "mchServer",
            action: "qdInfoQueryAll",
            txnId: "50005"
        },

        rptBusId: {
            url: "mchServer",
            action: "rptBusId",
            txnId: "41011"
        },

        rptBusIdDetail: {
            url: "mchServer",
            action: "rptBusIdDetail",
            txnId: "50006"
        },

        rptQd: {
            url: "mchServer",
            action: "rptQd",
            txnId: "50007"
        },

        rptQdDetail: {
            url: "mchServer",
            action: "rptQdDetail",
            txnId: "50008"
        },

        rptGrp: {
            url: "mchServer",
            action: "rptGrp",
            txnId: "50009"
        },

        mchGrp: {
            url: "mchServer",
            action: "mchGrp",
            txnId: "50010"
        },

        merInfo: {
            url: "mchServer",
            action: "merInfo",
            txnId: "50011"
        },

        mchHead: {
            url: "mchServer",
            action: "mchHead",
            txnId: "50012"
        },

        rptShop: {
            url: "mchServer",
            action: "rptShop",
            txnId: "50013"
        },

        rptHead: {
            url: "mchServer",
            action: "rptHead",
            txnId: "50014"
        },

        rptGrpDetail: {
            url: "mchServer",
            action: "rptGrpDetail",
            txnId: "50015"
        },

        rptShopDetail: {
            url: "mchServer",
            action: "rptShopDetail",
            txnId: "50016"
        },

        rptHeadDetail: {
            url: "mchServer",
            action: "rptHeadDetail",
            txnId: "50017"
        },

        mchNoTrans: {
            url: "mchServer",
            action: "mchNoTrans",
            txnId: "50018"
        },

        monitorMchQuery: {
            url: "mchServer",
            action: "monitorMchQuery",
            txnId: "50019"
        },

        monitorDashboard: {
            url: "mchServer",
            action: "monitorDashboard",
            txnId: "50020"
        },

    },
    resp: {
        success: {
            code: "0000",
            desc: "交易成功"
        },
        busiErr1: {
            code: "1001",
            desc: "智能POS上送Mid, Tid, StoreId与DB不一致"
        },
        busiErr2: {
            code: "1002",
            desc: "用户已注册，请登陆或重置密码登陆"
        },
        busiErr3: {
            code: "1003",
            desc: "渠道上送的Mid与DB不一致"
        },
        busiErr4: {
            code: "1004",
            desc: "当前店铺已经注册过,请联系店主授权登陆"
        },
        busiErr5: {
            code: "1005",
            desc: "上送POS_UUID已绑定"
        },
        busiErr6: {
            code: "1006",
            desc: "Pos上送MID-TID已绑定"
        },
        busiErr7: {
            code: "1007",
            desc: "上送手机号未注册"
        },
        busiErr8: {
            code: "1008",
            desc: "用户状态非法"
        },
        busiErr9: {
            code: "1009",
            desc: "用户ID， DB与上送不一致，重新登陆"
        },
        busiErr10: {
            code: "1010",
            desc: "用户id，storeId DB与上送不一致，系统错误，请联系管理员"
        },
        busiErr11: {
            code: "1011",
            desc: "用户无此权限"
        },
        busiErr12: {
            code: "1012",
            desc: "注册失败,店铺对应管理员角色未找到"
        },
        busiErr13: {
            code: "1013",
            desc: "注册失败,店铺对应管理员角色功能未找到,请联系后台"
        },
        busiErr14: {
            code: "1014",
            desc: "店铺上送storeId与系统终端表登记不一致"
        },
        busiErr15: {
            code: "1015",
            desc: "短信失败，短信平台返回错误统一返回该返回码"
        },
        busiErr18: {
            code: "1018",
            desc: "删除失败,商品有锁定库存"
        },
        dbErr1: {
            code: "4001",
            desc: "智能POS的IEMI,数据库未找到对应记录"
        },
        dbErr2: {
            code: "4002",
            desc: "用户手机号,数据库未找到对应记录"
        },
        dbErr3: {
            code: "4003",
            desc: "根据渠道上送的StoreId，数据库StoreInfo未找到对应记录"
        },
        dbErr4: {
            code: "4004",
            desc: "智能POS的IEMI,数据库未找到user_poslogin对应记录"
        },
        dbErr5: {
            code: "4005",
            desc: "手机的IEMI,数据库未找到user_Mobilelogin记录"
        },
        dbErr6: {
            code: "4006",
            desc: "根据user_id手机的IEMI,数据库未找到user_Store记录"
        },
        dbErr7: {
            code: "4007",
            desc: "根据mid数据库未找到mid_info记录"
        },
        dbErr8: {
            code: "4008",
            desc: "根据mid-tid数据库未找到tid_info记录"
        },
        dbErr9: {
            code: "4009",
            desc: "数据库未找到user_info记录"
        },
        dbErr10: {
            code: "4010",
            desc: "数据库未找到user_role记录"
        },
        dbErr11: {
            code: "4011",
            desc: "数据库未找到midStoreInfo记录"
        },
        commErr1: {
            code: "8001",
            desc: "socket建立失败"
        },
        commErr2: {
            code: "8002",
            desc: "写报文失败"
        },
        commErr3: {
            code: "8003",
            desc: "接收报文失败"
        },
        commErr4: {
            code: "8004",
            desc: "未知错误，需要查看日志"
        },
        sysErr1: {
            code: "9001",
            desc: "系统内部错误"
        },
        sysErr2: {
            code: "9002",
            desc: "系统未找到表名"
        },
        sysErr3: {
            code: "9003",
            desc: "请求报文非法"
        },
        sysErr4: {
            code: "9004",
            desc: "系统内部取配置文件错误"
        }
    }
};
