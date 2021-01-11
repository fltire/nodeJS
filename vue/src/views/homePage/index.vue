<template>
    <div  style="height:100%;">
        <div class="top-left" id="topLeft"></div>
        <div class="top-left" id="topRight"></div>
    </div>
</template>
<script>
import { sendServer } from "../../utils/common";

export default {
  name: 'HelloWorld',
  data () {
    return {
    }
  },
  mounted () {
    this.getData()      
  },
  methods:{
    getData(){
      let Params = {},
        send = {}
      Params.url = '/f/home/echarts'
      send.userId = JSON.parse(localStorage.getItem("userdata")).userId
      Params.send = send
      sendServer(Params,this).then(
        (res)=>{
          console.log(res)
          if(res.code===0){
            this.echartsPie(res.data.goodsNum)
            this.echartsBar(res.data.goodsPrice,res.data.goodsName)
          }
        }
      )
    },
    /**
     * 饼图
     */
    echartsPie(e){
        var myChart = this.$echarts.init(document.getElementById('topLeft'));
        var option = {
          title:{
            text:'菜品数量占比图',
            left:"center"
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            top: '5%',
            left: 'center'
          },
          series: [
            {
              name: '菜品数量',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '40',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: e
            }
          ]
        };
      myChart.setOption(option);
      window.addEventListener("resize",function(){
        myChart.resize();
      });
    },
    echartsBar(goodsPrice,goodsName){
      var myChart = this.$echarts.init(document.getElementById('topRight'));
      var option = {
        title:{
          text:'菜品价格对比图',
          left:"center"
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} 元'
        },
        xAxis: {
          type: 'category',
          data: goodsName
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '菜品价格',
          data: goodsPrice,
          type: 'bar'
        }]
      };
      myChart.setOption(option);
      window.addEventListener("resize",function(){
        myChart.resize();
      });
    }
  }
}
</script>
<style  scoped>
.top-left{
  height: 70%;
  width: 50%;
  float: left;
}
</style>