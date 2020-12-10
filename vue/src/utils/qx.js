import { Level } from 'chalk'
import quanxian from './quanxian'
import Layout from '@/layout'
import min from '@/layout/min.vue'
import {sendServer} from './common'
const funcMap2List = function (jurisdiction){
    let fun = []
    quanxian.Function.forEach((item) => {
        fun.push(item)
    })
    fun.sort(function(a,b){
        return a.Sort>b.Sort ? 1 : -1
    })
    let arr = []
    for (let i = 0; i < jurisdiction.length; i++) {
        if(jurisdiction[i]==='1'){
            let item = {
                FunctionId:fun[i].FunctionId,
                FunctionName:fun[i].FunctionName,
                Level:fun[i].Level
            }
            arr.push(item)
        }
    }
    console.log(arr)
    return arr
}
const role = function (jurisdiction){
    console.log(jurisdiction)
    let obj ={}
    jurisdiction.forEach((item) => {
        obj[item.FunctionId] = true
    })
    return obj
}
const List2funcMap = function (list){
    console.log(list)
    let fun = []
    quanxian.Function.forEach((item) => {
        fun.push(item)
    })
    fun.sort(function(a,b){
        return a.Sort>b.Sort ? 1 : -1
    })
    console.log(fun)
    let arr = []
    for(let i = 0;i<fun.length;i++){
        for(let j = 0;j<list.length;j++){
            if(list[j]===fun[i].FunctionId){
                arr.push('1')
                break;
            }
        }
        if(arr.length!==(i+1)){
            arr.push('0')
        }
    }
    console.log(arr.join(''))
    return arr.join('')
}
function handleRoute(){
return new Promise(rrr =>{
    let Params = {},
    send = {}
    Params.url = '/f/menu/getMenu'
    Params.send = send
    sendServer(Params,this).then(
        (res)=>{
            console.log(res)
            let list = paixu(res.data.list)
            // let list = xiugai(res.data.list)
            rrr(list)
        },(res)=>{
        }
        )
    })
}
function paixu(list){
    let cloneList = JSON.parse(JSON.stringify(list))
    let arr = cloneList.filter((father)=>{
      let s = cloneList.filter((children)=>{
        return father.menuId===children.parentId
      })
      s.sort((a,b)=>{
        return a.orderNum>b.orderNum ? 1 : -1
      })
      s.length===0 ? '' : father.children = s
      return father.parentId===0
    })
    arr.sort((a,b)=>{
      return a.orderNum>b.orderNum ? 1 : -1
    })
    let cloneArr = JSON.parse(JSON.stringify(arr))
    console.log(arr)
    let rlist = []
    recursionList(cloneArr,rlist)
    return rlist
}
function recursionList(arr,list){
    for(let i=0;i<arr.length;i++){
        if(arr[i].parentId==0){
            if(arr[i].menuType==='C'){
                list.push({path: '/'+arr[i].path,
                    component: Layout,
                    children: [
                        {
                            path: arr[i].path,
                            name: arr[i].menuName,
                            component: (resolve) => require([`@/views${arr[i].component}`] ,resolve),
                            meta: { title: arr[i].menuName, icon: arr[i].icon }
                        }
                    ]
                })
            }else if(arr[i].menuType==='M'){
                list.push({
                    path: '/'+arr[i].path,
                    component: Layout,
                    redirect: '/'+arr[i].path,
                    name: arr[i].menuName,
                    meta: { title: arr[i].menuName,icon: arr[i].icon},
                    children: []
                })
            }
        }else{
            if(arr[i].menuType==='C'){
                console.log(list)
                list.push({
                    path: arr[i].path,
                    hidden: false,
                    name: arr[i].menuName,
                    component: (resolve) => require([`@/views${arr[i].component}`] ,resolve),
                    meta: { title: arr[i].menuName, icon: arr[i].icon }
                })
            }else if(arr[i].menuType==='M'){
                list.push({
                    path: arr[i].path,
                    component: min,
                    hidden: false,
                    alwaysShow: true,
                    redirect: '/'+arr[i].path,
                    name: arr[i].menuName,
                    meta: { title: arr[i].menuName,icon: arr[i].icon },
                    children: []
                })
            }
        }
        if(arr[i].children){
            recursionList(arr[i].children,list[list.length-1].children)
        }
    }
    return
}
function xiugai(list){
    let clontList = JSON.parse(JSON.stringify(list))
    let asyncRoutes = []
    clontList.forEach((father) => {
    let s = []
    clontList.forEach(children => {
        if(father.menuId===children.parentId){
        s.push(children)
        }
    })
    let arrList = []
        s.forEach(item => {
            if(item.menuType==='C'){
                arrList.push({
                    path: item.path,
                    name: item.menuName,
                    component: (resolve) => require([`@/views${item.component}`] ,resolve),
                    meta: { title: item.menuName, icon: 'user' }
                })
            }else{
            }
        });
        if(father.parentId===0){
            if(father.menuType==='C'){
                asyncRoutes.push({
                path: '/'+father.path,
                component: Layout,
                children: [
                    {
                        path: father.path,
                        name: father.menuName,
                        component: (resolve) => require([`@/views${father.component}`] ,resolve),
                        meta: { title: father.menuName, icon: 'user' }
                    }
                ]
            })
            }else if(father.menuType==='M'){
                console.log(arrList)
                asyncRoutes.push({
                    path: '/'+father.path,
                    component: Layout,
                    redirect: '/'+father.path,
                    name: father.menuName,
                    meta: { title: father.menuName,icon: 'user' },
                    children: arrList
                })
            }
        }
    })
    return asyncRoutes
}
export{
    funcMap2List,
    role,
    List2funcMap,
    handleRoute
}