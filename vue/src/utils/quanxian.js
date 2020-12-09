module.exports = {
    Function: [{
        FunctionId: 'goodsAction',
        FunctionName: '商品管理',
        Level: 1,//层级
        Sort: 5,//排序
        ChoseFlag: 2// 1：选中，2：未选择，3：子元素有选择
    },{
        FunctionId: 'goodsAdd',
        FunctionName: '商品增加',
        Level:2,
        Sort:1,
        ChoseFlag: 2
    },{
        FunctionId: 'goodsDel',
        FunctionName: '商品删除',
        Level:2,
        Sort:2,
        ChoseFlag: 2
    },{
        FunctionId: 'goodsUpt',
        FunctionName: '商品修改',
        Level:2,
        Sort:3,
        ChoseFlag: 2
    },{
        FunctionId: 'goodsQry',
        FunctionName: '商品查询',
        Level:2,
        Sort:4,
        ChoseFlag: 2
    }]
}