import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(function(to, from, next){
  if(to.meta.requiresUnAuth && localStorage.getItem('token')){
    next('/')
  }
  else if(to.meta.requiresAuth && !localStorage.getItem('token')){
    next('/login')
  }
  else{
    next()
  }
})
export default router
