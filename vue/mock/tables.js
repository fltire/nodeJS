const Mock = require('mockjs') // 引入mockjs
const Random = Mock.Random
const tablesList = []
for(let i = 0; i < 10; i ++) { // 可自定义生成的个数
    let template = {
      'TableTableId': Random.natural(1, 10), // 生成1到100之间自然数
      'TableTableName': Random.character(), // 生成随机字符串,可加参数定义规则
      'TableAddDate': Random.date(), // 生成一个随机日期,可加参数定义日期格式
      'TableStatus': Random.name(), // 生成姓名
      'TableUseStatus': Random.url(), // 生成web地址
      'use': Random.province() // 生成地址
    }
    tablesList.push(template)
}
module.exports = [
    //列表
    {
        url: '/restAction/tableSync',
        type: 'post',
        response: config => {
            let list = tablesList.slice(10*(config.body.page-1),10*config.body.page)
            if(list.length===0){
                list = tablesList.slice(10*(config.body.page-2),10*(config.body.page-1))
            } 
            return {
                code: 20000,
                data: {
                    AllCount:tablesList.length,
                    list:list
                }
            }
        }
    },
    // 桌台停用
    {
        url: '/restAction/tableStop',
        type: 'post',
        response: config => {
            tablesList.forEach(item =>{
                if(item.TableTableId===config.body.TableTableId){
                    if(item.TableStatus==='正常'){
                        item.TableStatus='已停用'
                    }else{
                        item.TableStatus='正常'
                    }
                }
            })
          return {
              code: 20000,
              data: '修改成功'
            }
        }
    },
    // 新增桌台
    {
        url: '/restAction/tableAdd',
        type: 'post',
        response: config => {
            let id = tablesList[0].TableTableId+1
            tablesList.unshift({TableTableId:id,TableTableName:config.body.name,TableAddDate:'2020-10-29',TableStatus:'正常',TableUseStatus:'空闲中',use:''})
          return {
              code: 20000,
              data: '新增成功'
            }
        }
    },
    // 删除桌台
    {
        url: '/restAction/tableDel',
        type: 'post',
        response: config => {
            for(let i=0;i<tablesList.length;i++){
                if(tablesList[i].TableTableId===config.body.TableTableId){
                    tablesList.splice(i,1)
                }
            }
          return {
              code: 20000,
              data: '新增成功'
            }
        }
    },
    // 客户使用桌台 
    {
        url: '/restAction/tableUse',
        type: 'post',
        response: config => {
          return {
              code: 20000,
              data: {
                tablesList
              }
            }
        }
    },
    // 客户选择桌台
    {
        url: '/restAction/shiyong',
        type: 'post',
        response: config => {
            tablesList.forEach((item,index) =>{
                if(item.TableTableId===config.body.TableTableId){
                    if(tablesList[index].use == 1){
                        tablesList[index].use = ''
                        tablesList[index].TableUseStatus='空闲中'
                    }else{
                        tablesList[index].use = 1
                        tablesList[index].TableUseStatus='使用中'
                    }
                }
            })
          return {
              code: 20000,
              data: '使用成功'
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
    },
  ]
  