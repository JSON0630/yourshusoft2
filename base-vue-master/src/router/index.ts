import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Track = () => import('@pages/Track.vue')
const Pos = () => import('@pages/Pos.vue')

export const routes: IRoute[] = [
  { path: '/', name: '轨迹', component: Track, meta: { title: '设备轨迹' } },
  { path: '/pos', name: '轨迹', component: Pos, meta: { title: '追踪' } }
]

const router: Router = new Router({
  base: '/',
  routes
})

export default router
