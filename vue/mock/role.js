const RolesList=[
  {
    RolesName:'店主',
    RolesDesc:'店的主人',
    RolesFuncMap:[
      {name:'商品',list:[
        {name:'商品新增',value:1},
        {name:'商品修改',value:1},
        {name:'商品删除',value:1},
      ]},
    ]
  }
]
const UsersList=[
  {UsersUserId:13,UsersUserMobile:12306,UsersName:'fanwen',UsersAddr:'南京',UsersStatus:'在职',UsersStoreEntryDate:'2020-10-21',UsersStoreLeaveDate:'',role:'管理员'},
  {UsersUserId:12,UsersUserMobile:12306,UsersName:'fanwen',UsersAddr:'南京',UsersStatus:'在职',UsersStoreEntryDate:'2020-10-21',UsersStoreLeaveDate:'',role:'管理员'},
  {UsersUserId:11,UsersUserMobile:12306,UsersName:'fanwen',UsersAddr:'南京',UsersStatus:'在职',UsersStoreEntryDate:'2020-10-21',UsersStoreLeaveDate:'',role:'管理员'},
  {UsersUserId:10,UsersUserMobile:12306,UsersName:'fanwen',UsersAddr:'南京',UsersStatus:'在职',UsersStoreEntryDate:'2020-10-21',UsersStoreLeaveDate:'',role:'管理员'},
  {UsersUserId:9,UsersUserMobile:12306,UsersName:'fanwen',UsersAddr:'南京',UsersStatus:'在职',UsersStoreEntryDate:'2020-10-21',UsersStoreLeaveDate:'',role:'管理员'},
  {UsersUserId:8,UsersUserMobile:12306,UsersName:'fanwen',UsersAddr:'南京',UsersStatus:'在职',UsersStoreEntryDate:'2020-10-21',UsersStoreLeaveDate:'',role:'管理员'},
  {UsersUserId:7,UsersUserMobile:12306,UsersName:'fanwen',UsersAddr:'南京',UsersStatus:'在职',UsersStoreEntryDate:'2020-10-21',UsersStoreLeaveDate:'',role:'管理员'},
  {UsersUserId:6,UsersUserMobile:12306,UsersName:'fanwen',UsersAddr:'南京',UsersStatus:'在职',UsersStoreEntryDate:'2020-10-21',UsersStoreLeaveDate:'',role:'管理员'},
  {UsersUserId:5,UsersUserMobile:12306,UsersName:'fanwen',UsersAddr:'南京',UsersStatus:'在职',UsersStoreEntryDate:'2020-10-21',UsersStoreLeaveDate:'',role:'管理员'},
  {UsersUserId:4,UsersUserMobile:12306,UsersName:'fanwen',UsersAddr:'南京',UsersStatus:'在职',UsersStoreEntryDate:'2020-10-21',UsersStoreLeaveDate:'',role:'管理员'},
  {UsersUserId:3,UsersUserMobile:12306,UsersName:'fanwen',UsersAddr:'南京',UsersStatus:'在职',UsersStoreEntryDate:'2020-10-21',UsersStoreLeaveDate:'',role:'管理员'},
  {UsersUserId:2,UsersUserMobile:12306,UsersName:'fanwen',UsersAddr:'南京',UsersStatus:'在职',UsersStoreEntryDate:'2020-10-21',UsersStoreLeaveDate:'',role:'管理员'},
  {UsersUserId:1,UsersUserMobile:12306,UsersName:'fanwen',UsersAddr:'南京',UsersStatus:'在职',UsersStoreEntryDate:'2020-10-21',UsersStoreLeaveDate:'',role:'管理员'},
]
module.exports = [
  //角色列表
  {
    url: '/storeAction/roleQry',
    type: 'post',
    response: config => {
      let list = RolesList.slice(10*(config.body.page-1),10*config.body.page)
      if(list.length===0){
        list = RolesList.slice(10*(config.body.page-2),10*(config.body.page-1))
      } 
      return {
        code: 20000,
        data: {
          AllCount:RolesList.length,
          RolesList:list
        }
      }
    }
  },
  //员工列表
  {
    url: '/storeAction/operQry',
    type: 'post',
    response: config => {
      let list =[]
      let AllCount = null
      if(config.body.UsersStatus!=''){
        UsersList.forEach(item =>{
          if(item.UsersStatus==config.body.UsersStatus){
            list.push(item)
          }
        })
        AllCount = list.length
        list = list.slice(10*(config.body.page-1),10*config.body.page)
        if(list.length===0){
          list = list.slice(10*(config.body.page-2),10*(config.body.page-1))
        } 
      }else{
        list = UsersList.slice(10*(config.body.page-1),10*config.body.page)
        if(list.length===0){
          list = UsersList.slice(10*(config.body.page-2),10*(config.body.page-1))
        } 
        AllCount = UsersList.length
      }
      return {
        code: 20000,
        data: {
          AllCount:AllCount,
          UsersList:list
        }
      }
    }
  },
  //员工新增
  {
    url: '/storeAction/operAdd',
    type: 'post',
    response: config => {
      let UsersUserId = UsersList.length?UsersList[0].UsersUserId+1:1
      let send = config.body
      send.UsersUserId = UsersUserId
      UsersList.unshift(send)
      return {
        code: 20000,
        data: '新增成功'
      }
    }
  },
  //员工修改
  {
    url: '/storeAction/operRolesUpt',
    type: 'post',
    response: config => {
      for(let i=0;i<UsersList.length;i++){
        if(config.body.UsersUserId===UsersList[i].UsersUserId){
          UsersList[i]=config.body
          break;
        }
      }
      return {
        code: 20000,
        data: '修改成功'
      }
    }
  },
  //员工删除
  {
    url: '/storeAction/operDel',
    type: 'post',
    response: config => {
      for(let i=0;i<UsersList.length;i++){
        if(config.body.UsersUserId===UsersList[i].UsersUserId){
          UsersList.splice(i,1)
          break;
        }
      }
      return {
        code: 20000,
        data: '删除成功'
      }
    }
  },
]
  