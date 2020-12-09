/*!
* gaozh v1
*/
var packValue = require("./../config/packValue");
var functionDetail = require("./../config/functionDetail");
/*
 * 获取6位随机数
 */
var pubRandom = function (urlParams) {

    var Num = "";
    for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    // urlParams.SsPackReqCasher = Num;
    urlParams.SsPackReqCasher = '867357';

    return true;
};
var fmoney = function (s, n, f) {

    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
    var t = "";
    for (var i = 0; i < l.length; i++) {
        if (f === 1) {
            t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
        } else {
            t += l[i];
        }
    }
    return t.split("").reverse().join("") + "." + r;
};
// 打包
var pack = function (urlParams) {
    var packJson = {};
    for (var i = 0; i < packValue.Y.length; i++) {
        if (urlParams[packValue.Y[i].Desc] === undefined || urlParams[packValue.Y[i].Desc] === "undefined") {
            continue;
        }
        packJson[packValue.Y[i].Val] = urlParams[packValue.Y[i].Desc];
    }
    for (i = 0; i < packValue.R.length; i++) {
        if (urlParams[packValue.R[i].Desc] === undefined || urlParams[packValue.R[i].Desc] === "undefined") {
            continue;
        }
        var uR = urlParams[packValue.R[i].Desc];
        var Rr = packValue.R[i].Rr;
        packJson[packValue.R[i].Val] = packR(uR, Rr);

    }
    for (i = 0; i < packValue.Z.length; i++) {
        if (urlParams[packValue.Z[i].Desc] === undefined || urlParams[packValue.Z[i].Desc] === "undefined") {
            continue;
        }
        packJson[packValue.Z[i].Val] = urlParams[packValue.Z[i].Desc];
    }
    for (i = 0; i < packValue.S.length; i++) {
        if (urlParams[packValue.S[i].Desc] === undefined || urlParams[packValue.S[i].Desc] === "undefined") {
            continue;
        }
        packJson[packValue.S[i].Val] = urlParams[packValue.S[i].Desc];
    }

    //特殊处理
    if (urlParams.BusId != null) {
        packJson.BusId=urlParams.BusId;
    }
    if (urlParams.PayType != null) {
        packJson.PayType=urlParams.PayType;
    }
    if (urlParams.ChType != null) {
        packJson.ChType=urlParams.ChType;
    }
    if (urlParams.QdId != null) {
        packJson.QdId=urlParams.QdId;
    }
    if (urlParams.SumPayAmt != null) {
        packJson.SumPayAmt=urlParams.SumPayAmt;
    }
    if (urlParams.SumInvAmt != null) {
        packJson.SumInvAmt=urlParams.SumInvAmt;
    }
    if (urlParams.ReportType != null) {
        packJson.ReportType=urlParams.ReportType;
    }
    if (urlParams.GrpCode != null) {
        packJson.GrpCode=urlParams.GrpCode;
    }
    if (urlParams.MerCode != null) {
        packJson.MerCode=urlParams.MerCode;
    }
    if (urlParams.HeadCode != null) {
        packJson.HeadCode=urlParams.HeadCode;
    }
    if (urlParams.NoTransDays != null) {
        packJson.NoTransDays=urlParams.NoTransDays;
    }

    return packJson;
};
var packR = function (uR, Rr) {
    var endR = [];
    for (var i = 0; i < uR.length; i++) {
        var endRr = {};
        var uRi = uR[i];
        for (var j = 0; j < Rr.length; j++) {
            if (uRi[Rr[j].Desc] === undefined || uRi[Rr[j].Desc] === "undefined") {
                continue;
            }
            endRr[Rr[j].Val] = uRi[Rr[j].Desc];
        }
        endR[i] = endRr;
    }
    return endR;
};
// 解包
var unPack = function (urlParams) {
    var unPackJson = {};
    for (var i = 0; i < packValue.Y.length; i++) {
        if (urlParams[packValue.Y[i].Val] === undefined) {
            continue;
        }
        unPackJson[packValue.Y[i].Desc] = urlParams[packValue.Y[i].Val];
    }
    for (i = 0; i < packValue.R.length; i++) {
        if (urlParams[packValue.R[i].Val] === undefined) {
            continue;
        }
        var uR = urlParams[packValue.R[i].Val];
        var Rr = packValue.R[i].Rr;
        unPackJson[packValue.R[i].Desc] = unPackR(uR, Rr);

    }
    for (i = 0; i < packValue.Z.length; i++) {
        if (urlParams[packValue.Z[i].Val] === undefined) {
            continue;
        }
        unPackJson[packValue.Z[i].Desc] = urlParams[packValue.Z[i].Val];
    }
    for (i = 0; i < packValue.S.length; i++) {
        if (urlParams[packValue.S[i].Val] === undefined) {
            continue;
        }
        unPackJson[packValue.S[i].Desc] = urlParams[packValue.S[i].Val];
    }
    unPackJson.orgData=urlParams;
    return unPackJson;
};
var unPackR = function (uR, Rr) {
    var endR = [];
    for (var i = 0; i < uR.length; i++) {
        var endRr = {};
        var uRi = uR[i];
        for (var j = 0; j < Rr.length; j++) {
            endRr[Rr[j].Desc] = uRi[Rr[j].Val];
        }
        endR[i] = endRr;
    }
    return endR;
};

