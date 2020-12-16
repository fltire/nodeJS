/*!
* gaozh v1
*/
let jsonSha256 = require("./jsonSha256.js");
let pub = require("./pub.js");
let cfg = require("./../config/casher.function.js");
// let RSA = require('jsencrypt');
let des = require('./des.js');
let util = require('./util.js');
let axios = require('axios');

import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter,asyncRoutes } from '@/router'
import ElementUI from 'element-ui';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000, // request timeout
  headers: {
      'chnFlag': 1,
      'reqRandom':123456,
      'reqTime':'2019-04-26T19:16:13',
      'reqUUid':7540800653606912,
      'tellerId':'sys001',
      'departmentId':'AdminSDI200217000',
      'instId':'I01System001',
      'tellerFlag':1
    }
})
const sendServer = (urlParams, me) => {
    // const loginFlag = me.$store.state.loginFlag;
    // let LoginId = localStorage.getItem('LoginId') || '';
    // let UserId = localStorage.getItem('UserId') || '';
    // let MacKey = localStorage.getItem('MacKey') || '';
    let sha256Key = '';
    let date = new Date();
    let ssDate = util.ssformatTime(date);
    let params = {};
    let rc = "", sign = "";
    params = urlParams.send;
    // if (params.TxnId !== cfg.service.getLoginId.txnId) {
    //     if (LoginId) {
    //         params.LoginId = LoginId;
    //     }
    //     params.UserId = UserId;
        // MacKey=加密解密的数据    '77CE1A1B5FB09FAE765DDB84276B36AC'=密钥   "D"=工作模式
        // sha256Key = des.CalDES('MacKey', '77CE1A1B5FB09FAE765DDB84276B36AC', "D");
        // sha256Key = des.CalDES('MacKey', '77CE1A1B5FB09FAE765DDB84276B36AC', "D");
    // }
    // console.log(sha256Key)
    // console.log(params)
    // params.ChannelFlag = "4";
    params.time = ssDate;
    // params.SsPackReqTime = ssDate;
    // // // 生成6位随机数
    // pub.pubRandom(params);
    // let sparams = pub.pack(params);
    // console.log(sparams)
    return new Promise((resolve, reject) => {
    //     if (params.TxnId !== cfg.service.getLoginId.txnId) {
    //         sign = jsonSha256.mathJsonSha(sparams, sha256Key, 1);
    // //     }
    //         console.log(sparams)
    //     if(params.TxnId !== cfg.service.getLoginStatus.txnId){
    //         var loading = me.$loading({
    //             lock: true,
    //             text: '拼命加载中',
    //             background: 'rgba(0, 0, 0, 0.7)'
    //         })
    //     }
    // console.log( urlParams.send)
    service.post(urlParams.url, urlParams.send).then((res) => {
            // console.log(res)
            if (res.status === 200) {
                if(res.data.code===123){
                    ElementUI.Message({
                        message: '登录超时，请重新登陆',
                        type: 'error'
                    });
                    window.localStorage.clear()
                    removeToken()
                    resetRouter()
                    me.$router.push({ path:'/login'})
                }else{
                    resolve(res.data)
                }
            //     // console.log('data', res.data);//debug
            //     var unPackRes = pub.unPack(res.data);
            //     if (unPackRes.RespCode === '1076') {
            //         // me.$message.error("验签错误!");
            //         localStorage.removeItem('MacKey');
            //         localStorage.removeItem('LoginId');
            //         me.$store.commit('loginOut');
            //         me.$router.push('/login');
            //     }
            //     if (unPackRes.RespCode === '1077') {
            //         // if(params.TxnId !== cfg.service.getLoginStatus.txnId){
            //         //     me.$message.error("登陆超时!");
            //         // }
            //         localStorage.removeItem('MacKey');
            //         localStorage.removeItem('LoginId');
            //         me.$store.commit('loginOut');
            //         me.$router.push('/login');
            //     }

            //     // console.log(unPackRes)
            //     resolve(unPackRes); // 成功回调
            }
        }, (res) => {
            console.log(123)
            if(params.TxnId !== cfg.service.getLoginStatus.txnId) {
                // loading.close();
            }
            reject(false);// 失败回调
        });
    })
};
export {
    sendServer
};
 