import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import min from '@/layout/min.vue'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: '首页',
      component: () => import('@/views/homePage/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },
  {
    path: '/my',
    component: Layout,
    children: [
      {
        path: 'my',
        name: '个人中心',
        component: () => import('@/views/my/index'),
        meta: { title: '个人中心', icon: 'goods' }
      }
    ]
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/home',
  //   children: [{
  //     path: 'home',
  //     name: '首页',
  //     component: () => import('@/views/home/index'),
  //     meta: { title: '首页', icon: 'home' }
  //   }]
  // },
]
// export function permissions() {
  
//  return asyncRoutes
// }
// export const asyncRoutes = [
//   {
//     path: '/',
//     component: Layout,
//     children: [{
//       path: 'home',
//       name: '首页',
//       component: () => import('@/views/homePage/index'),
//       meta: { title: '首页', icon: 'home' }
//     }]
//   },
//   {
//     path: '/system',
//     component: Layout,
//     redirect: '/system/user',
//     name: '用户管理',
//     meta: { title: '用户管理', icon: 'el-icon-s-help' },
//     children: [
//       {
//         path: 'user',
//         name: '用户管理',
//         component: () => import('@/views/system/user/index'),
//         meta: { title: '用户管理', icon: 'user' }
//       },
//       {
//         path: 'role',
//         name: '角色管理',
//         component: () => import('@/views/system/role/index'),
//         meta: { title: '角色管理', icon: 'role' }
//       },
//       {
//         path: 'menu',
//         name: '菜单管理',
//         component: () => import('@/views/system/menu/index'),
//         meta: { title: '菜单管理', icon: 'role' }
//       },
//       {
//         path: 'menu1',
//         name: '菜单管理1',
//         component:min,
//         hidden: false,
//         alwaysShow: true,
//         meta: { title: '菜单管理1', icon: 'role' },
//         children:[{
//           path: 'role',
//           hidden: false,
//           name: '角色3管理',
//           component: () => import('@/views/system/menu/index'),
//           meta: { title: '角色管3理', icon: 'role' }
//         },
//         {
//           path: 'ro2le',
//           hidden: false,
//           name: '角色33管理',
//           component: () => import('@/views/system/role/index'),
//           meta: { title: '角色2管3理', icon: 'role' }
//         }]
//       }
//     ]
//   },
 
//   {
//     path: '/goods',
//     component: Layout,
//     children: [
//       {
//         path: 'goods',
//         name: '商品',
//         component: () => import('@/views/goods/index'),
//         meta: { title: '商品', icon: 'goods' }
//       }
//     ]
//   },

//   {
//     path: '/report',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         name: '报表',
//         component: () => import('@/views/report/index'),
//         meta: { title: '报表', icon: 'report' }
//       }
//     ]
//   },
//   {
//     path: '/tables',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         name: '桌台',
//         component: () => import('@/views/tables/index'),
//         meta: { title: '桌台', icon: 'tables' }
//       }
//     ]
//   },
//   {
//     path: '/order',
//     component: Layout,
//     children: [
//       {
//         path: 'order',
//         name: '点餐',
//         component: () => import('@/views/tables/order'),
//         meta: { title: '点餐', icon: 'order' }
//       }
//     ]
//   },
//   {
//     path: '/issue',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         name: '问题',
//         component: () => import('@/views/issue/index'),
//         meta: { title: '问题', icon: 'order' }
//       }
//     ]
//   },
//   {
//     path: '/quiz',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         name: '提问',
//         component: () => import('@/views/issue/quiz'),
//         meta: { title: '提问', icon: 'order' }
//       }
//     ]
//   },
//   { path: '*', redirect: '/404', hidden: true }

//   // 404 page must be placed at the end !!!

// ]


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
// router.beforeEach((to, from, next) => {
//   // 路由权限接口放在这里
//   // console.log(to)
//   // console.log(from)
//   // console.log(next)
//   next()
// })
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
