import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg组件
 
// register globally
Vue.component('svg-icon', SvgIcon)
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => {
  return requireContext.keys().map(requireContext)
}
const requireAll1 = requireContext => requireContext.keys()

const re = /\.\/(.*)\.svg/
requireAll(req)
const icons = requireAll1(req).map(i => {
    return i.match(re)[1]
  })
export default icons