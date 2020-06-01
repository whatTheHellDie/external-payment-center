import Vue from 'vue'
import Router from 'vue-router'
//import main from '@/views/main';
//import index from '@/views/index';
//import messageCenter from '@/views/messageCenter';
//import contactMerchant from '@/views/contactMerchant';
//import chargeCoin from '@/views/chargeCoin';
//import chargeCoinPay from '@/views/chargeCoin-pay';
//import chargeCoinCode from '@/views/chargeCoin-code';
//import withdrawCoin from '@/views/withdrawCoin';
//import property from '@/views/property';
//import incomeExpenses from '@/views/incomeExpenses';
Vue.use(Router)
const globalRoutes = [
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: resolve=>require(['@/views/main'],resolve),
  name: 'main',
  redirect: {name: 'login'},
  meta: {title: '主入口整体布局'},
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    {path: '/index', component: resolve=>require(['@/views/index'],resolve), name: 'index', meta: {title: '支付中心'}},
    {path: '/login', component: resolve=>require(['@/views/login'],resolve), name: 'login', meta: {title: '自动登录'}},
    {path: '/messageCenter', component: resolve=>require(['@/views/messageCenter'],resolve), name: 'messageCenter', meta: {title: '消息中心'}},
    {path: '/contactMerchant', component: resolve=>require(['@/views/contactMerchant'],resolve), name: 'contactMerchant', meta: {title: '联系商家'}},
    //path:charge永远不要写
    {path: '/chargeCoin', component: resolve=>require(['@/views/chargeCoin'],resolve), name: 'chargeCoin', meta: {title: '充币'}},
    {path: '/chargeCoinPay', component: resolve=>require(['@/views/chargeCoin-pay'],resolve), name: 'chargeCoinPay', meta: {title: '充币'}},
    {path: '/chargeCoinBank', component: resolve=>require(['@/views/chargeCoin-bank'],resolve), name: 'chargeCoinBank', meta: {title: '充币'}},
    {path: '/chargeCoinCode', component: resolve=>require(['@/views/chargeCoin-code'],resolve), name: 'chargeCoinCode', meta: {title: '充币'}},
    {path: '/chargeCoinCodeSifang', component: resolve=>require(['@/views/chargeCoin-code-sifang'],resolve), name: 'chargeCoinCodeSifang', meta: {title: '充币'}},
    {path: '/withdraw', component: resolve=>require(['@/views/withdraw'],resolve), name: 'withdraw', meta: {title: '提现'}},
    {path: '/withdrawCustomize', component: resolve=>require(['@/views/withdrawCustomize'],resolve), name: 'withdrawCustomize', meta: {title: '提现'}},
    {path: '/withdrawRecord', component: resolve=>require(['@/views/withdrawRecord'],resolve), name: 'withdrawRecord', meta: {title: '提现记录'}},
    {path: '/withdrawCoin', component: resolve=>require(['@/views/withdrawCoin'],resolve), name: 'withdrawCoin', meta: {title: '提币'}},
    {path: '/property', component: resolve=>require(['@/views/property'],resolve), name: 'property', meta: {title: '数字资产'}},
    {path: '/incomeExpenses', component: resolve=>require(['@/views/incomeExpenses'],resolve), name: 'incomeExpenses', meta: {title: '收支明细'}},
    {path: '/receipt', component: resolve=>require(['@/views/receipt'],resolve), name: 'receipt', meta: {title: '收款方式'}},
    {path: '/receiptEdit', component: resolve=>require(['@/views/receipt-edit'],resolve), name: 'receiptEdit', meta: {title: '编辑收款方式'}},
  ],
  beforeEnter(to, from, next) {
    // if (to.meta.title) {
    //   document.title = to.meta.title
    // }
    //  let token = Vue.cookie.get('sister-front-token')
    // alert("token:"+token)
    //  if (!token || !/\S/.test(token)) {
    //    clearLoginInfo()
    //    router.push({ name: 'login' })
    //  }else{
    //    http({
    //      url: http.adornUrl('/vue/member/info'),
    //      method: 'get',
    //    }).then(({data}) => {
    //      if (data && data.code === '0000') {
    //        Vue.cookie.set('sister-front-token', data.token)
    //        next()
    //      } else {
    //        router.push({ name: 'login' })
    //      }
    //    }).catch((e) => {
    //      router.push({ name: 'login' })
    //    })
    //  }
//  http({
//    url: http.adornUrl('/vue/member/info'),
//    method: 'get',
//  }).then(({data}) => {
//    if (data && data.code === '0000') {
//      Vue.cookie.set('sister-front-token', data.token)
//      next()
//    } else {
//      router.push({name: 'login'})
//    }
//  }).catch((e) => {
//    router.push({name: 'login'})
//  })
    next()
  }
}


const router = new Router({
  scrollBehavior: () => ({y: 0}),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

export default router;

//export default new Router({
// routes: [
// {
// path: '/',
// name: 'casino-dapp',
// component: CasinoDapp
// }
// ]
//})
