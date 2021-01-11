<template>
    <div class="box">
        <span  v-for="(item,index) in route" class="item" :key="item.path" @click="select()" :style="{background:(now===item.name?'#42b983':'#fff') ,color:(now===item.name?'#fff':'#000')}">
            <router-link :to="item.path">
                {{item.name}}
            </router-link>
            <span class="el-icon-close close" @click="close(index)"></span>
        </span>
    </div>
</template>
<script>
export default {
    data () {
        return {
            route:[],
            now:''
        }
    },
    watch: {
        $route (e) {
            let p = {name:e.name,path:e.path}
            let s = 0
            for(let i=0;i<this.route.length;i++){
                if(this.route[i].path===p.path){
                    s++
                }
            }
            s===0?this.route.push(p):''
            this.now = e.name
        }
    },
    mounted(){
        console.log(this.$route)
        this.route.push({name:this.$route.name,path:this.$route.path})
        this.now = this.$route.name
    },
    methods:{
        select(){
            this.now = this.$route.name
        },
        close(index){
            let del = this.route.splice(index,1)
            console.log(del[0].name)
            console.log(this.now)
            let item = this.route[index]?this.route[index]:this.route[index-1]
            if(item){
                del[0].name===this.now?this.$router.push(item.path):''
            }else{
                this.$router.push('/');
            }
        }
    }
}
</script>
<style scoped>
.item{
    display: inline-block;
    border: 1px solid #d8dce5;
    cursor: pointer;
    line-height: 26px;
    height: 26px;
    font-size: 12px;
    margin-left: 5px;
    margin-top: 4px;
    padding: 0 8px;
}
.box{
    padding: 5px;
    background: white;
}
.close{
    width: 16px;
    height: 16px;
    border-radius: 50%;
    text-align: center;
    line-height: 16px;
}
.close:hover{
    background: slategrey;
    border-radius: 10px;
    color: snow;
}
</style>
