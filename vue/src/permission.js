import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条 style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import {handleRoute} from '@/utils/qx'
import Layout from '@/layout'
import Cookies from "js-cookie";
import {sendServer} from './utils/common'
NProgress.configure({ showSpinner: false }) // 进度条配置
const whiteList = ['/login'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // 网页标题
  document.title = getPageTitle(to.meta.title)
  // 确定用户是否已经登录
  const hasToken = Cookies.get('token')
  // console.log(hasToken)
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      console.log(1)
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        console.log(2)
        next()
      } else {
        try {
          console.log(3)
          await store.dispatch('user/getInfo')
          // const accessRoutes = await store.dispatch('user/generateRoutes')
          // next()
          let rr = await handleRoute()
          console.log(rr)
          // router.addRoutes(rr)
          localStorage.setItem('rou',JSON.stringify(rr))
          router.addRoutes(rr)
          // next({ path: '/' })
          next({ ...to, replace: true })
        } catch (error) {
          console.log(4)
          // remove token and go to login page to re-login
          // await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {

      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
