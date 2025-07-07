import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./views/Home.vue";
const routes = [
  {
     path: '/',
    name: 'Home',
    
    component: Home,
  },
    {
     path: '/create',
    name: 'Create',
    component: () => import('./views/Create.vue'),
  },
    {
     path: '/lobby',
    name: 'Lobby',
    component: () => import('./views/Lobby.vue'),
  },
    {
     path: '/rules',
    name: 'Rules',
    component: () => import('./views/Rules.vue'),
  },
 
    {
     path: '/result',
    name: 'Result',
    component: () => import('./views/Result.vue'),
  },
   {
     path: '/game',
    name: 'Game',
    component: () => import('./views/Game.vue'),
  },
   


 
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router