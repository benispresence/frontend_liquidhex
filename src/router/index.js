import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Mint from '../views/Mint.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/mint',
    name: 'Mint',
    component: Mint
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 