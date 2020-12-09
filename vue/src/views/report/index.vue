<template>
    <div>
        <div class="top_btn" >
            <div @click="report('日报')" class="btn" :style="{color:(select==='日报'?'#fff':'#409eff'),background:(select==='日报'?'#409eff':'#ecf5ff')}">日报</div>
            <div @click="report('周报')" class="btn" :style="{color:(select==='周报'?'#fff':'#409eff'),background:(select==='周报'?'#409eff':'#ecf5ff')}">周报</div>
            <div @click="report('月报')" class="btn" :style="{color:(select==='月报'?'#fff':'#409eff'),background:(select==='月报'?'#409eff':'#ecf5ff')}">月报</div>
        </div>
        <div class='text'>店铺本{{category}}总收入为：￥{{StoreSumAmt}}，总交易笔数为：{{StoreSumCnt}}</div>
        <div id="chartsbar" style="width:50%;height:400px;float:left"></div>
        <div id="chartspie" style="width:50%;height:400px;float:left"></div>
    </div>
</template>
<script>
import {sendServer} from '../../utils/common'
export default {
    data () {
        return {
            select:'日报',
            category:'',
            StoreSumAmt:'',
            StoreSumCnt:'',
            list:[]
        }
    },
    mounted(){
        this.getData()
    },
    methods:{
        report(e){
            this.select = e
            this.getData()
        },
        getData(){
            let Params = {}
            let send = {
                select:this.select
            }
            Params.url = '/f/rptAction/storeRptQry'
            Params.send =send
            sendServer(Params,this).then(
                (res)=>{
                console.log(res.data)
                this.category = res.data.category
                this.StoreSumAmt = res.data.StoreSumAmt
                this.StoreSumCnt = res.data.StoreSumCnt
                this.chartsbar(res.data.list)
                this.chartspie(res.data.list)
                },(res)=>{
                }
            )
        },
        chartsbar(e){
            let value = []
            let data = []
            for(let i = 0;i<e.length;i++){
                value.push(e[i].value)
                data.push(e[i].name)
            }
            let chartsbar = this.$echarts.init(document.getElementById('chartsbar'))
            chartsbar.setOption({
                title:{text:`本${this.category}销售额`,
                left: 'center'},
                tooltip: {
                     trigger: 'item',
                    formatter: '{a} <br/>{b} : {c}元 '
                },
                xAxis: {
                    data: data
                },
                yAxis: {},
                series: [{
                    name: '销售额',
                    type: 'bar',
                    data: value
                }]
            });
            window.addEventListener('resize', () => {
                chartsbar.resize()
            })
        },
        chartspie(e){
            let value = []
            let data = []
            for(let i = 0;i<e.length;i++){
                value.push(e[i].name)
                data.push(e[i])
            }
            let chartspie = this.$echarts.init(document.getElementById('chartspie'))
            chartspie.setOption({
                title:{text:`本${this.category}销售额`,
                left: 'center'},
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c}元 ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    top:'center',
                    data:value
                },
                series: [{
                    name:'销售额',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            });
            window.addEventListener('resize', () => {
                chartspie.resize()
            })
        }
    }
}
</script>
<style scoped>
.top_btn{
    display: flex;
    justify-content: space-around;
}
.btn{
    border: 1px solid ;
    border-radius: 20px;
    padding: 12px 23px;
    cursor: pointer;
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
}
.btn:hover{
    background:#409eff;
    color: #fff;
}
.text{
    text-align: center;
    margin: 30px;
    font-size: 30px;
    font-weight: 800;
}
</style>