import { createRouter, createWebHistory } from 'vue-router'
import CountryView from '../views/CountryView.vue'
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
      path:'/detailed/:countryCode',
      name:'detailed',
      component:CountryView
    }
  ]
})

export default router
