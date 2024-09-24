import { createRouter, createWebHistory } from 'vue-router'
import CountryView from '../views/CountryView.vue'
import AboutView from '../views/AboutView.vue'
import GlobalView from '@/views/GlobalView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CountryView
    },
    {
      path:'/about',
      name: 'about',
      component: AboutView
    },
    {
      path:'/global',
      name:'global',
      component:GlobalView
    }
  ]
})

export default router
