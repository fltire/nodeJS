const { json } = require('express');
const { symlinkSync } = require('fs');
var http = require('http');
const fs=require('fs');
var mysql = require('mysql');
const first = require('ee-first');
const e = require('express');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'demo'
})
connection.connect()
async function c(sql){
    let s
    await new Promise(resolve=>{
        connection.query(sql,  (error, results, fields)=> {
            if (error) throw error;
            resolve(results)
        })
    })
    .then((res)=>{
        s = res
    })
    return s
}
function list(){
    return c('SELECT * from user')
}
// 店铺信息
async function userdata(data1){
    let data = {
        token:'123',
        name:'樊文',
        StoreCurAmt:0,
        StoreCurCnt:0,
        StoreYesAmt:0,
        StoreYesCnt:0,
        StoreMonAmt:0,
        StoreMonCnt:0,
    }
    let date = new Date()
    const Y = date.getFullYear();
    const M = date.getMonth()+1;
    const D = date.getDate();
    const curDay = Y + '-'+ M + '-' + D;
    let cur = await c(`SELECT * FROM sale WHERE time LIKE '${curDay}%'`)
    let date1 = new Date(new Date()-24*60*60*1000)
    const Y1 = date1.getFullYear();
    const M1 = date1.getMonth()+1;
    const D1 = date1.getDate();
    const curDay1 = Y1 + '-'+ M1 + '-' + D1;
    let yes  = await c(`SELECT * FROM sale WHERE time LIKE '${curDay1}%'`)
    let mon  = await c(`SELECT * FROM sale WHERE time LIKE '${Y}-${M}%'`)
    for(let i = 0;i<cur.length;i++){
        data.StoreCurAmt+=Number(cur[i].money)
    }
    data.StoreCurCnt = cur.length
    for(let i = 0;i<yes.length;i++){
        data.StoreYesAmt+=Number(yes[i].money)
    }
    data.StoreYesCnt = yes.length
    for(let i = 0;i<mon.length;i++){
        data.StoreMonAmt+=Number(mon[i].money)
    }
    data.StoreMonCnt = mon.length
    return data
}
//登录
async function mobileLogin(data1){
    let data = {
    }
    let s =await c(`SELECT * from user where user_name like '${data1.userName}' and password like '${data1.password}'`)
    let jurisdiction = null
    if(s.length!==0){
        let role = await c(`select role_id from user where user_name ='${data1.userName}'`)
        jurisdiction = await c(`select jurisdiction from role where role_id ='${role[0].role_id}'`)
    }
    data.roleId = s[0].role_id
    data.jurisdiction = jurisdiction[0].jurisdiction
    let permissions = []
    let routers = []
    if(s.length!==0){
        let role = await c(`select menu_id from role_menu where role_id ='${s[0].role_id}'`)
        for(let item = 0 ;item<role.length;item++){
            let menu = await c(`select * from menu where menu_id ='${role[item].menu_id}'`)
            if(menu[0].perms!=null&&menu[0].perms!=undefined){
                permissions.push(menu[0].perms)
            }
            if(menu[0].menu_type!=='F'){
                routers.push({menuId:menu[0].menu_id,menuName:menu[0].menu_name,parentId:menu[0].parent_id,path:menu[0].path,component:menu[0].component,menuType:menu[0].menu_type,menuCreate:menu[0].menu_create,menuModified:menu[0].menu_modified,remark:menu[0].remark,orderNum:menu[0].order_num,icon:menu[0].icon,son:menu[0].son,perms:menu[0].perms})
            }
        }
        data.permissions = permissions
        data.routers = routers
        data.token = data1.userName
        data.name = s[0].user_name
        data.deptId = s[0].dept_id
        data.userId = s[0].user_id
        data.img = s[0].img
    }
    let date = new Date().getTime()
    if(s.length!==0){
        let d = await c(`insert into token (token,time) values ('${data1.userName}','${date}');`)
        return {
            code:0,
            msg:2,
            data:data
        }
    }else{
        return {msg:'登陆失败',code:200}
    }
}
//商品列表
async function goodsQry(data){
    console.log(111111)
    let dept = await c(`SELECT * from user where user_name like '${data.token}'`)
    console.log(222222)
    let key = [],value = [],s,length
    for(let item in data){
        if(item!=='page'&&data[item]!==''&&item!=='time'&&item!=='token'&&item!=='userId'){
            key.push(item)
            value.push(`${item} like '%${data[item]}%'`)
        }
    }
    console.log(33333)
    if(key.length===0){
        s = await c(`SELECT * from goods ${dept[0].dept_id === null?'':'where dept_id like '+dept[0].dept_id} order by goods_id desc limit ${(data.page-1)*10},10;`)
        length = await c(`select  count(*) from goods ${dept[0].dept_id === null?'':'where dept_id like '+dept[0].dept_id}`)
    }else{
        s = await c(`Select * from goods where ${value.join(' and ')} ${dept[0].dept_id === null?'':'and dept_id like '+dept[0].dept_id} order by goods_id desc limit ${(data.page-1)*10},10;`)
       length = await c(`select  count(*) from goods where ${value.join(' and ')} ${dept[0].dept_id === null?'':'and dept_id like '+dept[0].dept_id} order by goods_id desc `)
    }
    console.log(44444444)
    // let length = await c(`select  count(*) from goods ${dept[0].dept_id === null?'':'where dept_id like '+dept[0].dept_id}`)
    // let s = await c(`SELECT * from goods ${dept[0].dept_id === null?'':'where dept_id like '+dept[0].dept_id} order by goods_id desc limit ${(data.page-1)*10},10;`)
    let list = []
    for(let i=0; i<s.length;i++){
        let d = await c(`select dict_name from dict where dict_id = ${s[i].goods_type_id}`)
        let b = await c(`select dept_name from dept where dept_id = ${s[i].dept_id}`)
        list.push({goodsId:s[i].goods_id,goodsName:s[i].goods_name,goodsTypeName:d[0].dict_name,goodsRetailPrice:s[i].goods_retail_price,goodsStock:s[i].goods_stock,goodsCreate:s[i].goods_create,goodsModified:s[i].goods_modified,deptId:s[i].dept_id,goodsTypeId:s[i].goods_type_id,deptName:b[0].dept_name})
    }
    console.log(555555)
    return {
        code: 0,
        data: {
            AllCount:length[0]['count(*)'],
            goodsList:list
        }
    }
}
//商品列表
async function goodsQry1(data){
    let key = [],value = [],s,length
    for(let item in data){
        if(item!=='page'&&data[item]!==''&&item!=='time'&&item!=='token'&&item!=='userId'){
            key.push(item)
            value.push(`${item} like '%${data[item]}%'`)
        }
    }
    if(key.length===0){
        s = await c(`SELECT * from goods1  order by goods_id desc limit ${(data.page-1)*10},10;`)
        length = await c(`select  count(*) from goods1 `)
    }else{
        s = await c(`Select * from goods1 where ${value.join(' and ')}  order by goods_id desc limit ${(data.page-1)*10},10;`)
       length = await c(`select  count(*) from goods1 where ${value.join(' and ')}  order by goods_id desc `)
    }
    // let length = await c(`select  count(*) from goods ${dept[0].dept_id === null?'':'where dept_id like '+dept[0].dept_id}`)
    // let s = await c(`SELECT * from goods ${dept[0].dept_id === null?'':'where dept_id like '+dept[0].dept_id} order by goods_id desc limit ${(data.page-1)*10},10;`)
    let list = []
    for(let i=0; i<s.length;i++){
        let d = await c(`select dict_name from dict where dict_id = ${s[i].goods_type_id}`)
        list.push({goodsId:s[i].goods_id,goodsName:s[i].goods_name,goodsTypeName:d[0].dict_name,goodsRetailPrice:s[i].goods_retail_price,goodsStock:s[i].goods_stock,goodsCreate:s[i].goods_create,goodsModified:s[i].goods_modified,deptId:s[i].dept_id,goodsTypeId:s[i].goods_type_id})
    }
    return {
        code: 0,
        data: {
            AllCount:length[0]['count(*)'],
            goodsList:list
        }
    }
}
//桌台列表
async function tableSync(data){
    let s = await c('SELECT * from tables order by id desc;')
    let list = s.slice(10*(data.page-1),10*data.page)
    if(list.length===0){
        list = s.slice(10*(data.page-2),10*(data.page-1))
    } 
    return {
        code: 20000,
        data: {
            AllCount:s.length,
            list:list
        }
    }
}
// 点餐-查看所有餐桌状态
async function tableUse(data){
    let s = await c('SELECT * from tables order by id desc;')
    return {
        code: 20000,
        data: {
            list:s
        }
    }
}
//商品新增
async function goodsAdd(data){
    let dept = await c(`select * from user where user_name like '${data.token}'`)
    console.log('dept',dept)
    let name = await c(`select * from goods where dept_id = ${dept[0].dept_id} and goods_name = '${data.goodsName}'`)
    if(name.length!=0){
        return {
            code:1,
            msg:"已有同名商品，不可增加同名商品"
        }
    }
    let s = await c(`insert into goods (goods_name,goods_type_name,goods_retail_price,goods_stock,goods_create,dept_id,goods_type_id) values ('${data.goodsName}','${data.goodsTypeName}','${data.goodsRetailPrice}','${data.goodsStock}','${data.time}','${dept[0].dept_id}','${data.goodsTypeId}');`)
    return {
        code:0,
        msg: '新增成功'
    }
}
//商品新增1
async function goodsAdd1(data){
    let s = await c(`insert into goods1 (goods_name,goods_type_name,goods_retail_price,goods_stock,goods_create,goods_type_id) values ('${data.goodsName}','${data.goodsTypeName}','${data.goodsRetailPrice}','${data.goodsStock}','${data.time}','${data.goodsTypeId}');`)
    return {
        code:0,
        msg: '新增成功'
    }
}
//桌台新增
async function tableAdd(data){
    let s = await c(`insert into tables (TableTableName,TableAddDate,TableStatus,TableUseStatus) values ('${data.name}','${data.SsPackReqTime}','正常','空闲中');`)
    return {
        data: '新增成功'
    }
}
//商品删除
async function goodsDel(data){
    let s = await c(`delete from goods where goods_id in (${data.ids.join(',')})`)
    console.log(s)
    if(s.affectedRows!==0){
        return {
            code:0,
            msg:'删除成功'
        }
    }else{
        return {
            code:1,
            msg:'删除失败'
        }
    }
}
//商品删除1
async function goodsDel1(data){
    let s = await c(`delete from goods1 where goods_id in (${data.ids.join(',')})`)
    console.log(s)
    if(s.affectedRows!==0){
        return {
            code:0,
            msg:'删除成功'
        }
    }else{
        return {
            code:1,
            msg:'删除失败'
        }
    }
}
//商品修改1
async function goodsUpt1(data){
    let sql = `update goods1 set goods_name = '${data.goodsName}',goods_type_name = '${data.goodsTypeName}',goods_retail_price = '${data.goodsRetailPrice}',goods_stock = '${data.goodsStock}',goods_modified = '${data.time}',goods_type_id = '${data.goodsTypeId}' where goods_id = ${data.goodsId}`
    let s = await c(sql)
    return {
        code:0,
        msg:'修改成功'
    }
}
//商品修改
async function goodsUpt(data){
    let sql = `update goods set goods_name = '${data.goodsName}',goods_type_name = '${data.goodsTypeName}',goods_retail_price = '${data.goodsRetailPrice}',goods_stock = '${data.goodsStock}',goods_modified = '${data.time}',goods_type_id = '${data.goodsTypeId}' where goods_id = ${data.goodsId}`
    let s = await c(sql)
    return {
        code:0,
        msg:'修改成功'
    }
}
// 台桌停用
async function tableStop(data){
    let sql = `update tables set TableStatus = '${data.TableStatus}' where id = ${data.id}`
    let s = await c(sql)
    return {
        data:'修改成功'
    }
}
// 台桌删除
async function tableDel(data){
    let s = await c(`delete from tables where id = ${data.id}`)
    return {
        data:'删除成功'
    }
}
// 点餐列表
async function order(data){
    let s = await c(`SELECT * from goods where GoodsStock > 0 order by id desc;`)
    return {
        data:{
            list:s
        }
    }
}
async function pay(data){
    let p =``
    data.checkList.forEach((item,index) =>{
        if(index==data.checkList.length-1){
            p+=`'${item}'`
        }else{
            p+=`'${item}',`
        }
    })
    sql = `UPDATE goods SET GoodsStock = GoodsStock-1 where GoodsName in (${p})`
    let s = await c(sql)
    let d = await c(`update tables set use1 = '1' , TableUseStatus='使用中' where id = ${data.id}`)
    let date = new Date()
    let a = await c(`insert into sale (time,money) values ('${data.SsPackReqTime}','${data.money}');`)
    return {
        data:'点单成功' 
    }
}
async function leave(data){
    let s = await c(`update tables set use1 = '' , TableUseStatus='空闲中' where id = ${data.id}`)
    return {
        data:'成功'
    }
}
// 报表
async function storeRptQry(data){
    if(data.select=='日报'){
        let date = new Date()
        const Y = date.getFullYear();
        const M = date.getMonth()+1;
        const D = date.getDate();
        const curDay = Y + '-'+ M + '-' + D;
        console.log(curDay) ;
        var Day={category:'日',StoreSumAmt:'3167',StoreSumCnt:'14',
                list:[
                    {value: 0, name: '10:00~12:00'},
                    {value: 0, name: '12:00~14:00'},
                    {value: 0, name: '14:00~16:00'},
                    {value: 0, name: '16:00~18:00'},
                    {value: 0, name: '18:00~20:00'},
                    {value: 0, name: '20:00~22:00'},
                ]
            }
        let t = 10
        let StoreSumAmt = 0
        let StoreSumCnt = 0
        for(let i=0;i<6;i++){
            value = await c(`select * from sale where time between '${curDay} ${t}' and '${curDay} ${t+2}'`)
            t+=2
            StoreSumCnt +=value.length
            for(let j = 0;j<value.length;j++){
                Day.list[i].value+=Number(value[j].money)
                StoreSumAmt+=Number(value[j].money)
            }
        }
        Day.StoreSumAmt = StoreSumAmt
        Day.StoreSumCnt = StoreSumCnt
        return{
            data:Day
        }
    }else if(data.select=='周报'){
        const Week = {category:'周',StoreSumAmt:'30021',StoreSumCnt:'105',
            list:[
                {value: 3167, name: '周一'},
                {value: 2568, name: '周二'},
                {value: 4528, name: '周三'},
                {value: 1259, name: '周四'},
                {value: 3598, name: '周五'},
                {value: 6845, name: '周六'},
                {value: 8256, name: '周日'},
            ]
        }
        let StoreSumAmt= 0
        let StoreSumCnt = 0
        for(let i = 6;i>=0;i--){
            let date = new Date(new Date()-24*60*60*1000*i)
            let Y = date.getFullYear();
            let M = date.getMonth()+1;
            let D = date.getDate();
            let curDay = Y + '-'+ M + '-' + D;
            Week.list[i].name = curDay
            let s = await c(`SELECT * FROM sale WHERE time LIKE '${curDay}%'`)
            console.log(`SELECT * FROM sale WHERE time LIKE '${curDay}%'`)
            StoreSumCnt+=s.length
            let ss = 0
            for(let j = 0;j<s.length;j++){
                ss+=Number(s[j].money)
            }
            Week.list[i].value = ss
            StoreSumAmt+=ss
        }
        Week.StoreSumAmt=StoreSumAmt
        Week.StoreSumCnt=StoreSumCnt
        return{
            data:Week
        }
    }else if(data.select=='月报'){
        const Month = {category:'月',StoreSumAmt:'116463',StoreSumCnt:'542',
            list:[
                {value: 30021, name: '第一周'},
                {value: 28658, name: '第二周'},
                {value: 32598, name: '第三周'},
                {value: 24986, name: '第四周'},
            ]
        }
        let StoreSumAmt= 0
        let StoreSumCnt = 0
        for(let i = 3;i>=0;i--){
            let date1 = new Date(new Date()-24*60*60*1000*((i+1)*7-1))
            let date2 = new Date(new Date()-24*60*60*1000*((i+0)*7-1))
            let Y1 = date1.getFullYear();
            let Y2 = date2.getFullYear();
            let M1 = date1.getMonth()+1;
            let M2 = date2.getMonth()+1;
            let D1 = date1.getDate();
            let D2 = date2.getDate();
            let curDay1 = Y1 + '-'+ M1 + '-' + D1;
            let curDay2 = Y2 + '-'+ M2 + '-' + D2;
            Month.list[i].name = `${curDay1}-${curDay2}`
            let s = await c(`select * from sale where time between '${curDay1}' and '${curDay2}'`)
            // console.log(`select * from sale where time between '${curDay1}' and '${curDay2}'`)
            StoreSumCnt+=s.length
            let ss = 0
            for(let j = 0;j<s.length;j++){
                ss+=Number(s[j].money)
            }
            Month.list[i].value = ss
            StoreSumAmt+=ss
        }
        Month.StoreSumAmt=StoreSumAmt
        Month.StoreSumCnt=StoreSumCnt
        return{
            data:Month
        }
    }
}
// 用户列表
async function getUserData(data){
    let s = ''
    let key = [],value = [],length
    for(let item in data){
        if(data[item]!==''){
            switch(item){
                case 'userName':
                    key.push(item);
                    value.push(`user_name like '%${data[item]}%'`);
                    break;
                case 'gender':
                    key.push(item);
                    value.push(`gender like '${data[item]}'`);
                    break;
                case 'phone':
                    key.push(item);
                    value.push(`phone like '%${data[item]}%'`);
                    break;

                default:
                    break
            }
        }   
    }
    // let dept = await c(`SELECT * from user where user_name like '${data.token}'`)
    // let deptmap = []
    // if(dept[0].dept_id === null){
    //     if(data.deptId!==''){
    //         let deptid = await c(`SELECT * from dept where parent_id like '${data.deptId}'`)
    //         if(deptid.length !== 0){
    //             deptmap = deptid.map(item => {
    //                 return item.dept_id
    //             })
    //         }
    //     }
    // }
    let dept = await c(`SELECT * from user where user_name like '${data.token}'`)
    let deptStr = '';
    if(dept[0].dept_id === null){
        // 是超级管理员身份
        if(data.deptId === ''){
            // 没选择部门
        }else{
            // 选择部门
            let deptid = await c(`SELECT * from dept where parent_id like '${data.deptId}'`)
            if(deptid.length === 0){
                // 部门就是最底层
                deptStr+='dept_id like '+data.deptId
            }else{
                // 部门不是最底层
                let arr = []
                deptid.forEach(item => {
                    arr.push('dept_id like '+item.dept_id)
                })
                deptStr = arr.join(' OR ')
            }
        }
    }else{
        // 不是超级管理员
        deptStr +='dept_id like '+dept[0].dept_id
    }
    // console.log(`Select * from user ${deptStr!=='' || value.length!==0 ? 'where '+value.join(' and ')+(value.length!==0&&deptStr!==''?' and ':'')+' '+deptStr :''} order by user_id desc limit ${(data.page-1)*10},10;`)
    s = await c(`Select * from user ${deptStr!=='' || value.length!==0 ? 'where '+value.join(' and ')+(value.length!==0&&deptStr!==''?' and ':'')+' '+deptStr :''} order by user_id desc limit ${(data.page-1)*10},10;`)
    length = await c(`select  count(*) from user ${deptStr!=='' || value.length!==0 ? 'where '+value.join(' and ')+(value.length!==0&&deptStr!==''?' and ':'')+' '+deptStr :''}`)
    // if(key.length===0){
    //     s = await c(`SELECT * from user ${dept[0].dept_id === null?'':'where dept_id like '+dept[0].dept_id} order by user_id desc limit ${(data.page-1)*10},10;`)
    //     length = await c(`select  count(*) from user ${dept[0].dept_id === null?'':'where dept_id like '+dept[0].dept_id}`)
    // }else{
    //    s = await c(`Select * from user where ${value.join(' and ')} ${dept[0].dept_id === null?'':'and dept_id like '+dept[0].dept_id} order by user_id desc limit ${(data.page-1)*10},10;`)
    //    length = await c(`select  count(*) from user where ${value.join(' and ')} ${dept[0].dept_id === null?'':'and dept_id like '+dept[0].dept_id} order by user_id desc `)
    // }
    let list = s.map((item)=>{
        return {userId:item.user_id,userName:item.user_name,roleId:item.role_id,nickName:item.nick_name,phone:item.phone,userCreate:item.user_create,gender:item.gender,remark:item.remark,userModified:item.user_modified,deptId:item.dept_id,deptName:item.dept_name}
    })
    return {
        code: 0,
        data: {
            count:length[0]['count(*)'],
            list:list
        }
    }
}
// 添加用户
async function addUser(data){
    console.log(data)
    let s =await c(`SELECT user_name from user where user_name like '${data.userName}'`)
    if(s.length!==0){
        return {
            code:1,
            msg:'用户名称重复'
        }
    }
    console.log(`insert into user (user_name,nick_name,phone,gender,remark,user_create,password,role_id,dept_id,dept_name) values ('${data.userName}','${data.nickName}','${data.phone}','${data.gender}','${data.remark}','${data.time}','123456','${data.roleId}',${data.deptId},'${data.deptName}');`)
    let d = await c(`insert into user (user_name,nick_name,phone,gender,remark,user_create,password,role_id,dept_id,dept_name) values ('${data.userName}','${data.nickName}','${data.phone}','${data.gender}','${data.remark}','${data.time}','123456','${data.roleId}',${data.deptId},'${data.deptName}');`)
    if(d.insertId){
        return {
            code:0,
            msg:'新增成功'
        }
    }else{
        return {
            code:1,
            msg:'新增失败'
        }
    }
}
// 删除用户
async function delUser(data){
    let s = await c(`delete from user where user_id in (${data.ids.join(',')})`)
    console.log(s)
    if(s.affectedRows!==0){
        return {
            code:0,
            msg:'删除成功'
        }
    }else{
        return {
            code:1,
            msg:'删除失败'
        }
    }
}
// 修改用户
async function uptUser(data){
    console.log(data)
    let s = await c(`update user set user_name = '${data.userName}',nick_name = '${data.nickName}',phone = '${data.phone}',gender = '${data.gender}',remark = '${data.remark}',role_id = '${data.roleId}',dept_id = '${data.deptId}',dept_name = '${data.deptName}',user_modified = '${data.time}' where user_id = ${data.userId}`)
    console.log(s)
    if(s.affectedRows===1){
        return {
            code:0,
            msg:'修改成功'
        }
    }else{
        return {
            code:1,
            msg:'修改失败'
        }
    }
}
// 新增用户时角色下拉框
async function getRoleList(data){
    let s = await c(`SELECT role_id,role_name from role order by role_id desc;`)
    let dept = await c(`SELECT * from user where user_name like '${data.token}'`)
    console.log('dept',dept)
    let list = []
    s.forEach((item) => {
        if(dept[0].dept_id==null){
            list.push({roleId:item.role_id,roleName:item.role_name})
        }else if(item.role_id!='1'){
            list.push({roleId:item.role_id,roleName:item.role_name})
        }
    })
    return {
        code:0,
        data:{
            list:list
        }
    }
}
// 角色列表
async function getRoleData(data){
    let s = '',length = null
    let key = [],value = []
    for(let item in data){
        if(item!=='page'&&data[item]!==''&&item!=='time'&&item!=='token'){
            key.push(item)
            value.push(`${item} like '%${data[item]}%'`)
        }
    }
    // if(key.length===0){
        s = await c(`SELECT * from role order by role_id desc limit ${(data.page-1)*10},10;`)
        
    // }else{
    //    s = await c(`Select * from role where ${value.join(' and ')} order by id desc limit ${(data.page-1)*10},10`)
    // }
    let list = s.map((item) => {
        return {roleId:item.role_id,roleName:item.role_name,roleCreate:item.role_create,roleModified:item.role_modified,jurisdiction:item.jurisdiction}
    })
    length = await c(`select  count(*) from role`)
    console.log(length[0]['count(*)'])
    return {
        code: 0,
        data: {
            count:length[0]['count(*)'],
            list:list
        }
    }
}
// 角色新增
async function addRole(data){
    // let role =await c(`SELECT role from role_id where role like '${data.role}'`)
    let rolename =await c(`SELECT role_name from role where role_name like '${data.roleName}'`)
    if(rolename.length!==0){
        return {
            code:1,
            msg:'角色名称重复'
        }
    }
    let d = await c(`insert into role (role_name,jurisdiction,role_create) values ('${data.roleName}','${data.jurisdiction}','${data.time}');`)
    console.log(d.insertId)
    for(let i = 0 ; i<data.permission.length ; i++){
        let f = await c(`insert into role_menu (role_id,menu_id) values ('${d.insertId}','${data.permission[i]}');`)
    }
    if(d.insertId){
        return {
            code:0,
            msg:'新增成功'
        }
    }else{
        return {
            code:1,
            msg:'新增失败'
        }
    }
}
// 角色新增时权限树
async function rolePermission(){
    s = await c(`SELECT * from menu order by menu_id desc`)
    const cloneData = JSON.parse(JSON.stringify(s))
    const treeData = cloneData.filter(father => {
        let branchArr = cloneData.filter(child => {
            return father.menu_id === child.parent_id
        });
        branchArr.sort((a,b)=>{
            return a.order_num > b.order_num ? 1 : -1
        })
        branchArr.length > 0 ? father.children = branchArr : '';
        return father.parent_id === 0;
    });
    treeData.sort((a,b)=>{
        return a.order_num > b.order_num ? 1 : -1
    })
    return {
        code:0,
        msg:1,
        data:{
            list:treeData
        }
    }
}
// 通过角色id返回角色权限
async function getRoleById(data){
    let permissions = []
    let role = await c(`select menu_id from role_menu where role_id ='${data.roleId}'`)
    for(let item = 0 ;item<role.length;item++){
        let menu = await c(`select * from menu where menu_id ='${role[item].menu_id}'`)
        if(menu[0].son==='N'){
            permissions.push(menu[0].menu_id)
        }
    }
    return {
        msg:1,
        code:0,
        data:{
            permissions
        }
    }
}
// 角色更新
async function uptRole(data){
    console.log(data)
    let s = await c(`update role set role_name = '${data.roleName}',jurisdiction = '${data.jurisdiction}',role_modified = '${data.time}' where role_id = ${data.roleId}`)
    let a = await c(`delete from role_menu where role_id = ${data.roleId}`)
    for(let i = 0 ; i<data.permission.length ; i++){
        let f = await c(`insert into role_menu (role_id,menu_id) values ('${data.roleId}','${data.permission[i]}');`)
    }
    if(s.affectedRows===1){
        return {
            code:0,
            msg:'修改成功'
        }
    }else{
        return {
            code:1,
            msg:'修改失败'
        }
    }
}
// 角色删除
async function delRole(data){
    let p = await c(`SELECT user_name from user where role_id in ('${data.ids.join("','")}')`)
    if(p.length!==0){
        return {
            code:1,
            msg:'删除失败，有用户使用该角色'
        }
    }else{
        let a = await c(`delete from role where role_id in (${data.ids.join(',')})`)
        return {
            code:0,
            msg:'删除成功'
        }
    }
}
async function route(data){
    s = await c(`SELECT * from menu order by menu_id desc`)
    return {
        list:s
    }
}
// 菜单列表
async function getMenu(data){
    s = await c(`SELECT * from menu order by menu_id desc`)
    let list = s.map((item)=>{
        return {menuId:item.menu_id,menuName:item.menu_name,parentId:item.parent_id,path:item.path,component:item.component,menuType:item.menu_type,menuCreate:item.menu_create,menuModified:item.menu_modified,remark:item.remark,orderNum:item.order_num,icon:item.icon,son:item.son,perms:item.perms}
    })
    return {
        code:0,
        msg:'查询成功',
        data:{
            list:list
        }
    }
}
// 菜单新增
async function addMenu(data){
    console.log('add',data)
    let d = await c(`insert into menu (menu_name,parent_id,order_num,path,component,menu_type,remark,icon,menu_create,son,perms) values ('${data.menuName}','${data.parentId}','${data.orderNum}','${data.path}','${data.component}','${data.menuType}','${data.remark}','${data.icon}','${data.time}','N','${data.perms}');`)
    console.log('菜单新增',d)
    let b =data.parentId==0 ? "" : await c(`update menu set son = 'Y' where menu_id = ${data.parentId}`)
    if(d.insertId){
        return {
            code:0,
            msg:'新增成功'
        }
    }else{
        return {
            code:1,
            msg:'新增失败'
        }
    }
}
// 根据id查菜单
async function getMenuById(data){
    let s = await c(`select * from menu where menu_id ='${data.menuId}'`)
    if(s.length===1){
        return {
            code:0,
            msg:'成功',
            data:{menuId:s[0].menu_id,menuName:s[0].menu_name,parentId:s[0].parent_id,path:s[0].path,component:s[0].component,menuType:s[0].menu_type,menuCreate:s[0].menu_create,menuModified:s[0].menu_modified,remark:s[0].remark,orderNum:s[0].order_num,icon:s[0].icon,perms:s[0].perms}
        }
    }else{
        return {
            code:1,msg:'失败'
        }
    }
}
// 菜单修改
async function uptMenu(data){
    let yuanPId = await c(`SELECT parent_id from menu where menu_id like '${data.menuId}'`)
    let s1 = await c(`update menu set menu_name = '${data.menuName}',parent_id = '${data.parentId}',order_num = '${data.orderNum}',path = '${data.path}',component = '${data.component}',menu_type = '${data.menuType}',menu_modified = '${data.time}',remark = '${data.remark}',icon = '${data.icon}',perms = '${data.perms}' where menu_id = ${data.menuId}`)
    let yuanPIdList = await c(`SELECT parent_id from menu where parent_id like '${yuanPId[0].parent_id}'`)
    if(yuanPIdList.length>0){
        await c(`update menu set son = 'Y' where menu_id = ${yuanPId[0].parent_id}`)
    }else{
        await c(`update menu set son = 'N' where menu_id = ${yuanPId[0].parent_id}`)
    }
    let b =data.parentId==0 ? "" : await c(`update menu set son = 'Y' where menu_id = ${data.parentId}`)
    console.log(s1)
    if(s1.affectedRows===1){
        return {
            code:0,
            msg:'修改成功'
        }
    }else{
        return {
            code:1,
            msg:'修改失败'
        }
    }
}
// 菜单删除
async function delMenu(data){
    let yuanPId = await c(`SELECT parent_id from menu where menu_id like '${data.menuId}'`)
    let p = await c(`SELECT menu_name from menu where parent_id like '${data.menuId}'`)
    let s = await c(`SELECT * from role_menu where menu_id like '${data.menuId}'`)
    if(p.length!==0){
        return{
            code:1,
            msg:'此菜单有子节点，不能删除'
        }
    }else if(s.length!==0){
        return{
            code:1,
            msg:'此菜单被使用，不能删除'
        }
    }else{
        await c(`delete from menu where menu_id = ${data.menuId}`)
        let yuanPIdList = await c(`SELECT parent_id from menu where parent_id like '${yuanPId[0].parent_id}'`)
        if(yuanPIdList.length>0){
            await c(`update menu set son = 'Y' where menu_id = ${yuanPId[0].parent_id}`)
        }else{
            await c(`update menu set son = 'N' where menu_id = ${yuanPId[0].parent_id}`)
        }
        return{
            code:0,
            msg:'删除成功'
        }
    }
}
// 部门列表
async function getDept(data){
    s = await c(`SELECT * from dept order by dept_id desc`)
    let list = s.map((item)=>{
        return {deptId:item.dept_id,parentId:item.parent_id,deptName:item.dept_name,orderNum:item.order_num,leader:item.leader,phone:item.phone,email:item.email,deptCreate:item.dept_create,deptModified:item.dept_modified,son:item.son}
    })
    return {
        code:0,
        msg:'查询成功',
        data:{
            list:list
        }
    }
}
// 部门新增
async function addDept(data){
    console.log('add',data)
    let d = await c(`insert into dept (parent_id,dept_name,order_num,leader,phone,email,dept_create,son) values ('${data.parentId}','${data.deptName}','${data.orderNum}','${data.leader}','${data.phone}','${data.email}','${data.time}','N');`)
    console.log('部门新增',d)
    let b =data.parentId==0 ? "" : await c(`update dept set son = 'Y' where dept_id = ${data.parentId}`)
    if(d.insertId){
        return {
            code:0,
            msg:'新增成功'
        }
    }else{
        return {
            code:1,
            msg:'新增失败'
        }
    }
}
// 根据id查部门
async function getDeptById(data){
    let s = await c(`select * from dept where dept_id ='${data.deptId}'`)
    if(s.length===1){
        return {
            code:0,
            msg:'成功',
            data:{deptId:s[0].dept_id,parentId:s[0].parent_id,deptName:s[0].dept_name,orderNum:s[0].order_num,leader:s[0].leader,phone:s[0].phone,email:s[0].email,deptCreate:s[0].dept_create,deptModified:s[0].dept_modified,son:s[0].son}
        }
    }else{
        return {
            code:1,msg:'失败'
        }
    }
}
// 部门修改
async function uptDept(data){
    let yuanPId = await c(`SELECT parent_id from dept where dept_id like '${data.deptId}'`)
    let s1 = await c(`update dept set dept_name = '${data.deptName}',parent_id = '${data.parentId}',order_num = '${data.orderNum}',leader = '${data.leader}',phone = '${data.phone}',email = '${data.email}',dept_modified = '${data.time}' where dept_id = ${data.deptId}`)
    let yuanPIdList = await c(`SELECT parent_id from dept where parent_id like '${yuanPId[0].parent_id}'`)
    if(yuanPIdList.length>0){
        await c(`update dept set son = 'Y' where dept_id = ${yuanPId[0].parent_id}`)
    }else{
        await c(`update dept set son = 'N' where dept_id = ${yuanPId[0].parent_id}`)
    }
    let b =data.parentId==0 ? "" : await c(`update dept set son = 'Y' where dept_id = ${data.parentId}`)
    console.log(s1)
    if(s1.affectedRows===1){
        return {
            code:0,
            msg:'修改成功'
        }
    }else{
        return {
            code:1,
            msg:'修改失败'
        }
    }
}
// 部门删除
async function delDept(data){
    let yuanPId = await c(`SELECT parent_id from dept where dept_id like '${data.deptId}'`)
    let p = await c(`SELECT dept_name from dept where parent_id like '${data.deptId}'`)
    let user = await c(`SELECT * from user where dept_id like '${data.deptId}'`)

    if(p.length!==0){
        return{
            code:1,
            msg:'此菜单有子节点，不能删除'
        }
    }else if(user.length!==0){
        return {
            code: 1,
            msg:'本部门下有账户，不能删除'
        }
    }else{
        await c(`delete from dept where dept_id = ${data.deptId}`)
        let yuanPIdList = await c(`SELECT parent_id from dept where parent_id like '${yuanPId[0].parent_id}'`)
        if(yuanPIdList.length>0){
            await c(`update dept set son = 'Y' where dept_id = ${yuanPId[0].parent_id}`)
        }else{
            await c(`update dept set son = 'N' where dept_id = ${yuanPId[0].parent_id}`)
        }
        return{
            code:0,
            msg:'删除成功'
        }
    }
}
// 退出登录
async function logout(data){
    await c(`delete from token where token = '${data.token}'`)
    return {
        code:0,
        msg:'退出成功'
    }
}
// 新增用户时返回部门表
async function getUserDept(data){
    s = await c(`SELECT * from dept order by dept_id desc`)
    const cloneData = JSON.parse(JSON.stringify(s))
    const treeData = cloneData.filter(father => {
        let branchArr = cloneData.filter(child => {
            return father.dept_id === child.parent_id
        });
        branchArr.sort((a,b)=>{
            return a.order_num > b.order_num ? 1 : -1
        })
        branchArr.length > 0 ? father.children = branchArr : '';
        return father.parent_id === 0;
    });
    treeData.sort((a,b)=>{
        return a.order_num > b.order_num ? 1 : -1
    })
    return {
        code:0,
        msg:1,
        data:{
            list:treeData
        }
    }
}
// 字典分类列表
async function getDictType(data){
    s = await c(`SELECT * from dict_type order by dict_type_id desc`)
    let list = s.map((item)=>{
        return {dictTypeId:item.dict_type_id,dictTypeName:item.dict_type_name,dictTypeCreate:item.dict_type_create,dictTypeModified:item.dict_type_modified,remark:item.remark}
    })
    return {
        code:0,
        msg:'查询成功',
        data:{
            list:list
        }
    }
}
// 字典分类新增
async function addDictType(data){
    let d = await c(`insert into dict_type (dict_type_name,dict_type_create,remark) values ('${data.dictTypeName}','${data.time}','${data.remark}');`)
    if(d.insertId){
        return {
            code:0,
            msg:'新增成功'
        }
    }else{
        return {
            code:1,
            msg:'新增失败'
        }
    }
}
// 字典分类修改
async function uptDictType(data){
    let s1 = await c(`update dict_type set dict_type_name = '${data.dictTypeName}',remark = '${data.remark}',dict_type_modified = '${data.time}' where dict_type_id = ${data.dictTypeId}`)
    if(s1.affectedRows===1){
        return {
            code:0,
            msg:'修改成功'
        }
    }else{
        return {
            code:1,
            msg:'修改失败'
        }
    }
}
// 字典分类删除
async function delDictType(data){
    let p = await c(`SELECT * from dict where dict_type_id like '${data.dictTypeId}'`)
    if(p.length!==0){
        return {
            code:1,
            msg:'删除失败，该分类下有数据'
        }
    }else{
        let a = await c(`delete from dict_type where dict_type_id = ${data.dictTypeId}`)
        return {
            code:0,
            msg:'删除成功'
        }
    }
}
// 字典列表
async function getDict(data){
    let s = ''
    let key = [],value = [],length
    for(let item in data){
        if(item!=='page'&&data[item]!==''&&item!=='time'&&item!=='token'){
            key.push(item)
            if(item==='dictName'){
                value.push(`dict_name like '%${data[item]}%'`)
            }else if(item==='dictTypeId'){
                value.push(`dict_type_id like '%${data[item]}%'`)
            }
        }   
    }
    console.log(`Select * from dict ${key.length===0?'':'where'} ${value.join(' and ')} order by dict_id desc limit ${(data.page-1)*10},10;`)
    s = await c(`Select * from dict ${key.length===0?'':'where'} ${value.join(' and ')} order by dict_id desc limit ${(data.page-1)*10},10;`)
    length = await c(`select  count(*) from dict ${key.length===0?'':'where'} ${value.join(' and ')} order by dict_id desc `)
    let list = []
    for(let i = 0; i<s.length; i++){
        let type = await c(`select dict_type_name from dict_type where dict_type_id = ${s[i].dict_type_id}`)
        list.push({dictId:s[i].dict_id,dictName:s[i].dict_name,dictTypeId:s[i].dict_type_id,dictCreate:s[i].dict_create,dictModified:s[i].dict_modified,remark:s[i].remark,dictTypeName:type[0].dict_type_name})
    }
    return {
        code: 0,
        data: {
            count:length[0]['count(*)'],
            list:list
        }
    }
}
// 字典新增
async function addDict(data){
    let d = await c(`insert into dict (dict_name,dict_create,remark,dict_type_id) values ('${data.dictName}','${data.time}','${data.remark}','${data.dictTypeId}');`)
    if(d.insertId){
        return {
            code:0,
            msg:'新增成功'
        }
    }else{
        return {
            code:1,
            msg:'新增失败'
        }
    }
}
// 字典修改
async function uptDict(data){
    let s1 = await c(`update dict set dict_name = '${data.dictName}',remark = '${data.remark}',dict_modified = '${data.time}',dict_type_id = '${data.dictTypeId}' where dict_id = ${data.dictId}`)
    if(s1.affectedRows===1){
        return {
            code:0,
            msg:'修改成功'
        }
    }else{
        return {
            code:1,
            msg:'修改失败'
        }
    }
}
// 字典删除
async function delDict(data){
    let a = await c(`delete from dict where dict_id in (${data.ids.join(',')})`)
    return {
        code:0,
        msg:'删除成功'
    }
}
// 商品-商品类型
async function getGoodsType(data){
    s = await c(`Select * from dict where dict_type_id = 3 order by dict_id ;`)
    console.log(s)
    let list = []
    s.forEach(item =>{
        list.push({dictId:item.dict_id,dictName:item.dict_name})
    })
    return {
        code:0,
        msg:1,
        data:{
            list
        }
    }
}
// 个人信息
async function details(data){
    let s = await c(`select * from user where user_id = ${data.userId}`)
    let role = await c(`select * from role where role_id = ${s[0].role_id}`) 
    let dept = await c(`select * from dept where dept_id = ${s[0].dept_id}`) 
    let details = {
        userName:s[0].user_name,nickName:s[0].nick_name,phone:s[0].phone,userCreate:s[0].user_create,remark:s[0].remark,role:role[0].role_name,dept:dept.length!==0?dept[0].dept_name:'',gender:s[0].gender,img:s[0].img
    }
    return {
        code:0,
        data:details
    }
}
// 修改个人基础信息
async function myUptData (data) {
    let s = await c(`update user set nick_name = '${data.nickName}',phone = '${data.phone}',gender = '${data.gender}' where user_id = ${data.userId}`)
    if(s.affectedRows===1){
        return {
            code:0,
            msg:'修改成功'
        }
    }else{
        return {
            code:1,
            msg:'修改失败'
        }
    }
}
// 修改个人密码
async function uptpsd(data){
    let s = await c(`select password from user where user_id = ${data.userId}`)
    if(s[0].password!==data.oldpsd){
        return {
            code:1,
            msg:"原密码错误，不能修改"
        }
    }else{
        let p = await c(`update user set password = '${data.newpsd}' where user_id = ${data.userId}`)
        if(p.affectedRows===1){
            return {
                code:0,
                msg:'修改成功'
            }
        }else{
            return {
                code:1,
                msg:'修改失败'
            }
        }
    }
}
// 重置密码
async function resetPassword(data){
    let s = await c(`update user set password = '123456' where user_id = ${data.id}`)
    if(s.affectedRows===1){
        return {
            code:0,
            msg:'修改成功'
        }
    }else{
        return {
            code:1,
            msg:'修改失败'
        }
    }
}
// 首页echarts数据
async function echarts(data){
    let dept = await c(`select * from user where user_id = ${data.userId}`)
    let goods = await c(`select *  from goods ${dept[0].dept_id==null?'':'where dept_id = '+dept[0].dept_id}`)
    let goodsNum = [] // 数量饼图
    let goodsPrice = [] // 价格
    let goodsName = [] // 名字
    goods.forEach(item=>{
        goodsNum.push({value:item.goods_stock,name:item.goods_name})
        goodsPrice.push(item.goods_retail_price)
        goodsName.push(item.goods_name)
    })
    return{
        code:0,
        msg:1,
        data:{
            goodsNum,
            goodsPrice,
            goodsName
        }
    }
}
// 上传图片
async function upload(data,callback){
    var urlHead = 'D:/work/ss/nodeJS/server/downImg/' //图片保存的位置
    //接收前台POST过来的base64
    var imgData = data.imgData;
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    // 返回一个被 string 的值初始化的新的 Buffer 实例,原始二进制数据存储在 Buffer 类的实例中，        一个 Buffer 类似于一个整数数组，但它对应于 V8 堆内存之外的一块原始内存。
    var dataBuffer = Buffer.from(base64Data, 'base64');
    var date = new Date().getTime()
    fs.writeFile(urlHead+date+".png", dataBuffer, function(err) {
        if(err){
            callback(err)
        }else{
            img(date+'.png',data.userId,urlHead)
            callback({img:date+'.png'});
        }
    });
}
// 删除图片
function deleteFolderRecursive(url) {
    fs.unlink(url,function(error){
      if(error){
          console.log(error);
          return false;
      }
      console.log('删除文件成功');
    })
  
}
// 保存图片名
async function img(e,id,urlHead){
    let b = await c(`select * from user where user_id = ${id}`)
    let s = await c(`update user set img = '${e}' where user_id = ${id}`)
    if(s.affectedRows===1){
        deleteFolderRecursive(urlHead+b[0].img);
        return {
            code:0,
            msg:'修改成功'
        }
    }else{
        return {
            code:1,
            msg:'修改失败'
        }
    }
}
// 全部导入/导出的数据
async function goodsAllData(){
    let s = await c(`select * from goods1 order by goods_id desc`)
    let list = []
    for(let i=0; i<s.length;i++){
        let d = await c(`select dict_name from dict where dict_id = ${s[i].goods_type_id}`)
        list.push({goodsId:s[i].goods_id,goodsName:s[i].goods_name,goodsTypeName:d[0].dict_name,goodsRetailPrice:s[i].goods_retail_price,goodsStock:s[i].goods_stock,goodsCreate:s[i].goods_create,goodsModified:s[i].goods_modified,deptId:s[i].dept_id,goodsTypeId:s[i].goods_type_id})
    }
    return {
        code: 0,
        data: {
            list:list
        }
    }
}
async function getOS(){
    var os = require("os")
    return{
        code:0,
        data:{
            tmpdir:os.tmpdir(),
            endianness:os.endianness(),
            hostname:os.hostname(),
            type:os.type(),
            platform:os.platform(),
            arch:os.arch(),
            release:os.release(),
            uptime:os.uptime(),
            loadavg:os.loadavg(),
            totalmem:os.totalmem(),
            freemem:os.freemem(),
            cpus:os.cpus(),
            networkInterfaces:os.networkInterfaces(),
        }
    }
}
// 导入数据
async function importData(data){
    for(let i = 0;i<data.list.length;i++){
        let s = await c(`select * from dict where dict_name = '${data.list[i].goodsTypeName}'`)
        let d = await c(`insert into goods1 (goods_name,goods_type_name,goods_retail_price,goods_stock,goods_create,goods_type_id) values ('${data.list[i].goodsName}','${data.list[i].goodsTypeName}','${data.list[i].goodsRetailPrice}','${data.list[i].goodsStock}','${data.list[i].goodsCreate}','${s[0].dict_id}');`)
    }

    return{
        code:0,
        msg:'导入成功'
    }
}
// 食品审核新增
async function foodAuditAdd(data){
    console.log(data)
    let a = await c(`select * from user where user_id = ${data.userId}`)
    console.log(a)
    let d = await c(`insert into food_audit (food_name,food_create,add_staff,audit_status,food_amount,dept,food_classify) values ('${data.foodName}','${data.time}','${data.userId}','未审核','${data.foodAmount}','${a[0].dept_id}','${data.foodClassify}');`)
    if(d.insertId){
        return {
            code:0,
            msg:'新增成功'
        }
    }else{
        return {
            code:1,
            msg:'新增失败'
        }
    }
}
// 食品分类
async function foodClassify(data){
    let s = await c(`select * from dict where dict_type_id = 7`)
    let list = []
    s.forEach(item=>{
        list.push({value:item.dict_id,name:item.dict_name})
    })
    return{
        code:0,
        list
    }
}
// 食品审核列表
async function foodAuditList(data){
    let dataArr = []
    if(data.foodName!==''){
        dataArr.push(`food_name like '%${data.foodName}%'`)
    }
    if(data.foodClassify!==''){
        dataArr.push(`food_classify = '${data.foodClassify}'`)
    }
    if(data.auditStatus!==''){
        dataArr.push(`audit_status = '${data.auditStatus}'`)
    }
    let deptId = await c(`select * from user where user_id = ${data.userId}`)
    console.log(`select * from food_audit ${deptId[0].dept_id==null?dataArr.length!=0?'where '+dataArr.join(' and '):'':'where dept = '+deptId[0].dept_id +(dataArr.length==0?'':' and ')+ dataArr.join(' and ')} order by food_id desc limit ${(data.page-1)*10},10;`)
    let s  = await c(`select * from food_audit ${deptId[0].dept_id==null?dataArr.length!=0?'where '+dataArr.join(' and '):'':'where dept = '+deptId[0].dept_id +(dataArr.length==0?'':' and ')+  dataArr.join(' and ')} order by food_id desc limit ${(data.page-1)*10},10;`)
    let length = await c(`select  count(*) from food_audit ${deptId[0].dept_id==null?dataArr.length!=0?'where '+dataArr.join(' and '):'':'where dept = '+deptId[0].dept_id +(dataArr.length==0?'':' and ')+  dataArr.join(' and ')} order by food_id desc `)
    let list = []
    for(let i = 0; i<s.length;i++){
        let add_staff = await c(`select * from user where user_id = ${s[i].add_staff}`)
        let dept = await c(`select * from dept where dept_id = ${s[i].dept}`)
        let food_classify = await c(`select * from dict where dict_id = ${s[i].food_classify}`)
        let verifier = null
        if(s[i].verifier!==null){
            verifier = await c(`select * from user where user_id = ${s[i].verifier}`)
        }
        list.push({
            foodId:s[i].food_id,
            foodName:s[i].food_name,
            foodCreate:s[i].food_create,
            foodAudit:s[i].food_audit,
            verifier:verifier?verifier[0].user_name:null,
            addStaff:add_staff[0].user_name,
            auditStatus:s[i].audit_status,
            foodAmount:s[i].food_amount,
            reasons:s[i].reasons,
            dept:dept[0].dept_name,
            foodClassify:food_classify[0].dict_name,
            foodClassifyId:s[i].food_classify,
        })
    }
    return{
        code:0,
        data:{
            list:list,
            AllCount:length[0]['count(*)']
        }
    }
}
// 食品列表
async function foodList(data){
    let dataArr = []
    if(data.foodName!==''){
        dataArr.push(`food_name like '%${data.foodName}%'`)
    }
    if(data.foodClassify!==''){
        dataArr.push(`food_classify = '${data.foodClassify}'`)
    }
    let deptId = await c(`select * from user where user_id = ${data.userId}`)
    console.log(`select * from food ${deptId[0].dept_id==null?dataArr.length!=0?'where '+dataArr.join(' and '):'':'where dept = '+deptId[0].dept_id +(dataArr.length==0?'':' and ')+ dataArr.join(' and ')} order by food_id desc limit ${(data.page-1)*10},10;`)
    let s  = await c(`select * from food ${deptId[0].dept_id==null?dataArr.length!=0?'where '+dataArr.join(' and '):'':'where dept = '+deptId[0].dept_id +(dataArr.length==0?'':' and ')+  dataArr.join(' and ')} order by food_id desc limit ${(data.page-1)*10},10;`)
    let length = await c(`select  count(*) from food ${deptId[0].dept_id==null?dataArr.length!=0?'where '+dataArr.join(' and '):'':'where dept = '+deptId[0].dept_id +(dataArr.length==0?'':' and ')+  dataArr.join(' and ')} order by food_id desc `)
    let list = []
    for(let i = 0; i<s.length;i++){
        let dept = await c(`select * from dept where dept_id = ${s[i].dept}`)
        let food_classify = await c(`select * from dict where dict_id = ${s[i].food_classify}`)
        list.push({
            foodId:s[i].food_id,
            foodName:s[i].food_name,
            foodCreate:s[i].food_create,
            foodModified:s[i].food_modified,
            foodPrice:s[i].food_price,
            foodClassify:food_classify[0].dict_name,
            foodAmount:s[i].food_amount,
            dept:dept[0].dept_name,
        })
    }
    return{
        code:0,
        data:{
            list:list,
            AllCount:length[0]['count(*)']
        }
    }
}
// 食品审核
async function audit(data){
    let a = await c(`update food_audit set audit_status = '${data.auditStatus}',reasons = '${data.reasons}',verifier = '${data.userId}',food_audit = '${data.time}' where food_id = ${data.foodId}`)
    let food_audit = await c(`select * from food_audit where food_id = ${data.foodId}`)
    if(data.auditStatus=='通过'){
        let b = await c(`select * from food where food_name = '${food_audit[0].food_name}' and dept = ${food_audit[0].dept} and food_classify = ${food_audit[0].food_classify}`)
        if(b.length!==0){
            await c(`update food set food_amount = ${Number(b[0].food_amount)+Number(food_audit[0].food_amount)} where food_id = ${b[0].food_id}`)
        }else{
            let d = await c(`insert into food (food_name,food_create,food_price,food_classify,food_amount,dept) values (
                '${food_audit[0].food_name}','${food_audit[0].food_create}','','${food_audit[0].food_classify}',
                '${food_audit[0].food_amount}','${food_audit[0].dept}');`)
        }
    }
    return{
        code:0,
        msg:"审核成功"
    }
}
// 食品审核修改
async function foodAuditUpt(data){
    let a = await c(`update food_audit set food_classify = '${data.foodClassify}',food_name = '${data.foodName}',food_amount = '${data.foodAmount}',audit_status = '未审核' where food_id = ${data.id}`)
    return{
        code:0,
        msg:"修改成功"
    }
}
// 食品价格修改
async function foodListUpt(data){
    let a = await c(`update food set food_price = '${data.foodPrice}' where food_id = ${data.foodId}`)
    return{
        code:0,
        msg:"修改成功"
    }
}

