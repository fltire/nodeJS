const { json } = require('express');
const { symlinkSync } = require('fs');
var http = require('http');
var mysql = require('mysql');
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
        Name:'樊文的店铺',
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
    console.log(data1)
    let data = {
        token:'123',
        Name:'樊文的店铺',
    }
    let s =await c(`SELECT * from user where user_name like '${data1.UserMobile}' and password like '${data1.USerPwd}'`)
    let jurisdiction = null
    if(s.length!==0){
        let role = await c(`select role_id from user where user_name ='${data1.UserMobile}'`)
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
    }
    
    if(s.length!==0){
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
    let s = await c('SELECT * from goods order by id desc;')
    let list = s.slice(10*(data.page-1),10*data.page)
    if(list.length===0){
        list = s.slice(10*(data.page-2),10*(data.page-1))
    } 
    return {
        code: 20000,
        data: {
            AllCount:s.length,
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
    let date = new Date()
    console.log(date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    let p = `${year}-${month}-${day} ${hour}:${minute}:${second}`
    console.log(p)
    let s = await c(`insert into goods (GoodsName,GoodsTypeName,GoodsTypeId,GoodsRetailPrice,GoodsStock,GoodsAddDate,GoodsUnit) values ('${data.GoodsName}','${data.GoodsTypeName}','${data.GoodsTypeId}','${data.GoodsRetailPrice}','${data.GoodsStock}','${p}','${data.GoodsUnit}');`)
    return {
        data: '新增成功'
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
    let s = await c(`delete from goods where id = ${data.id}`)
    console.log('data',data)
    return {
        data: '删除成功'
    }
}
//商品修改
async function goodsUpt(data){
    let sql = `update goods set GoodsName = '${data.GoodsName}',GoodsTypeName = '${data.GoodsTypeName}',GoodsTypeId = '${data.GoodsTypeId}',GoodsRetailPrice = '${data.GoodsRetailPrice}',GoodsStock = '${data.GoodsStock}',GoodsUnit = '${data.GoodsUnit}' where id = ${data.id}`
    let s = await c(sql)
    return {
        data:'修改成功'
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
        if(item!=='page'&&data[item]!==''&&item!=='time'){
            key.push(item)
            if(item==='userName'){
                value.push(`user_name like '%${data[item]}%'`)
            }else{
                value.push(`${item} like '%${data[item]}%'`)
            }
        }   
    }
    if(key.length===0){
        s = await c(`SELECT * from user order by user_id desc limit ${(data.page-1)*10},10;`)
        length = await c(`select  count(*) from user`)
    }else{
       s = await c(`Select * from user where ${value.join(' and ')} order by user_id desc limit ${(data.page-1)*10},10;`)
       console.log(`Select * from user where ${value.join(' and ')} order by user_id desc limit ${(data.page-1)*10},10`)
       length = await c(`select  count(*) from user where ${value.join(' and ')} order by user_id desc `)
    }
    
    let list = s.map((item)=>{
        return {userId:item.user_id,userName:item.user_name,roleId:item.role_id,nickName:item.nick_name,phone:item.phone,userCreate:item.user_create,gender:item.gender,remark:item.remark,userModified:item.user_modified}
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
    let d = await c(`insert into user (user_name,nick_name,phone,gender,remark,user_create,password,role_id) values ('${data.userName}','${data.nickName}','${data.phone}','${data.gender}','${data.remark}','${data.time}','123456','${data.roleId}');`)
    console.log(d)
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
    let s = await c(`update user set user_name = '${data.userName}',nick_name = '${data.nickName}',phone = '${data.phone}',gender = '${data.gender}',remark = '${data.remark}',role_id = '${data.roleId}',user_modified = '${data.time}' where user_id = ${data.userId}`)
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
    let list = s.map((item) => {
        return {roleId:item.role_id,roleName:item.role_name}
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
        if(item!=='page'&&data[item]!==''&&item!=='time'){
            key.push(item)
            value.push(`${item} like '%${data[item]}%'`)
        }
    }
    if(key.length===0){
        s = await c(`SELECT * from role order by role_id desc limit ${(data.page-1)*10},10;`)
        
    }else{
    //    s = await c(`Select * from role where ${value.join(' and ')} order by id desc limit ${(data.page-1)*10},10`)
    }
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
        if(menu[0].menu_type==='F'){
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
    if(p.length!==0){
        return{
            code:1,
            msg:'此菜单有子节点，不能删除'
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
exports.server = async function(url,data){
    var sql
    switch(url){
        case '/list':
            return list()
            break;
        case '/add':
            sql = `insert into user (username,password) values ('${query.username}','${query.password}');`;
            break;
        case '/update':
            sql = `update user set username = '${query.username}',password = '${query.password}' where id = ${query.id}`
            break;
        case '/delete':
            sql =  `delete from user where id = ${query.id}`
            break;
            // 登录
        case '/f/userAction/mobileLogin':
            return mobileLogin(data)
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
            // 台桌列表
        case '/f/restAction/tableSync':
            return tableSync(data)
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
        case '/f/role/getRoleById':
            return getRoleById(data)
            break;

    }
    // return c(sql)
}
