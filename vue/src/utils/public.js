// 公共函数

/**
 * 获取当前的年月日时分秒，自定义格式
 * @method getFormatTime
 * @param {string} format 想要的到的时间的格式，比如说'YYYY-MM-dd hh:mm:ss'
 */
const getFormatTime = function(format='yyyy-MM-dd hh:mm:ss'){
    const date = new Date();
    var o = { 
        "M+" : date.getMonth()+1,                 //月份 
        "d+" : date.getDate(),                    //日 
        "h+" : date.getHours(),                   //小时 
        "m+" : date.getMinutes(),                 //分 
        "s+" : date.getSeconds(),                 //秒 
        "q+" : Math.floor((date.getMonth()+3)/3), //季度 
        "S"  : date.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(format)) {
        format=format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)){
            format = format.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return format; 
}
/**
 * 金额格式,保留两位小数
 * @method toMoney
 * @param {number} num 转换成金额格式的数字
 */
const toMoney = num => {
    num = Number(num).toFixed(2);
    console.log(num)
    num = parseFloat(num)
    num = num.toLocaleString();
    let snum = num.toString().split('.')
    if(snum.length===1){
        num+='.00'
    }else if(snum[1].length<2){
        num+='0'
    }
    return num; //返回的是字符串23,245.12保留2位小数
}
/**
 * 小驼峰转下划线
 * @param {string} str 需要转换成下划线的小驼峰 
 */
const ShumpToUnderline = str => {
    return str.replace(/\B([A-Z])/g, '_$1').toLowerCase()
}
const UnderlineToShump = str => {
    // let arr = str.split('_')
    // for(let i =0;i<arr.length;i++){
    //     arr[i]=
    // }
}

module.exports = {
    getFormatTime,
    toMoney,
    ShumpToUnderline,
    UnderlineToShump
}