exports.server = async function(url,data,callback){
    console.log(url)
    var sql
    let date = new Date().getTime()
    
    if(url==='/f/abcd'){
        s = await c(`SELECT * from menu order by menu_id desc`)
        let list = s.map((item)=>{
            return {menuId:item.menu_id,menuName:item.menu_name,parentId:item.parent_id,path:item.path,component:item.component,menuType:item.menu_type,menuCreate:item.menu_create,menuModified:item.menu_modified,remark:item.remark,orderNum:item.order_num,icon:item.icon,son:item.son,perms:item.perms}
        })
        return {
            code:0,
            msg:'查询成功',
            data:{
                list:list
            }
        }
    }else if(url==='/f/userAction/mobileLogin'){
        let s = await c(`select * from token where token ='${data.userName}'`)
        if(s.length===0){
            return mobileLogin(data)
        }else if(date-s[0].time>1800000){
            await c(`delete from token where token = '${data.userName}'`)
            return mobileLogin(data)
        }else{
            return{
                code:123,
                msg:'其他用户正在使用本账户'
            }
        }
    }else{
        let d = await c(`select * from token where token ='${data.token}'`)
        console.log('d',d,d[0].time,date)
        if(date-d[0].time>1800000){
            await c(`delete from token where token = '${data.token}'`)
            return{
                code:123,
                msg:'时间超出，请重新登陆'
            }
        }
    }
    switch(url){
            // 登录
        // case '/f/userAction/mobileLogin':
        //     return mobileLogin(data)
        //     break;
            // 商品列表
        case '/f/logout':
            return logout(data);
            break;
            // 商品列表
        case '/f/goodsAction/goodsQry':
            return goodsQry(data)
            break;
            // 商品新增
        case '/f/goodsAction/goodsAdd':
            return goodsAdd(data)
            break;
            // 商品删除
        case '/f/goodsAction/goodsDel':
            return goodsDel(data)
            break;
            //商品修改
        case '/f/goodsAction/goodsUpt':
            return goodsUpt(data)
            break;
            // 商品列表
        case '/f/goodsAction/goodsQry1':
            return goodsQry1(data)
            break;
            // 商品新增
        case '/f/goodsAction/goodsAdd1':
            return goodsAdd1(data)
            break;
            // 商品删除
        case '/f/goodsAction/goodsDel1':
            return goodsDel1(data)
            break;
            //商品修改
        case '/f/goodsAction/goodsUpt1':
            return goodsUpt1(data)
            break;
            // 台桌列表
        case '/f/restAction/tableSync':
            return tableSync1(data)
            break;
            // 台桌新增
        case '/f/restAction/tableAdd':
            return tableAdd(data)
            break;
            // 台桌停用
        case '/f/restAction/tableStop':
            return tableStop(data)
            break;
            // 台桌删除
        case '/f/restAction/tableDel':
            return tableDel(data)
            break;
            // 点餐-查看所有餐桌状态
        case '/f/restAction/tableUse':
            return tableUse(data)
            break;
            // 点餐列表
        case '/f/restAction/order':
            return order(data)
            break;
            //点餐
        case '/f/restAction/pay':
            return pay(data)
            break;
            // 离开
        case '/f/restAction/leave':
            return leave(data)
            break;
            // 报表
        case '/f/rptAction/storeRptQry':
            return storeRptQry(data)
            break;
            // 店铺信息
        case '/f/userdata':
            return userdata(data)
            break;
        case '/f/sysadmin/listCategorysByCon':
            return sysadmin(data)
            break;
            // 用户列表
        case '/f/user/getUserData':
            return getUserData(data)
            break;
            // 用户新增
        case '/f/user/addUser':
            return addUser(data)
            break
            // 用户删除
        case '/f/user/delUser':
            return delUser(data)
            break
            // 用户修改
        case '/f/user/uptUser':
            return uptUser(data)
            break
            // 新增用户时角色下拉框
        case '/f/user/getRoleList':
            return getRoleList(data)
            break
            // 角色列表
        case '/f/role/getRoleData':
            return getRoleData(data)
            break
            // 角色新增
        case '/f/role/addRole':
            return addRole(data)
            break
        case '/f/role/rolePermission':
            return rolePermission()
            break
            // 角色更新
        case '/f/role/uptRole':
            return uptRole(data)
            break
            // 角色删除
        case '/f/role/delRole':
            return delRole(data)
            break
        case '/f/route':
            return route(data)
            break
            // 菜单管理列表
        case '/f/menu/getMenu':
            return getMenu(data)
            break
            // 菜单新增
        case '/f/menu/addMenu':
            return addMenu(data)
            break
            // 根据id获取菜单数据
        case '/f/nemu/getMenuById':
            return getMenuById(data)
            break
            // 菜单修改
        case '/f/menu/uptMenu':
            return uptMenu(data)
            break
            // 菜单删除
        case '/f/menu/delMenu':
            return  delMenu(data)
            break
            // 部门列表
        case '/f/dept/getDept':
            return getDept(data)
            break
            // 部门新增
        case '/f/dept/addDept':
            return addDept(data)
            break
            // 部门，根据id查数据
        case '/f/dept/getDeptById':
            return getDeptById(data)
            break
            // 部门修改
        case '/f/dept/uptDept':
            return uptDept(data)
            break
            // 部门删除
        case '/f/dept/delDept':
            return delDept(data)
            break;
            //  通过角色id查找
        case '/f/role/getRoleById':
            return getRoleById(data)
            break;
            // 新增用户时返回角色信息
        case '/f/user/getUserDept':
            return getUserDept(data)
            break
            // 字典分类列表
        case '/f/dictType/getDictType':
            return getDictType(data)
            break
            // 字典分类新增
        case '/f/dictType/addDictType':
            return addDictType(data)
            break
            // 字典分类修改
        case '/f/dictType/uptDictType':
            return uptDictType(data)
            break
            // 字典分类删除
        case '/f/dictType/delDictType':
            return delDictType(data)
            break
            // 字典列表
        case '/f/dict/getDict':
            return getDict(data)
            break
            // 字典新增
        case '/f/dict/addDict':
            return addDict(data)
            break
            // 字典修改
        case '/f/dict/uptDict':
            return uptDict(data)
            break
            // 字典删除
        case '/f/dict/delDict':
            return delDict(data)
            break
            // 商品分类
        case '/f/goods/getGoodsType':
            return getGoodsType(data)
            break
            // 个人中心详细信息
        case '/f/my/details':
            return details(data)
            break
            // 修改个人基础信息
        case '/f/my/myUptData':
            return myUptData(data)
            break
            // 修改个人密码
        case '/f/my/uptpsd':
            return uptpsd(data)
            break
            // 重置密码
        case '/f/user/resetPassword':
            return resetPassword(data)
            break
            // echarts图
        case '/f/home/echarts':
            return echarts(data)
            break
            // 上传图片
        case '/f/upload':
            upload(data,callback)
            break
            // 获取全部导入/导出数据
        case '/f/goodsAction/goodsAllData':
            return goodsAllData(data)
            break
        case '/f/goodsAction/importData':
            return importData(data)
            break
        case '/f/getOS':
            return getOS()
            break
            // 食品审核新增
        case '/f/food/foodAudit/add':
            return foodAuditAdd(data)
            break
            // 食品审核修改
        case '/f/food/foodAudit/upt':
            return foodAuditUpt(data)
            break
            // 食品审核列表
        case '/f/food/foodAudit/list':
            return foodAuditList(data)
            break
            // 食品分类
        case '/f/food/foodClassify':
            return foodClassify(data)
            break
            // 食品审核
        case '/f/food/foodAudit/audit':
            return audit(data)
            break
            // 食品列表
        case '/f/food/foodList/list':
            return foodList(data)
            break
            // 食品价格修改
        case '/f/food/foodList/upt':
            return foodListUpt(data)
            break
    }
    // return c(sql)
}
