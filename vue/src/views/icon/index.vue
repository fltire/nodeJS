<template>
    <div id="box">
        <div class="title">点击可复制icon</div>
        <div class="icon">
            <div v-for="item in icons" :key="item" class="item" @click="cb(item)">
                <div style="margin-top:35px;font-size:20px"><svg-icon :icon-class="item" ></svg-icon></div>
                <div style="margin-top:15px;margin-bottom:35px">{{item}}</div>
            </div>
            
        </div>
        <div style="position: relative;">
            <input style="" id="input"/>
            <div style="background:#fff;position: absolute;top:0;bottom:0;left:0;right:0"></div>
        </div>
    </div>
</template>
<script>
import icons from '../../icons/index'
export default {
    data () {
        return {
            icons:''
        }
    },
    mounted () {
        this.icons = icons
    },
    methods: {
        cb(e){
            var input = document.getElementById("input");
            input.value = `<svg-icon icon-class="${e}" ></svg-icon>`
            input.select()
            document.execCommand("Copy")
            this.$message({
                message: input.value,
                type: 'success'
            });
       }
    }
}
</script>
<style scoped>
.icon{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-top: 10px;
    margin-bottom: 10px;
    
}
.item{
    width: 130px;
    text-align: center;
    
}

.item:hover{
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
.title{
    padding: 15px;
    background: #eef1f6;
    margin: 20px;
}
</style>