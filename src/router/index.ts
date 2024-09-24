import { createRouter, createWebHistory } from 'vue-router'
import CountryView from '../views/CountryView.vue'
import AboutView from '../views/AboutView.vue'
import GlobalView from '@/views/GlobalView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'global',
      component: GlobalView
    },
    {
      path:'/about',
      name: 'about',
      component: AboutView
    },
    {
      path:'/detailed',
      name:'detailed',
      component:CountryView
    }
  ]
})

export default router
