const issueList = [
    {QstsId:1,QstsTitle:'问题一',QstDesc:'问题一问题一问题一问题一问题一问题一问题一问题一问题一',QstsStatus:'已提交未解决',status:0,questioner:''}
] 
module.exports = [
    //店家查看问题列表
    {
        url: '/userAction/qstQry',
        type: 'post',
        response: config => {
            let list = issueList.slice(10*(config.body.page-1),10*config.body.page)
            if(list.length===0){
                list = issueList.slice(10*(config.body.page-2),10*(config.body.page-1))
            } 
            return {
                code: 20000,
                data: {
                    AllCount:issueList.length,
                    list:list
                }
            }
        } 
    },
    //店家查看问题详情，问题状态改为已阅读未解决
    {
        url: '/userAction/qstIdQry',
        type: 'post',
        response: config => {
            for(let i=0;i<issueList.length;i++){
                if(config.body.QstsId==issueList[i].QstsId){
                    if(issueList[i].status==1){
                        break;
                    }else{
                        issueList[i].QstsStatus='已阅读未解决'
                        break;
                    }
                }
            }
          return {
                code: 20000,
                data: {
                    issueList
                }
            }
        }
    },
    //店家解决问题，问题状态改为已解决
    {
        url: '/userAction/jiejue',
        type: 'post',
        response: config => {
            for(let i=0;i<issueList.length;i++){
                if(config.body.QstsId==issueList[i].QstsId){
                    issueList[i].QstsStatus='已解决已阅读'
                    issueList[i].status=1
                    break;
                }
            }
          return {
                code: 20000,
                data: '成功解决'
            }
        }
    },
    //提问着列表
    {
        url: '/userAction/MyqstQry',
        type: 'post',
        response: config => {
            let list =[]
            issueList.forEach(item =>{
                if(item.questioner=='fanwen'){
                    list.push(item)
                }
            })
            let AllCount = list.length
            list = list.slice(10*(config.body.page-1),10*config.body.page)
            if(list.length===0){
                list = list.slice(10*(config.body.page-2),10*(config.body.page-1))
            } 
            return {
                code: 20000,
                data: {
                    AllCount:AllCount,
                    list:list
                }
            }
        }
    },
    // 提问
    {
        url: '/userAction/qstAdd',
        type: 'post',
        response: config => {
            let QstsId = issueList.length?issueList[0].QstsId+1:1
            let data = {QstsId:QstsId,QstsTitle:config.body.QstsTitle,QstDesc:config.body.QstDesc,QstsStatus:'已提交未解决',status:0,questioner:'fanwen'}
            issueList.unshift(data)
          return {
              code: 20000,
              data: '新增成功'
            }
        }
    },
    {
        url: '/userAction/qstDel',
        type: 'post',
        response: config => {
            for(let i=0;i<issueList.length;i++){
                if(config.body.QstsId===issueList[i].QstsId){
                    issueList.splice(i,1)
                    break;
                }
            }
          return {
              code: 20000,
              data: '删除成功'
            }
        }
    },
    {
        url: '/restAction/table22342Sync',
        type: 'post',
        response: config => {
          return {
              code: 20000,
              data: {
              }
            }
        }
    }
  ]
  