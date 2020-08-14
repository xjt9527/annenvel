import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/components/IndexPage'
import Login from '@/components/Login'
import OrderList from '@/components/OrderList'
import ShopList from '@/components/ShopList'
import ImgSort from '@/components/ImgSort'
import ImgList from '@/components/ImgList'
import CategoryList from '@/components/CategoryList'
import GoodSku from '@/components/GoodSku';
import GoodSpu from '@/components/GoodSpu'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage,
      children: [
        {
          path: '/orderlist',
          name: 'OrderList',
          component: OrderList,
          meta: { title: "订单管理" }
        }, {
          path: '/shoplist',
          name: 'ShopList',
          component: ShopList,
          meta: { title: "加盟商管理" }
        }, {
          path: '/imgsort',
          name: 'ImgSort',
          component: ImgSort,
          meta: { title: "图案分类管理" }
        },
        {
          path: '/imglist',
          name: 'ImgList',
          component: ImgList,
          meta: { title: '图案管理' }
        },
        {
          path: '/categorylist',
          name: 'CategoryList',
          component: CategoryList,
          meta: { title: '商品分类管理' }
        },
        {
          path: '/goodsku',
          name: 'GoodSku',
          component: GoodSku,
          meta: { title: '商品SKU管理' }
        },
        {
          path: '/goodspu',
          name: 'GoodSpu',
          component: GoodSpu,
          meta: { title: '商品SPU管理' }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
