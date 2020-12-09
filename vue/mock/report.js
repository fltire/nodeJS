const Day = {category:'日',StoreSumAmt:'3167',StoreSumCnt:'14',
  list:[
    {value: 335, name: '10:00~12:00'},
    {value: 634, name: '12:00~14:00'},
    {value: 245, name: '14:00~16:00'},
    {value: 365, name: '16:00~18:00'},
    {value: 743, name: '18:00~20:00'},
    {value: 845, name: '20:00~22:00'},
  ]
}
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
const Month = {category:'月',StoreSumAmt:'116463',StoreSumCnt:'542',
  list:[
    {value: 30021, name: '第一周'},
    {value: 28658, name: '第二周'},
    {value: 32598, name: '第三周'},
    {value: 24986, name: '第四周'},
  ]
}
module.exports = [
  //列表
  {
    url: '/rptAction/storeRptQry',
    type: 'post',
    response: config => {
      if(config.body.select=='日报'){
        return {code: 20000,data: Day}
      }else if(config.body.select=='周报'){
        return {code: 20000,data: Week}
      }else if(config.body.select=='月报'){
        return {code: 20000,data: Month}
      }
    }
  }
]
  