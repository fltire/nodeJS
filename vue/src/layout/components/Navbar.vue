<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <div class="breadcrumb-container">银石后台管理系统</div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="img" :src="img" class="user-avatar">
          <img v-else src="../../assets/404_images/img.png" class="user-avatar">
          <!-- <i class="el-icon-caret-bottom" /> -->
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link :to="{ path: '/my/my'}">
            <el-dropdown-item>
              个人中心
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import {sendServer} from '../../utils/common'
import Cookies from "js-cookie";
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data () {
    return {
      img:'',
      userId:''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  mounted () {
    this.userId = JSON.parse(localStorage.getItem('userdata')).userId
    this.details()
  },
  methods: {
    /**
         * 获取用户详细信息
         * @method details
         */
        details(){
            let Params = {},
                send = {}
            Params.url = '/f/my/details'
            send.userId = this.userId
            Params.send = send
            sendServer(Params,this).then(
                (res)=>{
                    console.log(res)
                    if(res.code===0){
                        // this.img = 'http://192.168.0.79:8083/'+res.data.img
                        this.img = 'http://127.0.0.1:8888/f/img/'+res.data.img
                    }
                },(res)=>{
                }
            )
        },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      let Params = {},
          send = {}
      Params.url = '/f/logout'
      Params.send = send
      sendServer(Params,this).then(
        (res)=>{
          Cookies.remove('token');
          window.localStorage.clear()
          localStorage.removeItem('rou')
          localStorage.removeItem('userdata')
          localStorage.removeItem('jurisdiction')
          this.$router.push(`/login`)
        },(res)=>{
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
  .breadcrumb-container {
    float: left;
    line-height:46px;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