/**
 * 将list装换成tree
 * @param {Object } id    节点主ID
 * @param {Object } pId   父节点ID
 * @param {Object } list  list数据
 * @return {Node} - 自定义Node树节点
 */
var listToTree = (id, pId, list) => {
    convertToNodeList(list);

    /**
     * @param {} list        list
     * @param {} pId        父节点
     * @return {Boolean}    是否存在父节点
     * @description now.id = other.pid   other 的父节点为 noew
     */
    function exists(list, pId) {
        for (var i = 0; i < list.length; i++) {
            if (list[i][id] == pId) {
                return true;
            }
        }
        return false;
    }

    /**
     * 树节点数据  最终数据结构
     * @type  Node treeNode
     */
    var nodes = [];


    /**
     * 将所有的节点数据装入List
     * @type Number
     */
    for (var i = 0; i < list.length; i++) {
        var row = list[i];
        if (!exists(list, row[pId])) {//now.pid != new.id
            nodes.push(row);//new ids
        }
    }

    /**
     * 父节点
     * @type Node
     */
    var pNodes = [];

    /**
     * 将所有的子节点数据装入 pNodes
     * @type pNodes
     */
    for (var i = 0; i < nodes.length; i++) {
        pNodes.push(nodes[i]);
    }


    /**
     * 循环处理所有节点数据并进行封装
     */
    while (pNodes.length) {

        /**
         *  把数组的第一个元素从其中删除，并返回第一个元素的值
         *  the parent node
         */
        var node = pNodes.shift();

        /**
         *
         * get the children nodes
         */
        for (var i = 0; i < list.length; i++) {
            var row = list[i];
            /**
             * 取出list所有数据 比较处理
             *
             * 这里可以定制化 Node 节点数据结构
             * {
             *   "isActive": true,
             *   "isRoot": true,
             *   "title": "标题1",
             *   "items": [
             *       {
             *           "text": "内容1"
             *       },
             *       {
             *           "text": "内容2"
             *       }
             *   ]
             * }
             */
            if (row[pId] == node[id]) {
                /**
                 * 如果有items 直接放入
                 */
                if (node.menuBeans) {
                    node.menuBeans.push(row);
                } else {
                    node.menuBeans = [row];
                }
                pNodes.push(row);
            }
        }
    }
    return nodes;
};
var convertToNodeList = (list) => {
    // $.each(list,function(i,e){
    //
    // })
    list.forEach(e => {
        e['title'] = e.NAME;
        e['isRoot'] = (e.PARENT_ID == '-1');
        e['isActive'] = (e.ENABLE_STATUS == '01');
    });
    return list;
};

var contains = (a, obj) => {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return i;
        }
    }
    return false;
};


// funcMap 转list
const funcMap2List = function (FuncMap) {
    let FunctionLocal = [];
    //获取所有清单文件中的权限
    functionDetail.Function.forEach(item => {
        FunctionLocal.push(item);
    })
    let FunctionArray = [];
    if (FunctionLocal.length > 1) {
        FunctionLocal.sort(function (a, b) {
            return a.Sort > b.Sort ? 1 : -1
        });
    }
    //若FuncMap为ALL,获取所有的权限
    if (FuncMap === 'ALL') {
        FunctionLocal.forEach(item => {
            let functionInfo = {
                Id: item.FunctionId,
                ParentId: item.FunctionParentId
            }
            FunctionArray.push(functionInfo);
        })
    } else {
        let FuncBinTmp = hex_to_bin(FuncMap)
        let FuncBin = postSupplement(FuncBinTmp, FunctionLocal.length);
        for (let i = 0; i < FuncBin.length; i++) {
            let cFuncBin = FuncBin.substr(i, 1);
            if (FuncBin.substr(i, 1) === '1') {
                let functionInfo = {
                    Id: FunctionLocal[i].FunctionId,
                    ParentId: FunctionLocal[i].FunctionParentId
                }
                FunctionArray.push(functionInfo);
            }
        }
    }
    return FunctionArray;
};


