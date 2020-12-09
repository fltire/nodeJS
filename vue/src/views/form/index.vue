<template>
  <div>
    <div class='box' id='box'></div>
    <el-input style="width:300px" v-model="data" @change='wss'></el-input>
  </div>
</template>

<script>
var ws = new WebSocket('ws://localhost:8001');
export default {
  data() {
    return {
      data:''
    }
  },
  mounted () {
    this.init()
    
  },
  methods: {
    wss(){
      
      ws.send(this.data);
      let box = document.getElementById('box')
      let l = document.createElement('div')
      let s = document.createElement('div')
      let wen = document.createTextNode(this.data)
      s.appendChild(wen)
      s.style.background=' gold'
      s.style.float='right'
      s.style.height='30px'
      s.style.margin='10px'
      s.style.lineHeight='30px'
      l.style.overflow='hidden'
      l.appendChild(s)
      box.appendChild(l)
      this.data = ''
      box.scrollTop = box.scrollHeight
    },
    init(){
      if(window.WebSocket){
        
        ws.onopen = function(e){
          console.log("连接服务器成功");
          // 向服务器发送消息
          // ws.send("what`s your name?");
        }
        ws.onclose = function(e){
          console.log("服务器关闭");
        }
        ws.onerror = function(){
          console.log("连接出错");
        }
        // 接收服务器的消息
        ws.onmessage = function(e){
          let box = document.getElementById('box')
          let l = document.createElement('div')
          let s = document.createElement('div')
          let wen = document.createTextNode(e.data)
          s.appendChild(wen)
          s.className='left'
          s.style.background=' turquoise'
          s.style.float='left'
          s.style.height='30px'
          s.style.margin='10px'
          s.style.lineHeight='30px'
          l.style.overflow='hidden'
          l.appendChild(s)
          box.appendChild(l)
          box.scrollTop = box.scrollHeight
          console.log(e);
        }   
      }
    }
  }
}
</script>
<style scoped>
.box{
  width: 500px;
  height: 500px;
  border: 1px solid #000;
  overflow: auto;
}
.left{
  float: left;
  background:gold
}
</style>
