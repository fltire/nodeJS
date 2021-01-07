<template>
    <div>
        <svg-icon icon-class="bug"></svg-icon>
    </div>
</template>
<script>
let axios = require('axios');
export default {
    data () {
        return {
            
        }
    },
    inject:["for"],
    mounted () {
        let date = new Date().getTime()
        console.log(this.for)

        	var formdata=new FormData();
			//可以通过append()方法来追加数据
			formdata.append("grant_type","client_credentials");
			formdata.append("client_id","chinabank");
			formdata.append("client_secret","1q2w3e*");
			axios({
                method: 'post',
                headers: {
                    "Content-Type":"application/x-www-form-urlencoded;charset=utf-8"
                },  
                url: 'http://58.221.197.178:7802/connect/token',
                data: 
                    "grant_type=client_credentials&client_id=chinabank&client_secret=1q2w3e*"
                // data:formdata
			}).then((res)=>{
				console.log(res)
			})
    }
}
</script>