// funcMap 转list
const funcList2Map = function (FuncArray) {
    let FuncMap = '';
    let FuncMapBin = '';

    let FunctionLocal = [];
    functionDetail.Function.forEach(item => {
        FunctionLocal.push(item);
    })

    let FunctionArray = [];
    if (FunctionLocal.length > 1) {
        FunctionLocal.sort(function (a, b) {
            return a.Sort > b.Sort ? 1 : -1
        });
    }

    FunctionLocal.forEach(item => {
        let cFuncMap = '0';
        if (FuncArray[item.FunctionId]) {
            cFuncMap = '1';
        }
        FuncMapBin += cFuncMap;
    })
    FuncMap = bin_to_hex(FuncMapBin);

    return FuncMap
}



// payMap 转list
const payList2Map = function (PayArray) {
    let PayMap = '';
    let PayMapBin = '';

    let PayLocal = [];
    functionDetail.Pay.forEach(item => {
        PayLocal.push(item);
    })

    if (PayLocal.length > 1) {
        PayLocal.sort(function (a, b) {
            return a.Sort > b.Sort ? 1 : -1
        });
    }
    PayLocal.forEach(item => {
        let cFuncMap = '0';
        if (PayArray[item.Id]) {
            cFuncMap = '1';
        }
        PayMapBin += cFuncMap;
    })
    PayMap = bin_to_hex(PayMapBin);

    return PayMap
}




// PayTypeMap 转list
const payTypeMap2List = function(PayTypeMap) {
    let PayLocal = [];
    functionDetail.Pay.forEach(item => {
        PayLocal.push(item);
    })
    let PayArray = [];
    if (PayLocal.length > 1) {
        PayLocal.sort(function(a, b) {
            return a.Sort > b.Sort ? 1 : -1
        });
    }

    let PayTypeBinTmp = hex_to_bin(PayTypeMap)
    let PayTypeBin = postSupplement(PayTypeBinTmp, PayLocal.length);
    for (let i = 0; i < PayTypeBin.length; i++) {
        let cPayTypeBin = PayTypeBin.substr(i, 1);
        if (PayTypeBin.substr(i, 1) === '1') {
            let PayTypeInfo = {
                Id: PayLocal[i].Id
            }
            PayArray.push(PayTypeInfo);
        }

    }
    return PayArray;
}


// 十六进制转换二进制(本次转换的方法没有考虑带小数点的情况)
// 如果长度没有超过13位，可以用parseInt("125adf8", 16).toString(2) = '1001001011010110111111000',
const hex_to_bin = (str) => {
    let strBin = '';
    for (let i = 0; i < Math.ceil(str.length / 12); i++) {
        // 由于转int时，最前面的0会被去掉，先在最前面加上F，然后再删除
        let strTmp = parseInt('F' + str.substr(i * 12, 12), 16).toString(2)
        strBin += strTmp.substr(4, strTmp.length);
    }
    return strBin
};
// 二进制转十六进制(本次转换的方法没有考虑带小数点的情况)
const bin_to_hex = (strBin) => {
    let strHex = '';
    // 取出的二进制不能被4整除需补0；
    let len = Math.ceil(strBin.length / 4);
    let strBinTmp = postSupplement(strBin, len * 4);
    for (let i = 0; i < Math.ceil(len / 12); i++) {
        // 由于转int时，最前面的0会被去掉，先在最前面加上'1111'，然后再删除
        let strTmp = parseInt('1111' + strBinTmp.substr(i * 4 * 12, 4 * 12), 2).toString(16)
        strHex += strTmp.substr(1, strTmp.length);
    }
    return strHex
};

// 后补0
function postSupplement(num, length) {
    return (num + Array(length).join('0')).substr(0, length);
}

module.exports = {
    pubRandom: pubRandom,
    fmoney: fmoney,
    pack: pack,
    unPack: unPack,
    listToTree,
    contains,
    funcMap2List,
    hex_to_bin,
    bin_to_hex,
    postSupplement,
    funcList2Map,
    payList2Map,
    payTypeMap2List
};
